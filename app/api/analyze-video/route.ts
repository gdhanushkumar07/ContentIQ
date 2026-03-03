import { NextResponse } from "next/server";
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, bedrock } from "@/lib/aws";

export const runtime = "nodejs";
export const maxDuration = 120;

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
    category: "LOW" | "AVERAGE" | "HIGH";
    recommendation: "Highlight" | "Keep" | "Trim" | "Cut";
    sceneContent: string;          // ← What's actually in this scene (real visual analysis)
    audienceReview: string;
    whyItWorked: string | null;
    whyItFailed: string | null;
    reshootGuide: {
        delivery: string;
        visual: string;
        script: string;
        duration: string;
    };
    deliveryQuality: number;
    visualVariation: number;
    semanticInterest: number;
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
    try {
        const { s3Key, durationSeconds: clientDuration, frames: clientFrames } = await req.json();
        if (!s3Key) {
            return NextResponse.json({ error: "Missing s3Key" }, { status: 400 });
        }
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
        // STAGE 3 — Granular Timeline Extraction (Multimodal)
        // Extract data for every exact interval based on real duration
        // ════════════════════════════════════════════════════════════════════
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

        let timelineData;
        try {
            const timelineRaw = await invokeNovaWithImages(
                NOVA_LITE,
                "You are a multimodal video timeline analyzer. Analyze each frame image separately based on its timestamp. Output only JSON.",
                timelinePrompt,
                videoFrames.slice(0, 20) // Send up to 20 frames
            );

            console.log("=== RAW STRING FROM NOVA ===");
            console.log(timelineRaw);
            console.log("=== RAW STRING LENGTH ===", timelineRaw.length);

            const parsed = safeJson<{ timeline: any[] }>(timelineRaw, { timeline: [] });
            console.log("=== PARSED OBJECT ===");
            console.log(JSON.stringify(parsed, null, 2));
            
            timelineData = parsed.timeline || [];
            
            console.log(`=== NOVA RETURNED ${timelineData.length} INTERVALS (Expected: ${intervals.length}) ===`);
            if (timelineData.length < intervals.length) {
                console.warn(`⚠️ WARNING: Nova only returned ${timelineData.length} intervals but we expected ${intervals.length}`);
            }
        } catch (e) {
            console.error("Timeline extraction failed:", e);
            timelineData = [];
        }

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
For each scene below, write:
1. An AUDIENCE REVIEW — 1–2 sentences written in first-person viewer voice ("I felt...", "This part made me...")
2. WHY IT WORKED — if the engagement score is >= 65, explain what made it work (1 sentence). Otherwise "null".
3. WHY IT FAILED — if the engagement score is < 65, explain what caused disengagement (1 sentence). Otherwise "null". MUST point out if it was a blank/static scene.
4. A RESHOOT GUIDE with fields: delivery, visual, script, duration.

Scenes with engagement data:
${JSON.stringify(finalGroupedScenes.map((s: any) => ({
            sceneId: s.sceneId,
            timestamp: `${fmt(s.start)}–${fmt(s.end)}`,
            engagementScore: s.engagementScore,
            category: s.category,
            visualContent: s.sceneContent
        })))}

Return ONLY valid JSON (matching this schema perfectly):
{
  "scenes": [
    {
      "sceneId": "S1",
      "audienceReview": "I was immediately hooked.",
      "whyItWorked": "Strong hook and pacing.",
      "whyItFailed": null,
      "reshootGuide": {
        "delivery": "Keep urgency", "visual": "Try a close-up", "script": "Good", "duration": "Keep as is"
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
            sceneId: string; audienceReview: string; whyItWorked: string | null; whyItFailed: string | null;
            reshootGuide: { delivery: string; visual: string; script: string; duration: string };
        }

        const reviewData = safeJson<{ scenes: ReviewScene[] }>(reviewRaw, {
            scenes: finalGroupedScenes.map(s => ({
                sceneId: s.sceneId,
                audienceReview: s.engagementScore >= 65 ? "This section held my attention." : "I lost focus here, especially if it was a blank screen.",
                whyItWorked: s.engagementScore >= 65 ? "Good pacing kept engagement up." : null,
                whyItFailed: s.engagementScore < 65 ? "Static visually and dragging pace." : null,
                reshootGuide: {
                    delivery: s.engagementScore >= 65 ? "Keep current energy" : "Increase energy",
                    visual: s.engagementScore >= 65 ? "Good composition" : "Add more visuals immediately",
                    script: s.engagementScore >= 65 ? "Effective" : "Tighten the script",
                    duration: s.engagementScore >= 65 ? "Keep as is" : "Trim heavily"
                }
            }))
        });

        const reviewMap = new Map(reviewData.scenes.map(r => [r.sceneId, r]));

        // ════════════════════════════════════════════════════════════════════
        // STAGE 7 — Final Intelligence Assembly
        // ════════════════════════════════════════════════════════════════════
        const finalScenes: SceneResult[] = finalGroupedScenes.map(scene => {
            const review = reviewMap.get(scene.sceneId);
            return {
                sceneId: scene.sceneId,
                timestamp: `${fmt(scene.start)}–${fmt(scene.end)}`,
                start: scene.start,
                end: scene.end,
                engagementScore: scene.engagementScore,
                category: scene.category,
                recommendation: scene.recommendation,
                sceneContent: scene.sceneContent,
                audienceReview: review?.audienceReview ?? "",
                whyItWorked: review?.whyItWorked ?? null,
                whyItFailed: review?.whyItFailed ?? null,
                reshootGuide: review?.reshootGuide ?? {
                    delivery: "Increase energy", visual: "Add more variation", script: "Tighten content", duration: "Trim"
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
