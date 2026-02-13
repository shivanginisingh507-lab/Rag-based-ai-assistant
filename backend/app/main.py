from fastapi import FastAPI

from app.routers.upload_api import router as upload_router
from app.routers.process_api import router as process_router
from app.routers.query_api import router as query_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="RAG-Based AI Teaching Assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ---------------------------
# Routers
# ---------------------------
app.include_router(upload_router, prefix="/upload", tags=["Upload"])
app.include_router(process_router, prefix="/process", tags=["Process"])
app.include_router(query_router, prefix="/query", tags=["Query"])


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
