"use client";

import { useState } from "react";
import { askQuestion } from "@/lib/api";

export default function ChatBox() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  async function handleAsk() {
    if (!question.trim()) return;

    try {
      setIsAsking(true);
      setAnswer("Thinking...");

      const res = await askQuestion(question);
      setAnswer(res.answer);
    } catch (err) {
      setAnswer("❌ Something went wrong. Please try again.");
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Ask about your videos
      </h2>

      <textarea
        className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows={4}
        placeholder="e.g. Explain Flexbox with examples"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        disabled={isAsking}
      />

      {/* Ask Button (styled like Upload & Process) */}
      <button
        onClick={handleAsk}
        disabled={!question.trim() || isAsking}
        className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {isAsking ? "Thinking..." : "Ask Question"}
      </button>

      {/* Answer */}
      {answer && (
        <div className="mt-6 bg-gray-50 border rounded-xl p-5 whitespace-pre-wrap text-gray-800">
          {answer}
        </div>
      )}
    </div>
  );
}
