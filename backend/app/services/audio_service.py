import whisper
import json
from pathlib import Path

AUDIO_DIR = Path("data/audios")
JSON_DIR = Path("data/jsons")

JSON_DIR.mkdir(parents=True, exist_ok=True)

model = whisper.load_model("base")

def mp3_to_json(audio_file: str):
    audio_path = AUDIO_DIR / audio_file

    number = audio_file.split("_")[0]
    title = audio_file.split("_")[1][:-4]

    result = model.transcribe(
        audio=str(audio_path),
        language="hi",
        task="translate",
        word_timestamps=False
    )

    chunks = []
    for segment in result["segments"]:
        chunks.append({
            "number": number,
            "title": title,
            "start": segment["start"],
            "end": segment["end"],
            "text": segment["text"]
        })

    output = {
        "chunks": chunks,
        "text": result["text"]
    }

    json_path = JSON_DIR / f"{audio_file}.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(output, f)

    return json_path.name
