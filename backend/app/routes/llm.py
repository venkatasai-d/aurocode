from fastapi import APIRouter
from pydantic import BaseModel
from app.llm import get_ollama_response

# Define a Pydantic model for the request body
class PromptRequest(BaseModel):
    prompt: str  # Expect the incoming request to have a "prompt" field

router = APIRouter()

@router.post("/ask-ollama")
async def ask_ollama(request: PromptRequest):  # FastAPI will expect JSON with a "prompt" field
    try:
        response = get_ollama_response(request.prompt)  # Extract the "prompt" field
        return {"question": response}
    except Exception as e:
        return {"error": str(e)}
