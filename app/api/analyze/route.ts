import { NextResponse } from "next/server";
import { analyzeSentiment } from "@/lib/azureLanguage";

export async function POST(request: Request) {
    try {
        const { text } = await request.json();

        const result = await analyzeSentiment(text);

        return NextResponse.json(result);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
        { error: "Analysis failed" },
        { status: 500 }
        );
    }
}