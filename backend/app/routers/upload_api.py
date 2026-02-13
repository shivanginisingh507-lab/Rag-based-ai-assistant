from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import shutil
from typing import List

router = APIRouter()

VIDEO_DIR = Path("data/videos")
VIDEO_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/video")
async def upload_videos(files: List[UploadFile] = File(...)):
    uploaded_files = []

    for file in files:
        if not file.filename:
            continue

        file_path = VIDEO_DIR / file.filename

        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            uploaded_files.append(file.filename)

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload {file.filename}"
            )

    return {
        "status": "success",
        "uploaded_files": uploaded_files,
        "count": len(uploaded_files)
    }
