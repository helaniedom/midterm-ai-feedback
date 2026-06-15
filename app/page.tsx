"use client";

import { useState } from "react";

type Scores = {
  positive: number;
  neutral: number;
  negative: number;
};

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<string>("");
  const [scores, setScores] = useState<Scores | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    setLoading(true);
    setResult("");
    setScores(null);

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();

    setResult(data?.sentiment || "No result found");
    setScores(data?.scores || null);
    setLoading(false);
  }

  function percent(value: number) {
    return Math.round(value * 100);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          AI Customer Feedback Dashboard
        </h1>

        <p className="mb-4 text-gray-600">
          Enter customer feedback and let Azure AI analyze the sentiment.
        </p>

        <textarea
          className="w-full border rounded-lg p-3 text-gray-900"
          rows={5}
          placeholder="Example: The service was amazing and the staff were friendly."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading || !text}
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
        >
          {loading ? "Analyzing..." : "Analyze Sentiment"}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-700">Sentiment Result:</p>
            <p className="text-2xl font-bold capitalize text-gray-900">
              {result}
            </p>

            {scores && (
              <div className="mt-4 space-y-2 text-gray-800">
                <p>Positive Score: {percent(scores.positive)}%</p>
                <p>Neutral Score: {percent(scores.neutral)}%</p>
                <p>Negative Score: {percent(scores.negative)}%</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}