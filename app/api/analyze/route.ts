import { NextResponse } from "next/server";
import { analyzeSentiment } from "@/lib/azureLanguage";
import { saveFeedback } from "@/lib/storage";

export async function POST(request: Request) {
    try {
        const { text } = await request.json();

        const result = await analyzeSentiment(text);

        const document = result?.results?.documents?.[0];

        const sentiment = document?.sentiment || "unknown";
        const scores = document?.confidenceScores || {
        positive: 0,
        neutral: 0,
        negative: 0,
        };

        await saveFeedback(text, sentiment);

        return NextResponse.json({
        sentiment,
        scores,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
        { error: "Analysis failed" },
        { status: 500 }
        );
    }
}