from dataclasses import dataclass


@dataclass(frozen=True)
class CurriculumChunk:
    topic: str
    tags: tuple[str, ...]
    content: str


CURRICULUM_CHUNKS: tuple[CurriculumChunk, ...] = (
    CurriculumChunk(
        topic="Basketball Session Structure (60m)",
        tags=("basketball", "60", "session", "structure", "warm-up", "skill", "game", "cool-down", "practice"),
        content=(
            "Each basketball court session runs 60 minutes across 5 blocks: "
            "Warm-up, Skill 1, Skill 2, Game, and Cool-down & Talk, with scheduled hydration breaks."
        ),
    ),
    CurriculumChunk(
        topic="Saturday Fitness Conditioning (30m)",
        tags=("fitness", "30", "saturday", "conditioning", "post-practice", "agility", "strength", "balance", "mobility"),
        content=(
            "Post-practice fitness runs 30 minutes on Saturdays across 6 blocks: "
            "Hydration & Recovery (3m), Speed & Agility (6m), Bodyweight Strength (6m), "
            "Coordination & Balance (6m), Optional Movement Game (4m), and Mobility & Cooldown (5m)."
        ),
    ),
    CurriculumChunk(
        topic="Combined Saturday Session (90m)",
        tags=("combined", "90", "saturday", "both", "full", "court", "fitness"),
        content=(
            "Combined Saturday sessions pair a 60-minute basketball court session with a 30-minute "
            "post-practice fitness block for 90 minutes total."
        ),
    ),
    CurriculumChunk(
        topic="Fitness Safety & Equipment Exclusions",
        tags=("safety", "equipment", "basketballs", "skipping", "ropes", "excluded", "u8", "u10", "u12", "u14", "readiness", "water"),
        content=(
            "Fitness activities strictly exclude basketballs and skipping ropes. "
            "Adapt intensity and range of motion to player readiness across U8, U10, U12 (B), U12 (A), and U14-16, "
            "and allow water or rest whenever needed."
        ),
    ),
    CurriculumChunk(
        topic="Month 1 Weekly Progression",
        tags=("week", "month", "curriculum", "ball handling", "footwork", "passing", "shooting", "defense", "team"),
        content=(
            "Month 1 spans 4 weeks (36 basketball sessions across Wed, Thu, and Sat) progressing from "
            "foundational movement and control into game decision-making and team concepts."
        ),
    ),
)


def retrieve_curriculum_context(
    query: str,
    age_group: str,
    week: int,
    max_chunks: int = 3,
) -> tuple[list[str], list[str]]:
    tokens = {
        word.strip(".,!?:;\"'()").lower()
        for word in query.split()
        if len(word.strip(".,!?:;\"'()")) >= 2
    }

    scored: list[tuple[int, CurriculumChunk]] = []
    for chunk in CURRICULUM_CHUNKS:
        score = 0
        for tag in chunk.tags:
            if tag in tokens or tag in query.lower():
                score += 2
        for word in tokens:
            if word in chunk.content.lower() or word in chunk.topic.lower():
                score += 1
        scored.append((score, chunk))

    scored.sort(key=lambda pair: pair[0], reverse=True)
    selected = [chunk for score, chunk in scored[:max_chunks] if score > 0]
    if not selected:
        selected = list(CURRICULUM_CHUNKS[:2])

    topics = [chunk.topic for chunk in selected]
    lines = [f"[{age_group} · Week {week}] {chunk.content}" for chunk in selected]
    return topics, lines