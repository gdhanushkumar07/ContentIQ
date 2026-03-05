import { NextResponse } from "next/server";
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { InvokeCommand } from "@aws-sdk/client-lambda";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, bedrock, lambda } from "@/lib/aws";

export const runtime = "nodejs";
export const maxDuration = 300; // Allow 5 full minutes for Lambda + Nova Pro Pipeline

// ─── Model IDs from environment variables ──
const NOVA_LITE = process.env.NOVA_LITE_MODEL_ID || "us.amazon.nova-lite-v1:0";
const NOVA_PRO = process.env.NOVA_PRO_MODEL_ID || "us.amazon.nova-pro-v1:0";

// ─── Helper: invoke Bedrock Nova with text only ───────────────────────────────
async function invokeNova(
    modelId: string,
    systemPrompt: string,
    userContent: string
): Promise<string> {
    const fullPrompt = `${systemPrompt}\n\n${userContent}`;
    const body = JSON.stringify({
        messages: [{ role: "user", content: [{ text: fullPrompt }] }],
        inferenceConfig: { maxTokens: 2048, temperature: 0.4, topP: 0.9 },
    });
    const cmd = new InvokeModelCommand({ modelId, contentType: "application/json", accept: "application/json", body });
    const res = await bedrock.send(cmd);
    const decoded = JSON.parse(new TextDecoder().decode(res.body));
    return decoded?.output?.message?.content?.[0]?.text ?? decoded?.content?.[0]?.text ?? "";
}

// ─── Helper: invoke Nova with real image frames (multimodal) ──────────────────
interface FrameSample { timestamp: number; base64: string }

async function invokeNovaWithImages(
    modelId: string,
    systemPrompt: string,
    textPrompt: string,
    frames: FrameSample[]
): Promise<string> {
    const content: any[] = [];

    // Explicitly label each image with its timestamp in the message sequence
    for (const f of frames) {
        content.push({ text: `[Frame captured at ${f.timestamp} seconds]:` });
        content.push({
            image: {
                format: "jpeg",
                source: { bytes: f.base64 },
            },
        });
    }

    content.push({ text: `${systemPrompt}\n\n${textPrompt}` });

    const body = JSON.stringify({
        messages: [{ role: "user", content }],
        // Increased to 8192 to ensure complete timeline arrays are never truncated
        inferenceConfig: { maxTokens: 8192, temperature: 0.4, topP: 0.9 },
    });
    const cmd = new InvokeModelCommand({ modelId, contentType: "application/json", accept: "application/json", body });
    const res = await bedrock.send(cmd);
    const decoded = JSON.parse(new TextDecoder().decode(res.body));
    return decoded?.output?.message?.content?.[0]?.text ?? decoded?.content?.[0]?.text ?? "";
}

// ─── Helper: safe JSON parse from model output ────────────────────────────────
function safeJson<T>(raw: string, fallback: T): T {
    try {
        const match = raw.match(/```json\s*([\s\S]*?)```/) ||
            raw.match(/\{[\s\S]*\}/) ||
            raw.match(/\[[\s\S]*\]/);
        return JSON.parse(match ? match[1] ?? match[0] : raw);
    } catch {
        return fallback;
    }
}

// ─── Helper: format seconds → "M:SS" ─────────────────────────────────────────
function fmt(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
}

// ─── Scoring helpers (module-level) ──────────────────────────────────────────
const computeEngagementScore = (
    deliveryScore: number,
    visualInterest: number,
    semanticScore: number,
    confusionProbability: number,
    boredomThreshold: number,
    curiositySpike: boolean
): number => {
    const base =
        deliveryScore * 0.25 +
        visualInterest * 0.25 +
        semanticScore * 0.25 +
        (100 - confusionProbability) * 0.15 +
        (100 - boredomThreshold) * 0.10;
    const bonus = curiositySpike ? 5 : 0;
    return Math.min(100, Math.max(0, Math.round(base + bonus)));
};

const getCategory = (score: number): "LOW" | "AVERAGE" | "HIGH" => {
    if (score >= 70) return "HIGH";
    if (score >= 45) return "AVERAGE";
    return "LOW";
};

