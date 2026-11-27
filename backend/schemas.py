from typing import Literal
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str
    service: str
    mongodb_connected: bool


class GenerateSessionRequest(BaseModel):
    mode: Literal["basketball", "fitness", "combined"] = "combined"
    age_group: str = Field(default="U12 (A)", min_length=2, max_length=20)
    week: int = Field(default=1, ge=1, le=4)
    focus: str = Field(default="ALL", max_length=50)


class CoachChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    age_group: str = Field(default="U12 (A)", max_length=20)
    week: int = Field(default=1, ge=1, le=4)


class CoachChatResponse(BaseModel):
    reply: str
    grounded_topics: list[str]
    model_mode: str


class SessionReportCreate(BaseModel):
    date: str
    age_group: str
    session_type: str
    attendance_count: int = Field(..., ge=0, le=100)
    readiness_rating: str
    notes: str = Field(..., min_length=1, max_length=2000)


class SessionReportRecord(SessionReportCreate):
    id: str
    storage: Literal["mongodb", "memory"]
