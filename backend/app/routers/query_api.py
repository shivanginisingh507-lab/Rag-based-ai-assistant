from fastapi import APIRouter
from app.models.schemas import QueryRequest
from app.services.rag_service import answer_question

router = APIRouter()

@router.post("/")
def query_rag(request: QueryRequest):
    answer = answer_question(request.question)

    return {
        "question": request.question,
        "answer": answer
    }