const getRecommendation = (score: number): "Highlight" | "Keep" | "Trim" | "Cut" => {
    if (score >= 80) return "Highlight";
    if (score >= 65) return "Keep";
    if (score >= 45) return "Trim";
    return "Cut";
};

// ─── Types ───────────────────────────────────────────────────────────────────
interface RawScene { sceneId: string; start: number; end: number }

interface SceneResult {
    sceneId: string;
    timestamp: string;
    start: number;
    end: number;
    engagementScore: number;
    viralityScore: number;
    category: "LOW" | "AVERAGE" | "HIGH";
    recommendation: "Highlight" | "Keep" | "Trim" | "Cut";
    sceneContent: string;
    audioContent: string;          // ← Actual spoken words in this scene
    audienceReview: string;
    whyItWorked: string | null;
    whyItFailed: string | null;
    reshootGuide: {
        delivery: string;
        visual: string;
        script: string;
        duration: string;
        pacing: string;
        emotion: string;
        musicSuggestion: string;
    };
    deliveryQuality: number;
    visualVariation: number;
    semanticInterest: number;
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
    try {
        const { s3Key, durationSeconds: clientDuration, frames: clientFrames, category } = await req.json();
        if (!s3Key) {
            return NextResponse.json({ error: "Missing s3Key" }, { status: 400 });
        }
        const videoCategory = category || "General";
        const realDuration: number = (typeof clientDuration === "number" && clientDuration > 0)
            ? Math.round(clientDuration)
            : 60;
        // Frames sent by the browser (base64 JPEG snapshots at real timestamps)
        const videoFrames: FrameSample[] = Array.isArray(clientFrames) ? clientFrames : [];

        const bucket = process.env.S3_BUCKET_NAME!;

        // ════════════════════════════════════════════════════════════════════
        // STAGE 1 — Secure Intake: validate key exists in private S3 bucket
        // ════════════════════════════════════════════════════════════════════
        let videoMeta: { contentType: string; contentLength: number } = {
            contentType: "video/mp4",
            contentLength: 0,
        };
        try {
            const head = await s3.send(
                new HeadObjectCommand({ Bucket: bucket, Key: s3Key })
            );
            videoMeta = {
                contentType: head.ContentType ?? "video/mp4",
                contentLength: head.ContentLength ?? 0,
            };
        } catch {
            return NextResponse.json({ error: "Video not found in S3" }, { status: 404 });
        }

        // Generate a presigned URL so Nova can reference the file path context
        const presignedUrl = await getSignedUrl(
            s3,
            new GetObjectCommand({ Bucket: bucket, Key: s3Key }),
            { expiresIn: 900 }
        );

        // ════════════════════════════════════════════════════════════════════
        // STAGE 2 & 3 — Parallel Audio & Vision Analysis
        // ════════════════════════════════════════════════════════════════════
        let spokenTranscript = "No audio transcript available.";
        let timelineData: any[] = [];

        // Determine interval size: 1s for <30s, 2s for <120s, scaling up safely
        const intervalSize = realDuration <= 30 ? 1 : realDuration <= 120 ? 2 : Math.max(3, Math.ceil(realDuration / 60));
        const intervals = [];
        for (let i = 0; i < realDuration; i += intervalSize) {
            intervals.push({ start: i, end: Math.min(i + intervalSize, realDuration) });
        }

        const timelinePrompt = `You are analyzing a ${realDuration}-second video. I have provided ${videoFrames.length} frame images captured at different timestamps throughout the video.

CRITICAL INSTRUCTIONS:
1. You MUST analyze EACH of the following ${intervals.length} time intervals SEPARATELY
2. Look at the frame images I provided - each frame has a timestamp label
3. For EACH interval below, determine what's happening in that specific time range
4. DO NOT repeat the same analysis for all intervals
5. If frames show different content at different times, your analysis MUST reflect those differences

Time intervals to analyze:
${JSON.stringify(intervals, null, 2)}

For EACH interval above, you must output a separate JSON object with:
- "start": exact start time from the interval
- "end": exact end time from the interval  
- "visualContent": Describe what's actually visible in frames from this time range (e.g., "Person speaking to camera", "Blank black screen", "Gameplay footage", "Text overlay")
- "isStatic": true only if the frame is completely frozen/still (blank screen, static image), false if there's any movement
- "deliveryQuality": 0-100 (speaking energy and quality - use 0 for silent/blank sections)
- "semanticInterest": 0-100 (information value - use 0 for blank/empty sections)
- "confusionProbability": 0-100 (how confusing this section would be)
- "boredomThreshold": 0-100 (how boring - use 100 for blank screens)
- "curiositySpike": boolean (does this moment grab attention?)

IMPORTANT: Your timeline array MUST contain ${intervals.length} objects, one for each interval. Each object must have different values based on what's actually happening at that timestamp.

Return ONLY valid JSON:
{
  "timeline": [
    {"start": 0, "end": 2, "visualContent": "...", "isStatic": false, "deliveryQuality": 80, "semanticInterest": 75, "confusionProbability": 10, "boredomThreshold": 20, "curiositySpike": true},
    {"start": 2, "end": 4, "visualContent": "...", "isStatic": false, "deliveryQuality": 75, "semanticInterest": 70, "confusionProbability": 15, "boredomThreshold": 25, "curiositySpike": false}
  ]
}`;

        // ─── Promise 1: Audio Transcription (Lambda) ───
        const transcribePromise = (async () => {
            try {
                const lambdaName = process.env.TRANSCRIBE_LAMBDA_NAME;
                if (!lambdaName) {
                    console.warn("Skipping transcription - TRANSCRIBE_LAMBDA_NAME is not set.");
                    return;
                }
                console.log(`[Parallel] Invoking Transcript Lambda: ${lambdaName} for ${s3Key}`);
                const invokeCmd = new InvokeCommand({
                    FunctionName: lambdaName,
                    InvocationType: "RequestResponse",
                    Payload: JSON.stringify({
                        body: JSON.stringify({ s3Key, bucketName: bucket })
                    })
                });

                const lambdaRes = await lambda.send(invokeCmd);
                const responsePayload = JSON.parse(new TextDecoder().decode(lambdaRes.Payload));

                if (responsePayload.statusCode === 200 && responsePayload.body) {
                    const parsedBody = JSON.parse(responsePayload.body);
                    if (parsedBody.transcript) {
                        spokenTranscript = parsedBody.transcript;
                        console.log(`[Parallel] Transcribed audio successfully (${spokenTranscript.length} chars)`);
                    }
                } else {
                    console.warn("[Parallel] Lambda returned an error or empty transcript:", responsePayload);
                }
            } catch (lambdaErr) {
                console.error("[Parallel] Failed to invoke transcription Lambda:", lambdaErr);
            }
        })();

        // ─── Promise 2: Vision Analysis (Nova) ───
        const visionPromise = (async () => {
            try {
                console.log(`[Parallel] Invoking Nova Multimodal for ${videoFrames.length} frames`);
                const timelineRaw = await invokeNovaWithImages(
                    NOVA_LITE,
                    "You are a multimodal video timeline analyzer. Analyze each frame image separately based on its timestamp. Output only JSON.",
                    timelinePrompt,
                    videoFrames.slice(0, 20)
                );

                const parsed = safeJson<{ timeline: any[] }>(timelineRaw, { timeline: [] });
                timelineData = parsed.timeline || [];
                console.log(`[Parallel] Nova Vision returned ${timelineData.length} intervals`);
            } catch (e) {
                console.error("[Parallel] Timeline extraction failed:", e);
                timelineData = [];
            }
        })();

        // ─── WAIT FOR BOTH TO FINISH ───
        await Promise.all([transcribePromise, visionPromise]);

        // Map Nova output back to precise mathematical intervals (safeguard)
        const fullTimeline = intervals.map(inv => {
            // Try to find exact match first by start time
            let found = timelineData.find((t: any) => t.start === inv.start && t.end === inv.end);

            // If no exact match, find by overlap (midpoint of interval falls within Nova's segment)
            if (!found) {
                const mid = (inv.start + inv.end) / 2;
                found = timelineData.find((t: any) => mid >= t.start && mid < t.end);
            }

            // If still no match, find closest by start time
            if (!found && timelineData.length > 0) {
                found = timelineData.reduce((closest: any, current: any) => {
                    const closestDiff = Math.abs(closest.start - inv.start);
                    const currentDiff = Math.abs(current.start - inv.start);
                    return currentDiff < closestDiff ? current : closest;
                });
            }

            return {
                start: inv.start,
                end: inv.end,
                visualContent: found?.visualContent || "Visual content not analyzed",
                isStatic: found?.isStatic || false,
                deliveryQuality: found?.deliveryQuality ?? 50,
                semanticInterest: found?.semanticInterest ?? 50,
                confusionProbability: found?.confusionProbability ?? 30,
                boredomThreshold: found?.boredomThreshold ?? 40,
                curiositySpike: found?.curiositySpike ?? false
            };
        });

        console.log("=== RAW NOVA TIMELINE OUTPUT ===");
        console.table(timelineData);
        console.log("=== EXACT MAPPED TIMELINE ===");
        console.table(fullTimeline);

        // ════════════════════════════════════════════════════════════════════
        // STAGE 4 — Strict Static Penalty & Score Computation
        // Compute engagement score per interval BEFORE grouping
        // ════════════════════════════════════════════════════════════════════
        let consecutiveStaticTime = 0;
        const scoredTimeline = fullTimeline.map(interval => {
            const dur = interval.end - interval.start;
            const looksBlank = interval.visualContent.toLowerCase().includes("blank") || interval.visualContent.toLowerCase().includes("black screen");

            if (interval.isStatic || looksBlank) {
                consecutiveStaticTime += dur;
            } else {
                consecutiveStaticTime = 0;
            }

            let baseScore = computeEngagementScore(
                interval.deliveryQuality,
                (interval.isStatic || looksBlank) ? 10 : 70, // proxy visual interest
                interval.semanticInterest,
                interval.confusionProbability,
                interval.boredomThreshold,
                interval.curiositySpike
            );

            // 🔥 STRICT PENALTY: > 2s of static/blank screen destroys engagement
            if (consecutiveStaticTime > 2) {
                baseScore = Math.min(4, baseScore);
            }

            return { ...interval, engagementScore: baseScore };
        });

        // ════════════════════════════════════════════════════════════════════
        // STAGE 5 — Dynamic Scene Grouping
        // Group adjacent intervals into "Scenes" if score/content remains stable
        // ════════════════════════════════════════════════════════════════════
        const groupedScenes: any[] = [];
        if (scoredTimeline.length > 0) {
            let currentScene = { ...scoredTimeline[0], intervals: [scoredTimeline[0]] };

            for (let i = 1; i < scoredTimeline.length; i++) {
                const curr = scoredTimeline[i];
                const prev = scoredTimeline[i - 1];

                const scoreDelta = Math.abs(curr.engagementScore - prev.engagementScore);
                const categoryChanged = getCategory(curr.engagementScore) !== getCategory(prev.engagementScore);
                const isStaticShift = curr.isStatic !== prev.isStatic;
                const durationLength = curr.end - currentScene.start;

                // Break scene if: score swings hard (>15), category shifts, staticness changes, or >15s length
                if (scoreDelta > 15 || categoryChanged || isStaticShift || durationLength >= 15) {
                    groupedScenes.push(currentScene);
                    currentScene = { ...curr, start: curr.start, end: curr.end, intervals: [curr] };
                } else {
                    currentScene.end = curr.end;
                    currentScene.intervals.push(curr);
                }
            }
            groupedScenes.push(currentScene); // push final scene
        }

        // Aggregate intervals into Scene objects
        const finalGroupedScenes = groupedScenes.map((scene, idx) => {
            const avgScore = Math.round(scene.intervals.reduce((acc: number, val: any) => acc + val.engagementScore, 0) / scene.intervals.length);
            const avgDel = Math.round(scene.intervals.reduce((acc: number, val: any) => acc + val.deliveryQuality, 0) / scene.intervals.length);
            const avgSem = Math.round(scene.intervals.reduce((acc: number, val: any) => acc + val.semanticInterest, 0) / scene.intervals.length);
            const looksBlank = scene.intervals.some((i: any) => i.isStatic);
            const avgVis = looksBlank ? 10 : 70; // visual proxy for the UI

            return {
                sceneId: `S${idx + 1}`,
                start: scene.start,
                end: scene.end,
                engagementScore: avgScore,
                category: getCategory(avgScore),
                recommendation: getRecommendation(avgScore),
                sceneContent: scene.intervals[0].visualContent, // Use primary visual content context
                deliveryQuality: avgDel,
                visualVariation: avgVis,
                semanticInterest: avgSem
            };
        });

        // ════════════════════════════════════════════════════════════════════
        // STAGE 6 — Human-Like Review & Reshoot Direction
        // ════════════════════════════════════════════════════════════════════
        const reviewPrompt = `You are simultaneously a real viewer AND a professional video director reviewing a creator's video.
The full video transcript is provided. For each scene, extract the approximate spoken words that fall within its timestamp range.

For each scene below, write:
1. AUDIO CONTENT — The specific words/sentences spoken during this scene's timestamp. Extract directly from the transcript below. If none, write "[No spoken audio]"
2. An AUDIENCE REVIEW — 1–2 sentences written in first-person viewer voice ("I felt...", "This part made me...")
3. WHY IT WORKED — if the engagement score is >= 65, explain what made it work (1 sentence). Otherwise "null".
4. WHY IT FAILED — if the engagement score is < 65, explain what caused disengagement (1 sentence). Otherwise "null".
5. VIRALITY SCORE — A score from 0-100 for this specific scene based on its hook potential, emotional resonance, shareability, and uniqueness.
6. A DETAILED RESHOOT GUIDE with fields: delivery (specific tone/phrasing guidance), visual (camera & light direction), script (alternative script suggestion or improvement), duration (timing advice), pacing (cut speed and rhythm advice), emotion (target emotional state to convey), musicSuggestion (specific music genre or instrument recommendation for background).

Full Video Transcript:
"""${spokenTranscript}"""

Scenes with engagement data:
${JSON.stringify(finalGroupedScenes.map((s: any) => ({
            sceneId: s.sceneId,
            timestamp: `${fmt(s.start)}–${fmt(s.end)}`,
            startSec: s.start,
            endSec: s.end,
            engagementScore: s.engagementScore,
            category: s.category,
            visualContent: s.sceneContent
        })))}

Return ONLY valid JSON (matching this schema perfectly):
{
  "scenes": [
    {
      "sceneId": "S1",
      "audioContent": "Welcome to today’s review. I’m going to show you why...",
      "viralityScore": 82,
      "audienceReview": "I was immediately hooked by the confident opening.",
      "whyItWorked": "The strong opening statement and direct eye contact created instant trust.",
      "whyItFailed": null,
      "reshootGuide": {
        "delivery": "Keep the confident, direct-to-camera energy. Slow down slightly on key phrases.",
        "visual": "Try an extreme close-up on the product reveal moment. Improve key lighting.",
        "script": "Open with a provocative question instead: 'What if this $20 product outperforms a $500 one?'",
        "duration": "Trim by 2 seconds — cut the pause after the intro line.",
        "pacing": "Keep fast cuts but add a 0.5s hold on the product reveal for emphasis.",
        "emotion": "Convey genuine excitement and discovery — act as if you're sharing a secret.",
        "musicSuggestion": "Upbeat electronic with a 120BPM build — think Sabrina Carpenter vibes without vocals."
      }
    }
  ]
}`;

        const reviewRaw = await invokeNova(
            NOVA_PRO,
            "You are a combined audience simulator and director. Output only JSON, no markdown.",
            reviewPrompt
        );

        interface ReviewScene {
            sceneId: string; audioContent: string; viralityScore: number;
            audienceReview: string; whyItWorked: string | null; whyItFailed: string | null;
            reshootGuide: {
                delivery: string; visual: string; script: string; duration: string;
                pacing: string; emotion: string; musicSuggestion: string;
            };
        }

        console.log("=== NOVA REVIEW OUTPUT ===");
        console.log(reviewRaw);

        const reviewData = safeJson<{ scenes: ReviewScene[] }>(reviewRaw, {
            scenes: finalGroupedScenes.map(s => ({
                sceneId: s.sceneId,
                audioContent: "[Audio not transcribed for this scene]",
                viralityScore: Math.min(100, Math.max(0, Math.round(s.engagementScore * 1.1))),
                audienceReview: s.engagementScore >= 65 ? "This section held my attention." : "I lost focus here.",
                whyItWorked: s.engagementScore >= 65 ? "Good pacing kept engagement up." : null,
                whyItFailed: s.engagementScore < 65 ? "Static visually and dragging pace." : null,
                reshootGuide: {
                    delivery: s.engagementScore >= 65 ? "Keep current energy" : "Increase speaking energy and enthusiasm",
                    visual: s.engagementScore >= 65 ? "Good composition" : "Add B-roll or close-ups to avoid dead air",
                    script: s.engagementScore >= 65 ? "Effective — keep as is" : "Tighten the script, cut filler words",
                    duration: s.engagementScore >= 65 ? "Keep as is" : "Trim heavily by at least 30%",
                    pacing: s.engagementScore >= 65 ? "Pacing is good" : "Speed up cuts, reduce pauses",
                    emotion: s.engagementScore >= 65 ? "Authentic and engaging" : "Add more energy and expression",
                    musicSuggestion: "Upbeat background music at low volume to maintain momentum"
                }
            }))
        });

        const reviewMap = new Map(reviewData.scenes.map(r => [r.sceneId, r]));

        // ════════════════════════════════════════════════════════════════════
        // STAGE 7 — Final Intelligence Assembly
        // ════════════════════════════════════════════════════════════════════
        const finalScenes: SceneResult[] = finalGroupedScenes.map(scene => {
            const review = reviewMap.get(scene.sceneId);
            const sceneViralityScore = review?.viralityScore ?? Math.min(100, Math.round(scene.engagementScore * 1.05));
            return {
                sceneId: scene.sceneId,
                timestamp: `${fmt(scene.start)}–${fmt(scene.end)}`,
                start: scene.start,
                end: scene.end,
                engagementScore: scene.engagementScore,
                viralityScore: sceneViralityScore,
                category: scene.category,
                recommendation: scene.recommendation,
                sceneContent: scene.sceneContent,
                audioContent: review?.audioContent ?? "[No audio transcript for this scene]",
                audienceReview: review?.audienceReview ?? "",
                whyItWorked: review?.whyItWorked ?? null,
                whyItFailed: review?.whyItFailed ?? null,
                reshootGuide: review?.reshootGuide ?? {
                    delivery: "Increase energy",
                    visual: "Add more variation",
                    script: "Tighten content",
                    duration: "Trim",
                    pacing: "Speed up cuts",
                    emotion: "Express more authentic enthusiasm",
                    musicSuggestion: "Add upbeat background music"
                },
                deliveryQuality: scene.deliveryQuality,
                visualVariation: scene.visualVariation,
                semanticInterest: scene.semanticInterest,
            };
        });

        const avgScore = Math.round(
            finalScenes.reduce((acc, s) => acc + s.engagementScore, 0) / finalScenes.length
        );

        const lowEngagementScenes = finalScenes.filter(s => s.category === "LOW");
        const highlights = finalScenes.filter(s => s.category === "HIGH");

        // Top improvement tips generated from scene data
        const improvementTips: string[] = [];
        for (const scene of finalScenes) {
            if (scene.recommendation === "Cut") {
                improvementTips.push(`Cut scene ${scene.sceneId} (${scene.timestamp}) — ${scene.whyItFailed ?? "low engagement zone"}`);
            } else if (scene.recommendation === "Trim") {
                const trimSecs = Math.round((scene.end - scene.start) * 0.3);
                improvementTips.push(`Trim ${scene.sceneId} (${scene.timestamp}) by ~${trimSecs}s — ${scene.whyItFailed ?? "pacing drag"}`);
            }
        }
        if (highlights.length > 0) {
            improvementTips.push(`Use scene ${highlights[0].sceneId} (${highlights[0].timestamp}) for thumbnail — highest engagement`);
        }

        // ════════════════════════════════════════════════════════════════════
        // STAGE 8 — Comprehensive Video Intelligence Framework Evaluation
        // ════════════════════════════════════════════════════════════════════
        const comprehensivePrompt = `You are a master Video Intelligence AI evaluating a video in the "${videoCategory}" category.
Analyze the following scene-by-scene intelligence data along with the official spoken transcript to output a comprehensive 15-point evaluation framework.

Exact Spoken Transcript of the Video:
"""${spokenTranscript}"""

Scenes and specific intelligence feedback:
${JSON.stringify(finalScenes.map(s => ({ timestamp: s.timestamp, content: s.sceneContent, recommendation: s.recommendation, visualQuality: s.visualVariation, delivery: s.deliveryQuality, engagement: s.engagementScore, review: s.audienceReview })))}

Based on these scenes, return ONLY a JSON response matching this exact schema:
{
  "categorySuitabilityScore": number (0-100, how well it fits "${videoCategory}"),
  "hookStrength": number (0-100, based on the first scene),
  "contentValue": number (0-100, insights and usefulness),
  "informationDensity": number (0-100),
  "deliveryStrength": number (0-100),
  "visualQuality": number (0-100),
  "editingQuality": number (0-100, based on scene variation),
  "emotionalImpact": number (0-100),
  "competitorBenchmark": number (0-100),
  "contentUniqueness": number (0-100),
  "safetyScore": number (0-100, 100 is completely safe),
  "viralityPrediction": string (e.g. "High Viral Potential", "Average Potential", "Low Virality")
}`;

        const compRaw = await invokeNova(
            NOVA_PRO,
            "You are an expert AI creator coach. Output only JSON, no markdown.",
            comprehensivePrompt
        );

        const compParsed = safeJson<any>(compRaw, {
            categorySuitabilityScore: 80,
            hookStrength: 75,
            contentValue: 70,
            informationDensity: 65,
            deliveryStrength: 70,
            visualQuality: 70,
            editingQuality: 65,
            emotionalImpact: 60,
            competitorBenchmark: 70,
            contentUniqueness: 60,
            safetyScore: 100,
            viralityPrediction: avgScore >= 75 ? "High Viral Potential" : "Average Viral Potential"
        });

        // Compute Virality Score based on the formula
        const viralityScore = Math.round(
            avgScore * 0.18 +
            (compParsed.contentValue || 70) * 0.18 +
            (compParsed.hookStrength || 70) * 0.15 +
            (compParsed.deliveryStrength || 70) * 0.12 +
            (compParsed.visualQuality || 70) * 0.10 +
            (compParsed.editingQuality || 70) * 0.10 +
            (compParsed.contentUniqueness || 70) * 0.09 +
            (compParsed.categorySuitabilityScore || 80) * 0.08
        );

        return NextResponse.json({
            success: true,
            videoMeta: {
                s3Key,
                contentType: videoMeta.contentType,
                fileSizeMB: Math.round(videoMeta.contentLength / 1024 / 1024 * 10) / 10,
                estimatedDurationSeconds: realDuration,
                estimatedDuration: `${fmt(realDuration)}`,
            },
            avgEngagementScore: avgScore,
            totalScenes: finalScenes.length,
            scenes: finalScenes,
            lowEngagementCount: lowEngagementScenes.length,
            highEngagementCount: highlights.length,
            improvementTips,
            categorySuitabilityScore: compParsed.categorySuitabilityScore || 80,
            hookStrength: compParsed.hookStrength || 75,
            contentValue: compParsed.contentValue || 70,
            informationDensity: compParsed.informationDensity || 65,
            deliveryStrength: compParsed.deliveryStrength || 70,
            visualQuality: compParsed.visualQuality || 70,
            editingQuality: compParsed.editingQuality || 65,
            emotionalImpact: compParsed.emotionalImpact || 60,
            competitorBenchmark: compParsed.competitorBenchmark || 70,
            contentUniqueness: compParsed.contentUniqueness || 60,
            safetyScore: compParsed.safetyScore || 100,
            viralityScore,
            viralityPrediction: compParsed.viralityPrediction || (viralityScore >= 75 ? "High Viral Potential" : "Average Viral Potential"),
            analysisTimestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.error("ANALYZE VIDEO ERROR:", err);
        return NextResponse.json(
            { error: "Analysis failed", details: String(err) },
            { status: 500 }
        );
    }
}
