import { NextResponse } from "next/server";
import { bedrock, s3 } from "@/lib/aws";
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, tone, length, customRequirements, mode } = body;

    const baseInstructions = `
Target Tone: ${tone}
Target Length: ${length}
${customRequirements?.trim() ? `CRITICAL CUSTOM REQUIREMENTS:\n${customRequirements}\n(You MUST prioritize and strictly follow these requirements)` : ''}

STYLE & DELIVERY RULES (MANDATORY):
1. Write like a MODERN CONTENT CREATOR / INFLUENCER. High energy, high impact, zero fluff.
2. NO FILLER PHRASES: Absolutely NEVER start a sentence or scene with "Okay so", "So basically", "Alright guys", or "Hey everyone". 
3. Start with the VALUE or the HOOK immediately.
4. Every line must sound like something a real, charismatic person would say in a fast-paced video.
5. Use "Spoken Rhythm": short sentences, natural pauses (...), and humanized interjections ("wait...", "this is wild", "see?").
6. Imagine reading this aloud to a friend — if it sounds like a script, simplify it until it sounds like a story.
7. COMPULSORY: Ask at least one direct, rhetorical question to the audience in every single scene.
8. Use "Curiosity Gaps" to keep them watching: "but that's wasn't even the best part...", "here's where it gets weird", "I didn't expect this, but..."
9. Professional but authentic. No "AI-speak," no robotic structures, and no overly polished corporate phrasing.
10. Light, subtle humor or personality is mandatory to make it feel human.

TECHNICAL RULES:
1. STRICT DURATION RATIO: You MUST maintain a ratio of 1 minute of video = 450 spoken words. 
   - 3 minutes = 1350 words total.
   - 1 minute = 450 words total.
   - You MUST scale the word count precisely based on the target length. Generate a high-density, information-packed script.
2. LOGICAL SCENE DIVISION: You MUST generate at least 3 distinct scenes per 1 minute of video length.
   - For a 3-minute video, generate at least 9 distinct scenes.
   - For a 1-minute video, generate at least 3 distinct scenes.
   - Each scene must represent a fast-paced pivot in topic, visual, or narrative phase. Keep scenes short and dynamic.
`.trim();

    let promptText = "";
    if (mode === 'Director Mode') {
      promptText = `You are an AI Video Director for a top-tier YouTube Creator. Create a viral storyboard about "${topic}".

${baseInstructions}

Return JSON:
{
  "topic": "${topic}",
  "tone": "${tone}",
  "stats": {
    "estimatedDuration": "duration",
    "wordCount": "precise word count following 1:450 ratio",
    "retention": "expected retention %",
    "hookStrength": "rating",
    "pacing": "style"
  },
  "scenes": [
    {
      "title": "Scene X – [Title based on logical content pivot]",
      "purpose": "What this scene achieves",
      "dialogue": "Charismatic creator dialogue formatted for 1:450 ratio.",
      "visual": "Dynamic visual description",
      "editing": "High-pacing editing notes"
    }
  ]
}
Return ONLY valid JSON. Make it sound like a human influencer, not an AI. Ensure the dialogue across all scenes totals 450 words per minute.`;
    } else {
      promptText = `You are a viral hook-writing expert for influencers. Create a high-retention talking points outline about "${topic}".

${baseInstructions}

Return JSON:
{
  "topic": "${topic}",
  "tone": "${tone}",
  "stats": {
    "estimatedDuration": "duration",
    "wordCount": "precise word count following 1:450 ratio",
    "retention": "expected retention %",
    "hookStrength": "rating",
    "pacing": "style"
  },
  "script": {
    "hook": "High-impact opening line. NO FILLERS. Use curiosity.",
    "valuePoints": [
      { "point": "Influencer-style talking point with personality", "broll": "Modern B-roll suggestion" }
    ],
    "cta": "Native call-to-action that builds community"
  }
}
Return ONLY valid JSON. Ensure the points are concise and the word count reflects the 1:300 ratio.`;
    }

    const input = {
      modelId: "us.amazon.nova-premier-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [{ text: promptText }]
          }
        ],
        inferenceConfig: {
          maxTokens: 3072,
          temperature: 0.85,
          topP: 0.95,
        },
      }),
    };

    const command = new InvokeModelCommand(input);
    const response = await bedrock.send(command).catch(err => {
      console.error("Bedrock invocation failed:", err);
      throw err;
    });

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const rawText =
      responseBody.output?.message?.content?.[0]?.text ||
      responseBody.content?.[0]?.text ||
      responseBody.choices?.[0]?.message?.content ||
      responseBody.generation ||
      responseBody.text ||
      (typeof responseBody === 'string' ? responseBody : "");

    if (!rawText) throw new Error("Empty response from model");

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : rawText;

    let results;
    try {
      results = JSON.parse(jsonStr);
    } catch (e) {
      console.error("JSON parse failed:", e);
      throw new Error("Model failed to return valid JSON format");
    }

    const scriptId = randomUUID();
    const fileName = `scripts/${scriptId}.json`;
    const bucketName = process.env.S3_BUCKET_NAME!;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: JSON.stringify(results, null, 2),
        ContentType: "application/json",
      })
    ).catch(err => {
      console.error("S3 upload failed:", err);
    });

    const s3Url = `https://${bucketName}.s3.amazonaws.com/${fileName}`;

    return NextResponse.json({
      results,
      s3Url,
      confidence: 0.98
    });
  } catch (error: any) {
    console.error("Script generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate script", details: error.message },
      { status: 500 }
    );
  }
}
