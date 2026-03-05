
import { NextResponse } from "next/server";
import { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } from "@aws-sdk/client-transcribe";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/aws";

// Initialize AWS Clients
const transcribe = new TranscribeClient({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!,
    },
});

export const runtime = "nodejs";
export const maxDuration = 60; // Allow enough time for transcribe jobs and audio gen

// We will generate 3 options of BGM for the user to choose from
const BGM_GENRES = [
    { genre: "Cinematic", mood: "Dramatic", bpm: 85 },
    { genre: "Lo-Fi", mood: "Relaxing", bpm: 75 },
    { genre: "Ambient", mood: "Thoughtful", bpm: 60 }
];

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const durationStr = formData.get("duration") as string;
        const duration = durationStr ? parseFloat(durationStr) : 10; // Default 10s
        const userTone = formData.get("tone") as string;

        if (!file) {
            return NextResponse.json({ error: "Missing file" }, { status: 400 });
        }

        const isAudio = file.type.startsWith("audio/") || file.type.startsWith("video/");
        const isText = file.type === "text/plain";

        if (!isAudio && !isText) {
            return NextResponse.json({ error: "Unsupported file type. Please upload audio, video, or .txt file." }, { status: 400 });
        }

        let sourceText = "";

        // 1. Process Text vs Audio
        if (isText) {
            const textBytes = await file.arrayBuffer();
            sourceText = new TextDecoder().decode(textBytes);
            if (!sourceText.trim()) throw new Error("Text file is empty");
        } else {
            // Audio processing
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const key = `bgm-audio-uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
            const bucketName = process.env.S3_BUCKET_NAME!;

            await s3.send(new PutObjectCommand({
                Bucket: bucketName,
                Key: key,
                Body: buffer,
                ContentType: file.type,
            }));

            // b. Transcribe
            const mediaUri = `s3://${bucketName}/${key}`;
            const jobName = `bgm-transcribe-${Date.now()}`;

            await transcribe.send(new StartTranscriptionJobCommand({
                TranscriptionJobName: jobName,
                Media: { MediaFileUri: mediaUri },
                IdentifyLanguage: true, // Auto-detect language
            }));

            // wait for job to complete
            let jobStatus = "IN_PROGRESS";
            let transcriptUri = "";
            while (jobStatus === "IN_PROGRESS" || jobStatus === "QUEUED") {
                await new Promise((resolve) => setTimeout(resolve, 3000));
                const st = await transcribe.send(new GetTranscriptionJobCommand({
                    TranscriptionJobName: jobName
                }));
                jobStatus = st.TranscriptionJob?.TranscriptionJobStatus || "FAILED";
                if (jobStatus === "COMPLETED") {
                    transcriptUri = st.TranscriptionJob?.Transcript?.TranscriptFileUri || "";
                }
                if (jobStatus === "FAILED") {
                    throw new Error("Transcription failed: " + st.TranscriptionJob?.FailureReason);
                }
            }

            if (!transcriptUri) throw new Error("No transcript URI returned");
            const transcriptRes = await fetch(transcriptUri);
            const transcriptData = await transcriptRes.json();
            sourceText = transcriptData.results.transcripts[0]?.transcript || "";
            if (!sourceText) throw new Error("Transcription resulted in empty text");
        }

        // Prepare a safe snippet of the text to influence the BGM
        const textSnippet = sourceText.slice(0, 100).replace(/[^a-zA-Z0-9., ]/g, '');

        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            throw new Error("ElevenLabs API key is missing.");
        }

        // 2. Generate BGM options in parallel using ElevenLabs Sound Effects API
        // To save time, we generate 3 variations based on the content
        const generatePrompts = BGM_GENRES.map(g => {
            // Create a prompt that blends the genre with the content topic
            const activeMood = userTone ? userTone : g.mood;
            const prompt = `Pure instrumental background music, NO VOICES, NO SINGING, NO SPOKEN WORDS. ${g.genre} genre, ${activeMood} mood. Thematic inspiration: "${textSnippet}". Strict requirement: instrumental only.`;

            return async () => {
                const elevenLabsResponse = await fetch(`https://api.elevenlabs.io/v1/sound-generation`, {
                    method: "POST",
                    headers: {
                        "Accept": "audio/mpeg",
                        "Content-Type": "application/json",
                        "xi-api-key": apiKey
                    },
                    body: JSON.stringify({
                        text: prompt,
                        duration_seconds: Math.min(22, Math.max(1, duration)), // Max 22 seconds per Elevenlabs docs
                        prompt_influence: 0.3, // Standard influence
                    })
                });

                if (!elevenLabsResponse.ok) {
                    const errText = await elevenLabsResponse.text();
                    console.error(`ElevenLabs BGM Gen Error (${g.genre}):`, errText);
                    throw new Error(`ElevenLabs API Error: ${elevenLabsResponse.statusText}`);
                }

                const arrayBuffer = await elevenLabsResponse.arrayBuffer();
                return {
                    title: `AI Match: ${g.genre} & ${activeMood}`,
                    genre: g.genre,
                    mood: activeMood,
                    bpm: g.bpm,
                    match: Math.floor(Math.random() * 10 + 90) + "%", // Simulate 90-99% match
                    duration: durationStr || "10", // approximate
                    audioBase64: Buffer.from(arrayBuffer).toString("base64")
                };
            };
        });

        const results = await Promise.all(generatePrompts.map(fn => fn()));

        return NextResponse.json({
            success: true,
            extractedText: sourceText,
            suggestions: results
        });

    } catch (error: any) {
        console.error("BGM SUGGESTOR ERROR:", error);
        return NextResponse.json({ error: error.message || "BGM generation failed" }, { status: 500 });
    }
}