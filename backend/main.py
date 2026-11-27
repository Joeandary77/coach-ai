import os
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from auth import (
    CoachStore,
    create_access_token,
    decode_access_token,
    get_auth_secret,
)
from db import ReportStore
from rag import retrieve_curriculum_context
from schemas import (
    AuthResponse,
    CoachChatRequest,
    CoachChatResponse,
    CoachLoginRequest,
    CoachProfile,
    CoachProfileUpdate,
    CoachRegisterRequest,
    GenerateSessionRequest,
    HealthResponse,
    SessionReportCreate,
    SessionReportRecord,
)

load_dotenv()

cors_raw = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [origin.strip() for origin in cors_raw.split(",") if origin.strip()]

mongodb_uri = os.getenv("MONGODB_URI", "").strip() or None
mongodb_db = os.getenv("MONGODB_DB_NAME", "coachai").strip() or "coachai"

store = ReportStore(mongodb_uri=mongodb_uri, db_name=mongodb_db)
coach_store = CoachStore(mongodb_uri=mongodb_uri, db_name=mongodb_db)

app = FastAPI(
    title="CoachAI Backend API",
    version="0.2.0",
    description="Basketball & Fitness academy coaching backend (FastAPI + MongoDB).",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_optional_coach(
    authorization: str | None = Header(default=None),
) -> dict | None:
    if not authorization or not authorization.lower().startswith("bearer "):
        return None
    token = authorization.split(" ", 1)[1].strip()
    payload = decode_access_token(token, get_auth_secret())
    if not payload or not payload.get("sub"):
        return None
    return coach_store.get_by_id(payload["sub"])


def require_coach(
    coach: dict | None = Depends(get_optional_coach),
) -> dict:
    if coach is None:
        raise HTTPException(status_code=401, detail="Invalid or missing session token")
    return coach


@app.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service="coachai-backend",
        mongodb_connected=store.is_mongodb_connected,
    )


@app.post("/api/v1/auth/register", response_model=AuthResponse, status_code=201)
def register_coach(req: CoachRegisterRequest) -> AuthResponse:
    try:
        coach = coach_store.create_coach(
            full_name=req.full_name,
            email=req.email,
            password=req.password,
            role=req.role,
            assigned_age_groups=req.assigned_age_groups,
            specialty=req.specialty,
        )
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc

    token = create_access_token(coach["id"], coach["email"], get_auth_secret())
    return AuthResponse(access_token=token, coach=CoachProfile(**coach))


@app.post("/api/v1/auth/login", response_model=AuthResponse)
def login_coach(req: CoachLoginRequest) -> AuthResponse:
    coach = coach_store.authenticate(req.email, req.password)
    if coach is None:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(coach["id"], coach["email"], get_auth_secret())
    return AuthResponse(access_token=token, coach=CoachProfile(**coach))


@app.get("/api/v1/auth/me", response_model=CoachProfile)
def get_current_coach(coach: dict = Depends(require_coach)) -> CoachProfile:
    return CoachProfile(**coach)


@app.patch("/api/v1/auth/me", response_model=CoachProfile)
def update_current_coach(
    req: CoachProfileUpdate,
    coach: dict = Depends(require_coach),
) -> CoachProfile:
    updated = coach_store.update_coach(coach["id"], req.model_dump())
    if updated is None:
        raise HTTPException(status_code=404, detail="Coach profile not found")
    return CoachProfile(**updated)


@app.get("/api/v1/curriculum/summary")
def curriculum_summary() -> dict:
    return {
        "program": "Month 1 Foundations",
        "weeks": 4,
        "basketball_sessions": 36,
        "basketball_session_minutes": 60,
        "fitness_session_minutes": 30,
        "combined_saturday_minutes": 90,
        "age_groups": ["U8", "U10", "U12 (B)", "U12 (A)", "U14-16"],
        "fitness_exclusions": ["Basketballs", "Skipping ropes"],
    }


