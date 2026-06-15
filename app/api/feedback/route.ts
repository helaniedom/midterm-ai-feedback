import { NextResponse } from "next/server";
import { getFeedback } from "@/lib/storage";

export async function GET() {
    try {
        const feedback = await getFeedback();

        return NextResponse.json(feedback);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
        { error: "Failed to load feedback" },
        { status: 500 }
        );
    }
}