from fastapi import APIRouter, HTTPException
from app.models.interview import Interview
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# MongoDB Setup
MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)
db = client["interview_bot"]
interviews_collection = db["interviews"]

@router.post("/interview")
async def store_interview(interview: Interview):
    interview_dict = interview.dict()
    result = await interviews_collection.insert_one(interview_dict)
    if result.inserted_id:
        return {"message": "Interview stored successfully", "id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Failed to store interview")

# Helper function to convert ObjectId to string
def interview_serializer(interview):
    interview['_id'] = str(interview['_id'])
    return interview

@router.get("/interview/{id}")
async def get_interview(id: str):
    interview = await interviews_collection.find_one({"_id": ObjectId(id)})
    if interview:
        return interview_serializer(interview)
    raise HTTPException(status_code=404, detail="Interview not found")