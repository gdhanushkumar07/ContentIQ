

async function getVoices() {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
        console.log("No API Key");
        return;
    }

    const res = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: { "xi-api-key": apiKey }
    });

    const data = await res.json();
    console.log(`Total voices fetched: ${data.voices?.length || 0}`);

    if (data.voices && data.voices.length > 0) {
        // Print first 5 voices to see label structure
        console.log(JSON.stringify(data.voices.slice(0, 5).map(v => ({ name: v.name, labels: v.labels })), null, 2));

        // Aggregate unique label keys and values
        const uniqueLabels = {};
        data.voices.forEach(v => {
            if (v.labels) {
                Object.entries(v.labels).forEach(([key, val]) => {
                    if (!uniqueLabels[key]) uniqueLabels[key] = new Set();
                    uniqueLabels[key].add(val);
                });
            }
        });

        console.log("\nUnique Label values across all voices:");
        Object.entries(uniqueLabels).forEach(([key, set]) => {
            console.log(`${key}: ${Array.from(set).join(', ')}`);
        });
    } else {
        console.log(data);
    }
}

getVoices().catch(console.error);
