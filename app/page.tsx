"use client";

import { useEffect, useState } from "react";

type Scores = {
  positive: number;
  neutral: number;
  negative: number;
};

type Feedback = {
  text: string;
  sentiment: string;
  createdAt: string;
};

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<string>("");
  const [scores, setScores] = useState<Scores | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  async function loadFeedback() {
    const response = await fetch("/api/feedback");
    const data = await response.json();
    setFeedback(data.reverse());
    setLastUpdated(new Date().toLocaleString());
  }

  useEffect(() => {
    loadFeedback();
  }, []);

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
    setText("");
    setLoading(false);

    await loadFeedback();
  }

  function percent(value: number) {
    return Math.round(value * 100);
  }

  function sentimentStyle(sentiment: string) {
    if (sentiment === "positive")
      return "bg-green-100 text-green-800 border-green-300";
    if (sentiment === "negative")
      return "bg-red-100 text-red-800 border-red-300";
    if (sentiment === "neutral")
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-blue-100 text-blue-800 border-blue-300";
  }

  function filterButtonStyle(value: string) {
    return filter === value
      ? "bg-blue-600 text-white"
      : "bg-white text-blue-700 border border-blue-300 hover:bg-blue-50";
  }

  const positiveCount = feedback.filter(
    (item) => item.sentiment === "positive"
  ).length;

  const negativeCount = feedback.filter(
    (item) => item.sentiment === "negative"
  ).length;

  const neutralCount = feedback.filter(
    (item) => item.sentiment === "neutral"
  ).length;

  const filteredFeedback =
    filter === "all"
      ? feedback
      : feedback.filter((item) => item.sentiment === filter);

  const mostCommonSentiment =
    feedback.length === 0
      ? "No data yet"
      : positiveCount >= negativeCount && positiveCount >= neutralCount
      ? "Positive"
      : negativeCount >= positiveCount && negativeCount >= neutralCount
      ? "Negative"
      : "Neutral";

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="mx-auto max-w-4xl bg-white shadow-2xl rounded-2xl p-8 border border-white">
        <h1 className="text-4xl font-bold mb-3 text-blue-900">
          AI Customer Feedback Dashboard
        </h1>

        <p className="mb-2 text-gray-600">
          Enter customer feedback and let Azure AI analyze the sentiment.
        </p>

        <p className="mb-6 text-sm text-blue-700 font-medium">
          Powered by Azure AI Language Service and Azure Table Storage
        </p>

        <textarea
          className="w-full border-2 border-blue-200 rounded-xl p-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-200"
          rows={5}
          placeholder="Example: The service was amazing and the staff were friendly."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading || !text}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:bg-gray-400 transition"
        >
          {loading ? "Analyzing..." : "Analyze Sentiment"}
        </button>

        {result && (
          <div
            className={`mt-6 p-5 rounded-xl border ${sentimentStyle(result)}`}
          >
            <p>Sentiment Result:</p>
            <p className="text-3xl font-bold capitalize">{result}</p>

            {scores && (
              <div className="mt-4 space-y-1">
                <p>Positive Score: {percent(scores.positive)}%</p>
                <p>Neutral Score: {percent(scores.neutral)}%</p>
                <p>Negative Score: {percent(scores.negative)}%</p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-4 gap-4 mt-8">
          <div className="bg-blue-100 text-blue-800 p-4 rounded-xl text-center shadow">
            <p className="font-bold text-3xl">{feedback.length}</p>
            <p className="text-sm">Total</p>
          </div>

          <div className="bg-green-100 text-green-800 p-4 rounded-xl text-center shadow">
            <p className="font-bold text-3xl">{positiveCount}</p>
            <p className="text-sm">Positive</p>
          </div>

          <div className="bg-red-100 text-red-800 p-4 rounded-xl text-center shadow">
            <p className="font-bold text-3xl">{negativeCount}</p>
            <p className="text-sm">Negative</p>
          </div>

          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl text-center shadow">
            <p className="font-bold text-3xl">{neutralCount}</p>
            <p className="text-sm">Neutral</p>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5 text-blue-900">
          <h2 className="text-xl font-bold mb-3">Dashboard Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold">Total Feedback</p>
              <p>{feedback.length} records stored</p>
            </div>

            <div>
              <p className="font-semibold">Most Common Sentiment</p>
              <p>{mostCommonSentiment}</p>
            </div>

            <div>
              <p className="font-semibold">Last Updated</p>
              <p>{lastUpdated || "Loading..."}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-4 text-purple-900 text-sm">
          Azure AI returns the dominant sentiment. Mixed feedback may be
          classified as positive, negative, or neutral depending on which
          sentiment is strongest.
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-2 text-blue-900">
          Feedback History
        </h2>

        <p className="mb-4 text-sm text-gray-600">
          Showing {filteredFeedback.length} of {feedback.length} feedback
          records
        </p>

        <div className="flex flex-wrap gap-3 mb-5">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full font-semibold transition ${filterButtonStyle(
              "all"
            )}`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("positive")}
            className={`px-4 py-2 rounded-full font-semibold transition ${filterButtonStyle(
              "positive"
            )}`}
          >
            Positive
          </button>

          <button
            onClick={() => setFilter("negative")}
            className={`px-4 py-2 rounded-full font-semibold transition ${filterButtonStyle(
              "negative"
            )}`}
          >
            Negative
          </button>

          <button
            onClick={() => setFilter("neutral")}
            className={`px-4 py-2 rounded-full font-semibold transition ${filterButtonStyle(
              "neutral"
            )}`}
          >
            Neutral
          </button>
        </div>

        <div className="space-y-4">
          {filteredFeedback.length === 0 ? (
            <div className="bg-gray-50 border rounded-xl p-6 text-center text-gray-500">
              No feedback found for this filter.
            </div>
          ) : (
            filteredFeedback.map((item, index) => (
              <div
                key={index}
                className={`border rounded-xl p-4 shadow-sm ${sentimentStyle(
                  item.sentiment
                )}`}
              >
                <p className="text-gray-900">{item.text}</p>
                <p className="mt-2 text-sm capitalize font-bold">
                  Sentiment: {item.sentiment}
                </p>
                <p className="text-xs opacity-70">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        <footer className="mt-10 pt-6 border-t text-center text-sm text-gray-500">
          INTP302 Midterm Project Â· AI Customer Feedback Dashboard
        </footer>
      </div>
    </main>
  );
}