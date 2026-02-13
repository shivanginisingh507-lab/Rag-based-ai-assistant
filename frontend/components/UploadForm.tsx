"use client";

import { useState } from "react";
import { uploadVideosWithProgress, processVideo } from "@/lib/api";

export default function UploadForm({
  onUploadSuccess,
}: {
  onUploadSuccess: () => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // ✅ Remove single file
  function removeFile(indexToRemove: number) {
    if (isUploading || isProcessing) return;
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  }

  // ✅ Clear all files
  function clearAllFiles() {
    if (isUploading || isProcessing) return;
    setFiles([]);
  }

  async function handleUpload() {
    if (files.length === 0) return;

    try {
      setIsUploading(true);
      setProgress(0);
      setStatus("Uploading videos...");

      const uploadRes = await uploadVideosWithProgress(files, setProgress);

      setIsUploading(false);
      setIsProcessing(true);
      setStatus("Starting background processing...");

      for (const filename of uploadRes.uploaded_files) {
        await processVideo(filename);
      }

      setStatus("✅ All videos uploaded & processing started");
      setFiles([]); // optional: clear after success
      onUploadSuccess();
    } catch (err) {
      console.error(err);
      setStatus("❌ Something went wrong. Please try again.");
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Upload Videos
      </h2>

      {/* Upload Box */}
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 rounded-xl p-8 cursor-pointer hover:bg-indigo-50 transition">
        <svg
          className="w-12 h-12 text-indigo-500 mb-3"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16v-8m0 0l-3 3m3-3l3 3M20 16.5a4.5 4.5 0 00-3.5-4.37 6 6 0 10-11 2.02"
          />
        </svg>

        <p className="text-gray-600 font-medium">
          Drag & drop your videos here
        </p>
        <p className="text-sm text-gray-400 mt-1">
          or click to browse
        </p>

        <input
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              setFiles((prev) => [
                ...prev,
                ...Array.from(e.target.files!),
              ]);
            }
          }}
          disabled={isUploading || isProcessing}
        />
      </label>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex justify-between items-center mb-2">
            <p className="font-medium">Selected Files:</p>
            <button
              onClick={clearAllFiles}
              disabled={isUploading || isProcessing}
              className="text-red-500 text-xs hover:underline disabled:opacity-50"
            >
              Clear All
            </button>
          </div>

          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg"
              >
                <span className="truncate text-sm">
                  {file.name}
                </span>

                <button
                  onClick={() => removeFile(index)}
                  disabled={isUploading || isProcessing}
                  className="text-red-500 text-xs hover:underline disabled:opacity-50"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Progress Bar */}
      {isUploading && (
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1 text-center">
            {progress}% uploaded
          </p>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={files.length === 0 || isUploading || isProcessing}
        className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {isUploading
          ? "Uploading..."
          : isProcessing
          ? "Processing..."
          : "Upload & Process"}
      </button>

      {/* Processing Spinner */}
      {isProcessing && (
        <div className="flex items-center justify-center gap-2 mt-4 text-indigo-600">
          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">
            Processing videos in background…
          </span>
        </div>
      )}

      {/* Status Message */}
      {status && (
        <p className="mt-4 text-center text-sm text-gray-600">
          {status}
        </p>
      )}
    </div>
  );
}
