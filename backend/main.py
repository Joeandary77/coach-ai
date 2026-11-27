import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from schemas import (
    CoachChatRequest,
    CoachChatResponse,
    GenerateSessionRequest,
    HealthResponse,
    SessionReportCreate,
    SessionReportRecord,
)
from db import ReportStore

load_dotenv()

cors_raw = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [origin.strip() for origin in cors_raw.split(",") if origin.strip()]

mongodb_uri = os.getenv("MONGODB_URI", "").strip() or None
mongodb_db = os.getenv("MONGODB_DB_NAME", "coachai").strip() or "coachai"

store = ReportStore(mongodb_uri=mongodb_uri, db_name=mongodb_db)

app = FastAPI(
    title="CoachAI Backend API",
    version="0.1.0",
    description="Basketball & Fitness academy coaching backend (FastAPI + MongoDB).",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service="coachai-backend",
        mongodb_connected=store.is_mongodb_connected,
    )


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
    reply = (
        f"[{req.age_group} · Week {req.week}] Received your question: \"{text}\". "
        "Basketball practices run 60 minutes across 5 blocks (Warm-up, Skill 1, Skill 2, Game, Cool-down & Talk), "
        "and Saturday post-practice fitness runs 30 minutes across 6 blocks without basketballs or skipping ropes."
    )
    return CoachChatResponse(
        reply=reply,
        grounded_topics=[
            "Month 1 Foundations",
            "60m Court / 30m Fitness",
            "Youth Safety Rules",
        ],
        model_mode="curriculum-grounded-stub",
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
        )
        for item in items
    ]


@app.post("/api/v1/reports", response_model=SessionReportRecord, status_code=201)
def create_report(payload: SessionReportCreate) -> SessionReportRecord:
    record, mode = store.create_report(payload.model_dump())
    return SessionReportRecord(
        id=record["id"],
        date=record["date"],
        age_group=record["age_group"],
        session_type=record["session_type"],
        attendance_count=record["attendance_count"],
        readiness_rating=record["readiness_rating"],
        notes=record["notes"],
        storage=mode,
    )