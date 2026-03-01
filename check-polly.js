const { PollyClient, DescribeVoicesCommand } = require("@aws-sdk/client-polly");

const polly = new PollyClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

async function checkVoices() {
    const data = await polly.send(new DescribeVoicesCommand({}));
    const langMap = {};
    data.Voices.forEach(v => {
        if (!langMap[v.LanguageCode]) langMap[v.LanguageCode] = [];
        langMap[v.LanguageCode].push({ name: v.Name, engines: v.SupportedEngines });
    });
    console.log(JSON.stringify(langMap, null, 2));
}

checkVoices().catch(console.error);
