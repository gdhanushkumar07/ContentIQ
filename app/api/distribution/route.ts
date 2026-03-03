import { NextResponse } from "next/server";
import { bedrock } from "@/lib/aws";
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, category, description, sourceLinks, selectedPlatformsForSources } = body;

        if (!title || !category || !description) {
            return NextResponse.json(
                { error: "Title, category, and description are required." },
                { status: 400 }
            );
        }

        const platformsWithSources = selectedPlatformsForSources || [];
        const sourcesText = sourceLinks ? `\n- Sources/Links to include: ${sourceLinks}` : "";

        const getSourceInstruction = (platform: string) => {
            if (sourceLinks && platformsWithSources.includes(platform)) {
                return `\n   - CRITICAL REQUIREMENT: You MUST include the following sources/links naturally into the ${platform} content: "${sourceLinks}". Ensure they are clearly visible and clickable where supported.`;
            }
            return `\n   - Do NOT include any external links or sources in the ${platform} content.`;
        };

        const promptText = `You are an expert social media manager and digital marketing strategist. 
I have a video with the following details:
- Title: ${title}
- Category: ${category}
- Description: ${description}${sourcesText}

Generate a comprehensive social media distribution plan for this video.
Create highly engaging, platform-specific content for YouTube, YouTube Shorts, Instagram, X (Twitter), and Facebook.

Follow these rules for each platform:
1. YouTube: Analyze the provided video description thoroughly. Write a highly professional, engaging, and in-depth SEO-optimized video description. You must expand on the provided points to make them compelling, rather than just copying or summarizing them. Structure the description beautifully with an intriguing hook, clear paragraphs, and key takeaways (if applicable). Ensure absolutely NO important details or context from the original description are missed. if any dates are mentioned include it Include 5-8 relevant hashtags at the bottom.${getSourceInstruction('youtube')}
2. YouTube Shorts: Create a highly energetic, fast-paced, and punchy description optimized specifically for the Shorts feed. Focus on creating a strong hook in the first sentence to stop the scroll. Make it distinct from the main YouTube description by being quick and to the point. Include 3-5 trending hashtags.${getSourceInstruction('shorts')}
3. Instagram: Write a visually appealing and engaging caption tailored for Instagram Reels/Posts. Use relevant emojis, break up text with line spacing, and include a clear Call-To-Action (CTA) encouraging comments or saves. The tone should be highly social and interactive, distinct from the YouTube formats. Add 10-15 targeted hashtags at the bottom.${getSourceInstruction('instagram')}
4. X (Twitter): Write a concise, high-impact tweet that sparks curiosity or debate. It MUST be under 280 characters (including hashtags). Focus on a strong hook or an intriguing stat/quote from the video. Do not just summarize; make it snappy and shareable. Include 2-4 highly relevant hashtags.${getSourceInstruction('x')}
5. Facebook: Write a conversational, community-focused post tailored for Facebook audiences. It should be longer than a tweet but more casual than a YouTube description. Ask a question to encourage discussion in the comments and build a sense of community. Include 3-5 hashtags.${getSourceInstruction('facebook')}

Return ONLY valid JSON in the exact structure below. Do not include markdown formatting like \`\`\`json.
CRITICAL: All string values MUST have newlines properly escaped as \\n and double quotes escaped as \\".

{
  "youtube": {
    "content": "Full YouTube description here...",
    "hashtags": ["#tag1", "#tag2"]
  },
  "shorts": {
    "content": "Shorts description here...",
    "hashtags": ["#tag1", "#tag2"]
  },
  "instagram": {
    "content": "Instagram caption here...",
    "hashtags": ["#tag1", "#tag2"]
  },
  "x": {
    "content": "Tweet content here...",
    "hashtags": ["#tag1", "#tag2"]
  },
  "facebook": {
    "content": "Facebook post here...",
    "hashtags": ["#tag1", "#tag2"]
  }
}`;

        const input = {
            modelId: "us.amazon.nova-lite-v1:0",
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
                    maxTokens: 2048,
                    temperature: 0.7,
                    topP: 0.9,
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
            (typeof responseBody === 'string' ? responseBody : "");

        if (!rawText) throw new Error("Empty response from model");

        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : rawText;

        let results;
        try {
            results = JSON.parse(jsonStr);
        } catch (e) {
            console.error("JSON parse failed. Raw text:", rawText);
            throw new Error("Model failed to return valid JSON format");
        }

        return NextResponse.json(results);
    } catch (error: any) {
        console.error("Distribution plan generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate distribution plan", details: error.message },
            { status: 500 }
        );
    }
}
