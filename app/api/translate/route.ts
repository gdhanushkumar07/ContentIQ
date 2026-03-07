import { NextResponse } from "next/server";
import { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } from "@aws-sdk/client-transcribe";
import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/aws";
import { fetchWithElevenLabsFallback } from "@/lib/elevenlabs";

// Initialize AWS Clients
const transcribe = new TranscribeClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!,
  },
});

const translate = new TranslateClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!,
  },
});



export const runtime = "nodejs";
export const maxDuration = 60; // Allow enough time for transcribe jobs

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const inputText = formData.get("inputText") as string | null;
    const targetLanguage = formData.get("targetLanguage") as string; // e.g., 'es', 'it', 'fr'
    const sourceLanguage = (formData.get("sourceLanguage") as string) || "en";
    const voiceGender = (formData.get("voiceGender") as string) || "any";
    const voiceAge = (formData.get("voiceAge") as string) || "any";
    const voiceTone = (formData.get("voiceTone") as string) || "any";

    if ((!file && !inputText) || !targetLanguage) {
      return NextResponse.json({ error: "Missing file/text or targetLanguage" }, { status: 400 });
    }

    let sourceText = "";
    let isAudio = false;
    let isText = false;

    if (inputText) {
      isText = true;
      sourceText = inputText;
    } else if (file) {
      isAudio = file.type.startsWith("audio/") || file.type.startsWith("video/");
      isText = file.type === "text/plain";

      if (!isAudio && !isText) {
        return NextResponse.json({ error: "Unsupported file type. Please upload audio or .txt file." }, { status: 400 });
      }

      // 1. Process Text vs Audio
      if (isText) {
        const textBytes = await file.arrayBuffer();
        sourceText = new TextDecoder().decode(textBytes);
        if (!sourceText.trim()) throw new Error("Text file is empty");
      } else if (isAudio) {
        // Audio processing
        // a. Upload S3
        const validFile = file as File;
        const bytes = await validFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const key = `audio-uploads/${Date.now()}-${validFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
        const bucketName = process.env.S3_BUCKET_NAME!;

        await s3.send(new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: validFile.type,
        }));

        // b. Transcribe
        const mediaUri = `s3://${bucketName}/${key}`;
        const jobName = `transcribe-job-${Date.now()}`;

        const transcribeLanguageCode = sourceLanguage === "auto" ? "en-US" : (sourceLanguage === "en" ? "en-US" : sourceLanguage);

        await transcribe.send(new StartTranscriptionJobCommand({
          TranscriptionJobName: jobName,
          Media: { MediaFileUri: mediaUri },
          LanguageCode: transcribeLanguageCode as any,
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

        // c. Fetch Transcript
        if (!transcriptUri) throw new Error("No transcript URI returned");
        const transcriptRes = await fetch(transcriptUri);
        const transcriptData = await transcriptRes.json();
        sourceText = transcriptData.results.transcripts[0]?.transcript || "";
        if (!sourceText) throw new Error("Transcription resulted in empty text");
      }
    }

    // 2. Translate Text
    const translatedResult = await translate.send(new TranslateTextCommand({
      SourceLanguageCode: sourceLanguage, // "auto" or specific code
      TargetLanguageCode: targetLanguage, // e.g. "es", "it"
      Text: sourceText,
    }));
    const translatedText = translatedResult.TranslatedText || "";

    // 3. Audio: Text-to-Speech (ElevenLabs)
    // The `eleven_multilingual_v2` model automatically detects and speaks the correct language!
    const elevenLabsVoicesList = [
      { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", gender: "female", age: "young", tone: "narration" },
      { id: "29vD33N1CtxCmqQRPOHJ", name: "Drew", gender: "male", age: "middle aged", tone: "news" },
      { id: "2EiwWnXFnvU5JabPnv8n", name: "Clyde", gender: "male", age: "middle aged", tone: "conversational" },
      { id: "D38z5RcWu1voky8WS1ja", name: "Fin", gender: "male", age: "old", tone: "characters" },
      { id: "CYw3kZ02vU0ksE1OqH1m", name: "Dave", gender: "male", age: "young", tone: "conversational" },
      { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", gender: "female", age: "young", tone: "narration" },
      { id: "ErXwobaYiN019PkyZkXJ", name: "Antoni", gender: "male", age: "young", tone: "narration" },
      { id: "GBv7mTt0atIp3Br8iCZE", name: "Thomas", gender: "male", age: "young", tone: "conversational" },
      { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie", gender: "male", age: "middle aged", tone: "conversational" },
      { id: "LcfcDJNUP1GQmXneznwW", name: "Emily", gender: "female", age: "young", tone: "narration" },
      { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli", gender: "female", age: "young", tone: "narration" },
      { id: "N2lVS1w4EXbQ1uI1Hn2O", name: "Callum", gender: "male", age: "middle aged", tone: "characters" },
      { id: "ODq5zmih8GrVes37Dizd", name: "Patrick", gender: "male", age: "middle aged", tone: "characters" },
      { id: "SOYHLrjzK2X1ezoOCnDcg", name: "Harry", gender: "male", age: "young", tone: "conversational" },
      { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi", gender: "female", age: "young", tone: "narration" },
      { id: "TX3OmTKmHXdHeX2X1kZ0", name: "Liam", gender: "male", age: "young", tone: "narration" },
      { id: "VR6AewLTigWG4xSOukaG", name: "Sam", gender: "male", age: "young", tone: "narration" },
      { id: "pNInz6obpgDQGcFmaJgB", name: "Adam", gender: "male", age: "middle aged", tone: "narration" },
      { id: "z9fAnlkpzviPz146aGWa", name: "Glinda", gender: "female", age: "middle aged", tone: "characters" },
      { id: "zcAOhNBS3c14rBihafp1", name: "Freya", gender: "female", age: "young", tone: "characters" },
      { id: "XrExE9yKIg1WjnnlVkGX", name: "Matilda", gender: "female", age: "middle aged", tone: "narration" }
    ];

    let bestVoiceId = "21m00Tcm4TlvDq8ikWAM"; // Default Rachel
    let maxScore = -1;

    // Use specific language defaults if no custom settings provided
    const hasCustomSettings = voiceGender !== "any" || voiceAge !== "any" || voiceTone !== "any";

    if (!hasCustomSettings) {
      const simpleMap: Record<string, string> = {
        fr: "2EiwWnXFnvU5JabPnv8n",
        de: "D38z5RcWu1voky8WS1ja",
        es: "21m00Tcm4TlvDq8ikWAM",
        it: "29vD33N1CtxCmqQRPOHJ",
      };
      const langPrefix = targetLanguage.split('-')[0]; // Handle cases like 'en-US'
      bestVoiceId = simpleMap[targetLanguage] || simpleMap[langPrefix] || "21m00Tcm4TlvDq8ikWAM";
    } else {
      // Deep Score each voice based on matching criteria
      for (const voice of elevenLabsVoicesList) {
        let score = 0;

        // Heavily bias towards Tone and Gender to ensure user feels the extreme difference
        if (voiceGender !== "any" && voice.gender === voiceGender) score += 100; // Must get gender right if specified
        if (voiceTone !== "any" && voice.tone === voiceTone) score += 40;        // High priority for tone
        if (voiceAge !== "any" && voice.age === voiceAge) score += 10;           // Lower priority than tone/accent

        // If multiple voices have the exact same tags, randomizing a bit prevents staleness
        // Add small fraction based on ID just to break ties deterministically
        if (score > maxScore) {
          maxScore = score;
          bestVoiceId = voice.id;
        }
      }
    }

    const voiceId = bestVoiceId;
    const elevenLabsResponse = await fetchWithElevenLabsFallback(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: translatedText,
        model_id: "eleven_multilingual_v2", // The multilingual model supports 29 languages!
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!elevenLabsResponse.ok) {
      const errText = await elevenLabsResponse.text();
      console.error("ElevenLabs Error Details:", errText);
      throw new Error(`ElevenLabs API Error: ${elevenLabsResponse.statusText}`);
    }

    // Convert audio stream to base64
    const arrayBuffer = await elevenLabsResponse.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");

    return NextResponse.json({
      success: true,
      originalText: sourceText,
      translatedText,
      type: "audio",
      audioBase64: base64Audio,
    });
  } catch (error: any) {
    console.error("TRANSLATION ERROR:", error);
    return NextResponse.json({ error: error.message || "Translation processing failed" }, { status: 500 });
  }
}
