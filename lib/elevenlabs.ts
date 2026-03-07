// lib/elevenlabs.ts

// Global state within the serverless function execution to remember the active working key
let currentKeyIndex = 0;

export async function fetchWithElevenLabsFallback(url: string, options: RequestInit): Promise<Response> {
    const keys = [
        process.env.ELEVENLABS_API_KEY_1,
        process.env.ELEVENLABS_API_KEY_2,
        process.env.ELEVENLABS_API_KEY_3,
        process.env.ELEVENLABS_API_KEY_4
    ].filter(Boolean) as string[];

    // Fallback to original single key if the 1-4 array is not populated
    if (keys.length === 0 && process.env.ELEVENLABS_API_KEY) {
        keys.push(process.env.ELEVENLABS_API_KEY);
    }

    if (keys.length === 0) {
        throw new Error("No ElevenLabs API keys configured in environment variables (ELEVENLABS_API_KEY_1, etc.)");
    }

    let attempts = 0;
    const maxAttempts = keys.length;
    let lastResponse: Response | null = null;

    while (attempts < maxAttempts) {
        // Ensure index wraps around safely
        currentKeyIndex = currentKeyIndex % keys.length;
        const activeKey = keys[currentKeyIndex];

        // Clone headers and inject the active key via standard fetch Headers
        const secureHeaders = new Headers(options.headers);
        secureHeaders.set("xi-api-key", activeKey);

        const res = await fetch(url, { ...options, headers: secureHeaders });
        lastResponse = res;

        // If request failed, rotate on ANY error to safely catch invalid keys that return 404, 403, 401, 429, etc.
        if (!res.ok) {
            const resClone = res.clone();
            const errText = await resClone.text().catch(() => "");

            console.warn(`[ElevenLabs Fallback] Key at index ${currentKeyIndex + 1} failed (${res.status}). Rotating to next key. Error detail: ${errText}`);
            currentKeyIndex++;
            attempts++;
            continue;
        }

        // If it succeeds, log which key was used for testing purposes
        console.log(`[ElevenLabs] Successfully used API Key index ${currentKeyIndex + 1} (Starts with: ${activeKey.substring(0, 4)}***)`);

        // Return the response for the caller to handle
        return res;
    }

    // Exhausted all available, active keys. Return the last failed response so the caller handles it.
    if (lastResponse) return lastResponse;
    throw new Error(`[ElevenLabs Fallback] All ${maxAttempts} ElevenLabs API keys failed.`);
}
