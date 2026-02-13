"use client";

import { useState } from "react";
import UploadForm from "@/components/UploadForm";
import Link from "next/link";

export default function Home() {
  const [canChat, setCanChat] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        MediaSage AI Assistant
      </h1>

      <p className="text-gray-600 mb-10 text-center max-w-lg">
        Upload your videos and ask questions powered by
        Retrieval-Augmented Generation.
      </p>

      <UploadForm onUploadSuccess={() => setCanChat(true)} />

      {/* Go to Chat */}
      <div className="mt-8">
        {canChat ? (
          <Link
            href="/chat"
            className="text-indigo-600 font-medium hover:underline"
          >
            Go to Chat →
          </Link>
        ) : (
          <span className="text-gray-400 cursor-not-allowed">
            Go to Chat → (upload a video first)
          </span>
        )}
      </div>
    </main>
  );
}
