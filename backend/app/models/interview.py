from pydantic import BaseModel
from typing import List
from bson import ObjectId

class QuestionAnswer(BaseModel):
    question: str
    answer: str

class Interview(BaseModel):
    id: str = None
    interviewee_name: str
    responses: List[QuestionAnswer]

    class Config:
        orm_mode = True
        arbitrary_types_allowed = True
