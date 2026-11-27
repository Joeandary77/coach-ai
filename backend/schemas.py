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
    age_group: str = Field(default="U12 (A)", min_length=2, max_length=20)
    week: int = Field(default=1, ge=1, le=4)


class CoachChatResponse(BaseModel):
    reply: str
    grounded_topics: list[str]
    model_mode: str


class CoachRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=150)
    password: str = Field(..., min_length=6, max_length=128)
    role: Literal["Head Coach", "Assistant Coach", "Fitness Coach"] = "Assistant Coach"
    assigned_age_groups: list[str] = Field(default_factory=lambda: ["U12 (A)"])
    specialty: str = Field(default="Basketball Fundamentals", max_length=100)


class CoachLoginRequest(BaseModel):
    email: str = Field(..., min_length=5, max_length=150)
    password: str = Field(..., min_length=1, max_length=128)


class CoachProfileUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=100)
    role: Literal["Head Coach", "Assistant Coach", "Fitness Coach"] | None = None
    assigned_age_groups: list[str] | None = None
    specialty: str | None = Field(default=None, max_length=100)


class CoachProfile(BaseModel):
    id: str
    full_name: str
    email: str
    role: str
    assigned_age_groups: list[str]
    specialty: str
    created_at: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    coach: CoachProfile


class SessionReportCreate(BaseModel):
    date: str
    age_group: str
    session_type: str
    attendance_count: int = Field(..., ge=0, le=100)
    readiness_rating: str
    notes: str = Field(..., min_length=1, max_length=2000)


class SessionReportRecord(SessionReportCreate):
    id: str
    storage: Literal["mongodb", "file", "memory"]
    coach_id: str | None = None
    coach_name: str | None = None