export async function analyzeSentiment(text: string) {
    const endpoint = process.env.AZURE_LANGUAGE_ENDPOINT;
    const key = process.env.AZURE_LANGUAGE_KEY;

    const response = await fetch(
        `${endpoint}language/:analyze-text?api-version=2023-04-01`,
        {
        method: "POST",
        headers: {
            "Ocp-Apim-Subscription-Key": key || "",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            kind: "SentimentAnalysis",
            analysisInput: {
            documents: [
                {
                id: "1",
                language: "en",
                text: text,
                },
            ],
            },
        }),
        }
    );

    const data = await response.json();
    return data;
}