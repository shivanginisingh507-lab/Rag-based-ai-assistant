FROM python:3.10-slim

# System deps (ffmpeg + build tools)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app

# Copy only requirements first (layer caching)
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY app ./app

# Create data dirs (will be overridden by volume)
RUN mkdir -p data/videos data/audios data/jsons data/vectors

# Whisper model cache dir
ENV WHISPER_CACHE_DIR=/root/.cache/whisper

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