@app.post("/api/v1/sessions/generate")
def generate_session(req: GenerateSessionRequest) -> dict:
    blocks: list[dict] = []
    elapsed = 0

    if req.mode in ("basketball", "combined"):
        bball_parts = [
            ("Warm-up", 8, "Dynamic movement & ball handling activation"),
            (
                "Skill 1",
                15,
                f"Primary court skill ({req.focus if req.focus != 'ALL' else 'Footwork & Control'})",
            ),
            ("Skill 2", 15, "Secondary court skill & game transfer"),
            ("Game", 17, "Small-sided constraints & decision play"),
            ("Cool-down & Talk", 5, "Breathing reset & 1-minute coaching recap"),
        ]
        for part, mins, desc in bball_parts:
            blocks.append(
                {
                    "domain": "basketball",
                    "part": part,
                    "duration_minutes": mins,
                    "start_minute": elapsed,
                    "end_minute": elapsed + mins,
                    "summary": desc,
                }
            )
            elapsed += mins

    if req.mode in ("fitness", "combined"):
        fit_parts = [
            ("Hydration & Recovery", 3, "Water break & readiness check"),
            ("Speed & Agility", 6, "Cones, ladder, or floor markers"),
            ("Bodyweight Strength", 6, "Controlled squats, push-ups, or core holds"),
            (
                "Coordination & Balance",
                6,
                "Single-leg balance or soft/tennis ball catch",
            ),
            ("Movement Game", 4, "Cooperative relay or movement circuit"),
            ("Mobility & Cooldown", 5, "Guided mobility & calm breathing"),
        ]
        for part, mins, desc in fit_parts:
            blocks.append(
                {
                    "domain": "fitness",
                    "part": part,
                    "duration_minutes": mins,
                    "start_minute": elapsed,
                    "end_minute": elapsed + mins,
                    "summary": desc,
                }
            )
            elapsed += mins

    return {
        "mode": req.mode,
        "age_group": req.age_group,
        "week": req.week,
        "total_duration_minutes": elapsed,
        "blocks": blocks,
    }


@app.post("/api/v1/coach/chat", response_model=CoachChatResponse)
def coach_chat(req: CoachChatRequest) -> CoachChatResponse:
    text = req.message.strip()
    topics, context_lines = retrieve_curriculum_context(
        query=text,
        age_group=req.age_group,
        week=req.week,
    )
    reply = (
        f"Question: \"{text}\"\n\n"
        + "\n".join(f"- {line}" for line in context_lines)
    )
    return CoachChatResponse(
        reply=reply,
        grounded_topics=topics,
        model_mode="curriculum-rag-retriever",
    )


@app.get("/api/v1/reports", response_model=list[SessionReportRecord])
def list_reports() -> list[SessionReportRecord]:
    items = store.list_reports()
    default_storage = "mongodb" if store.is_mongodb_connected else "file"
    return [
        SessionReportRecord(
            id=item["id"],
            date=item["date"],
            age_group=item["age_group"],
            session_type=item["session_type"],
            attendance_count=item["attendance_count"],
            readiness_rating=item["readiness_rating"],
            notes=item["notes"],
            storage=item.get("storage") or default_storage,
            coach_id=item.get("coach_id"),
            coach_name=item.get("coach_name"),
        )
        for item in items
    ]


@app.post("/api/v1/reports", response_model=SessionReportRecord, status_code=201)
def create_report(
    payload: SessionReportCreate,
    coach: dict | None = Depends(get_optional_coach),
) -> SessionReportRecord:
    data = payload.model_dump()
    if coach is not None:
        data["coach_id"] = coach["id"]
        data["coach_name"] = coach["full_name"]

    record, mode = store.create_report(data)
    return SessionReportRecord(
        id=record["id"],
        date=record["date"],
        age_group=record["age_group"],
        session_type=record["session_type"],
        attendance_count=record["attendance_count"],
        readiness_rating=record["readiness_rating"],
        notes=record["notes"],
        storage=mode,
        coach_id=record.get("coach_id"),
        coach_name=record.get("coach_name"),
    )


@app.delete("/api/v1/reports/{report_id}")
def delete_report(report_id: str) -> dict:
    deleted = store.delete_report(report_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"deleted": True, "id": report_id}


@app.delete("/api/v1/auth/me")
def delete_current_coach(coach: dict = Depends(require_coach)) -> dict:
    deleted = coach_store.delete_coach(coach["id"])
    if not deleted:
        raise HTTPException(status_code=404, detail="Coach profile not found")
    return {"deleted": True, "id": coach["id"]}