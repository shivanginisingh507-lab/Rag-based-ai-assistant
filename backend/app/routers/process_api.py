from fastapi import APIRouter, BackgroundTasks, HTTPException
from app.services.video_service import process_video_pipeline
from pathlib import Path

router = APIRouter()

VIDEO_DIR = Path("data/videos")


@router.post("/video")
def process_video(
    filename: str,
    background_tasks: BackgroundTasks
):
    video_path = VIDEO_DIR / filename

    if not video_path.exists():
        raise HTTPException(status_code=404, detail="Video file not found")

    # 🔥 Run pipeline in background
    background_tasks.add_task(process_video_pipeline, filename)

    return {
        "status": "processing_started",
        "filename": filename,
        "message": "Video processing is running in background"
    }
