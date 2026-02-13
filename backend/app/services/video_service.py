import subprocess
from pathlib import Path

from app.services.audio_service import mp3_to_json
from app.services.embedding_service import generate_embeddings

# ---------------------------
# Paths
# ---------------------------
VIDEO_DIR = Path("data/videos")
AUDIO_DIR = Path("data/audios")

AUDIO_DIR.mkdir(parents=True, exist_ok=True)

# ---------------------------
# Step 1: Video → MP3
# ---------------------------
def video_to_mp3(filename: str):
    input_path = VIDEO_DIR / filename

    tutorial_number = filename.split(" [")[0].split(" #")[1]
    file_name = filename.split(" ｜ ")[0]

    output_file = f"{tutorial_number}_{file_name}.mp3"
    output_path = AUDIO_DIR / output_file

    subprocess.run(
        ["ffmpeg","-y","-i", str(input_path), str(output_path)],
        check=True
    )

    return output_file


# ---------------------------
# Step 2–4: FULL PIPELINE
# ---------------------------
def process_video_pipeline(filename: str):
    """
    Full pipeline:
    Video → MP3 → JSON → Embeddings
    """

    # 1️⃣ Video → MP3
    mp3_file = video_to_mp3(filename)

    # 2️⃣ MP3 → JSON
    mp3_to_json(mp3_file)

    # 3️⃣ JSON → Embeddings
    total_chunks = generate_embeddings()

    return {
        "mp3_file": mp3_file,
        "total_chunks": total_chunks
    }
