import os
import requests
import json
import joblib
import pandas as pd
from pathlib import Path

# -----------------------------
# Paths
# -----------------------------
BASE_DIR = Path(__file__).resolve().parent.parent.parent
JSON_DIR = BASE_DIR / "data" / "jsons"
VECTOR_DIR = BASE_DIR / "data" / "vectors"

VECTOR_DIR.mkdir(parents=True, exist_ok=True)

EMBEDDING_FILE = VECTOR_DIR / "embeddings.joblib"


# -----------------------------
# Get Ollama URL safely
# -----------------------------
def get_ollama_url():
    ollama_url = os.getenv("OLLAMA_URL")

    if not ollama_url:
        raise ValueError(
            "OLLAMA_URL not set. "
            "Set it to http://localhost:11434 (local) "
            "or http://ollama:11434 (Docker)."
        )

    return ollama_url


# -----------------------------
# Create Embeddings
# -----------------------------
def create_embedding(text_list):
    if not text_list:
        raise ValueError("Text list cannot be empty")

    ollama_url = get_ollama_url()

    try:
        response = requests.post(
            f"{ollama_url}/api/embed",
            json={
                "model": "bge-m3",
                "input": text_list
            },
            timeout=120
        )

        response.raise_for_status()
        data = response.json()

        embeddings = data.get("embeddings")

        if not embeddings:
            raise RuntimeError(
                f"No embeddings returned from Ollama. Response: {data}"
            )

        return embeddings

    except requests.exceptions.ConnectionError:
        raise ConnectionError(
            f"Could not connect to Ollama at {ollama_url}. Is it running?"
        )
    except requests.exceptions.Timeout:
        raise TimeoutError("Ollama embedding request timed out.")
    except Exception as e:
        raise RuntimeError(f"Embedding generation failed: {e}")


# -----------------------------
# Generate & Store Embeddings
# -----------------------------
def generate_embeddings():

    if not JSON_DIR.exists():
        raise FileNotFoundError(
            f"JSON directory not found at: {JSON_DIR}"
        )

    json_files = list(JSON_DIR.glob("*.json"))

    if not json_files:
        raise FileNotFoundError(
            f"No JSON files found inside: {JSON_DIR}"
        )

    all_chunks = []
    chunk_id = 0

    print(f"Found {len(json_files)} JSON files. Generating embeddings...")

    for json_file in json_files:

        with open(json_file, "r", encoding="utf-8") as f:
            content = json.load(f)

        chunks = content.get("chunks")

        if not chunks:
            print(f"Skipping {json_file.name} (no chunks found)")
            continue

        texts = [c["text"] for c in chunks]

        embeddings = create_embedding(texts)

        for i, chunk in enumerate(chunks):
            chunk["chunk_id"] = chunk_id
            chunk["embedding"] = embeddings[i]
            chunk_id += 1
            all_chunks.append(chunk)

    if not all_chunks:
        raise RuntimeError("No chunks processed. Embeddings not created.")

    df = pd.DataFrame.from_records(all_chunks)

    joblib.dump(df, EMBEDDING_FILE)

    print(f"Embeddings saved to: {EMBEDDING_FILE}")
    print(f"Total chunks processed: {len(df)}")

    return len(df)


# -----------------------------
# Ensure Embeddings Exist
# -----------------------------
def ensure_embeddings():
    if not EMBEDDING_FILE.exists():
        print("Embeddings file not found. Creating now...")
        generate_embeddings()

    return EMBEDDING_FILE
