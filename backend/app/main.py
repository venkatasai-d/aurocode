from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.interview import router as interview_router
from app.routes.llm import router as llm_router
from app.routes.stt import router as stt_router
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = FastAPI()

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(interview_router, prefix="/api")
app.include_router(llm_router, prefix="/api")
app.include_router(stt_router, prefix='/api')
