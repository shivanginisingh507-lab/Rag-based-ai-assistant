const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Upload video WITH progress tracking
 */
export function uploadVideosWithProgress(
  files: File[],
  onProgress: (percent: number) => void
): Promise<{ uploaded_files: string[] }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    // 🔥 IMPORTANT: field name must match FastAPI param "files"
    files.forEach((file) => {
      formData.append("files", file);
    });

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));

    xhr.open("POST", `${BASE_URL}/upload/video`);
    xhr.send(formData);
  });
}

/**
 * Trigger background processing
 */
export async function processVideo(filename: string) {
  const res = await fetch(
    `${BASE_URL}/process/video?filename=${encodeURIComponent(filename)}`,
    { method: "POST" }
  );

  if (!res.ok) {
    throw new Error("Failed to start processing");
  }

  return res.json();
}

/**
 * Ask RAG question
 */
export async function askQuestion(question: string) {
  const res = await fetch(`${BASE_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch answer");
  }

  return res.json();
}
