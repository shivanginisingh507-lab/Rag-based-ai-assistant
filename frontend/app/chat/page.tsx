import ChatBox from "@/components/ChatBox";
import Link from "next/link";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
         Chat Assistant 
      </h1>

      <p className="text-gray-600 mb-8 text-center max-w-lg">
        Ask questions based on the uploaded videos.
        Answers are grounded with timestamps and context.
      </p>

      <ChatBox />

      <div className="mt-6">
        <Link
          href="/"
          className="text-indigo-600 font-medium hover:underline"
        >
          ← Back to Upload
        </Link>
      </div>
    </main>
  );
}
