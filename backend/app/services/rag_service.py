import os
import joblib
import numpy as np
import requests
from sklearn.metrics.pairwise import cosine_similarity
from google import genai
from dotenv import load_dotenv
from pathlib import Path

from app.services.embedding_service import ensure_embeddings

load_dotenv()

LLM_MODEL = "gemini-2.5-flash"

VECTOR_FILE = Path("data/vectors/embeddings.joblib")
def get_ollama_url():
    ollama_url = os.getenv("OLLAMA_URL")

    if not ollama_url:
        raise ValueError(
            "OLLAMA_URL not set. "
            "Set it to http://localhost:11434 (local) "
            "or http://ollama:11434 (Docker)."
        )

    return ollama_url

def get_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not loaded")
    return genai.Client(api_key=api_key)

def create_embedding(text_list):
    ollama_url = get_ollama_url()
    r = requests.post(
        f"{ollama_url}/api/embed",
        json={"model": "bge-m3", "input": text_list}
    )
    return r.json()["embeddings"]

def inference(prompt: str) -> str:
    client = get_client()
    response = client.models.generate_content(
        model=LLM_MODEL,
        contents=prompt
    )
    return response.text.strip()


def answer_question(question: str):
    vector_file = ensure_embeddings()
    df = joblib.load(vector_file)

    question_embedding = create_embedding([question])[0]

    similarities = cosine_similarity(
        np.vstack(df["embedding"].values),
        [question_embedding]
    ).flatten()

    top_indices = similarities.argsort()[::-1][:5]
    context_df = df.iloc[top_indices]

    prompt = f"""
I am uploading some videos.

Here are video subtitle chunks:

{context_df[["title","number","start","end","text"]].to_json(orient="records", indent=2)}

---------------------------------
User question:
"{question}"

Answer in a human way:
- Mention which video
- Mention timestamps
- Guide the user clearly
- If unrelated, say you only answer video-related questions.
"""

    return inference(prompt)
