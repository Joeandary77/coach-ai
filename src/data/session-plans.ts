
import type {
  AgeCategory,
  SessionExercise,
} from "@/types/fitness";

import type {
  SessionPlan,
} from "@/data/fitness-program";

function references(
  ids: string[]
): SessionExercise[] {
  return ids.map((exerciseId) => ({
    exerciseId,
    notes: "Optional activity. Adapt to readiness.",
  }));
}

function plan(
  category: AgeCategory,
  week: number,
  description: string,
  agility: string[],
  strength: string[],
  coordination: string[],
  game: string[],
  mobility: string[]
): SessionPlan {
  return {
    category,
    week,
    description,
    exercises: {
      recovery: references(["water-recovery"]),
      "speed-agility": references(agility),
      strength: references(strength),
      "coordination-balance": references(coordination),
      "movement-game": references(game),
      cooldown: references(mobility),
    },
  };
}

export const academySessionPlans: SessionPlan[] = [
  // WEEK 1 — ATHLETIC FOUNDATIONS

  plan(
    "U8",
    1,
    "Explore fundamental movement skills.",
    ["ladder-walk", "cone-weaving", "red-light-green-light"],
    ["bodyweight-squat", "wall-push-up"],
    ["hoop-steps", "single-leg-balance", "soft-ball-catch"],
    ["treasure-hunt"],
    ["arm-circles", "ankle-mobility", "butterfly-stretch"]
  ),

  plan(
    "U10",
    1,
    "Develop familiarity with fundamental movements.",
    ["two-foot-ladder", "cone-weaving"],
    ["bodyweight-squat", "wall-push-up", "glute-bridge"],
    ["hoop-steps", "single-leg-balance", "soft-ball-catch"],
    ["cone-relay"],
    ["hip-circles", "knee-hugs", "calf-stretch"]
  ),

  plan(
    "U12",
    1,
    "Practice controlled footwork and body control.",
    ["ladder-walk", "lateral-ladder", "cone-walk"],
    ["bodyweight-squat", "reverse-lunge", "plank"],
    ["step-and-balance", "tennis-ball-catch"],
    ["movement-circuit"],
    ["ankle-mobility", "hip-circles", "hamstring-stretch"]
  ),

  plan(
    "U14",
    1,
    "Revisit fundamental athletic movement patterns.",
    ["lateral-ladder", "reaction-steps", "lateral-steps"],
    ["bodyweight-squat", "reverse-lunge", "push-up"],
    ["single-leg-balance", "step-and-balance"],
    ["movement-circuit"],
    ["hip-flexor-stretch", "calf-stretch", "ankle-mobility"]
  ),

  // WEEK 2 — SPEED, AGILITY AND REACTION

  plan(
    "U8",
    2,
    "Explore simple movement signals.",
    ["color-marker-game", "whistle-freeze", "ladder-walk"],
    ["squat-reach", "wall-push-up"],
    ["soft-ball-catch", "line-walk"],
    ["follow-the-leader"],
    ["arm-circles", "ankle-mobility", "side-reaches"]
  ),

  plan(
    "U10",
    2,
    "Practice responding to movement cues.",
    ["color-marker-game", "lateral-ladder"],
    ["squat-calf-raise", "glute-bridge", "wall-sit"],
    ["bounce-catch", "line-walk"],
    ["treasure-hunt"],
    ["hip-circles", "calf-stretch"]
  ),

  plan(
    "U12",
    2,
    "Practice cooperative reaction activities.",
    ["partner-mirror", "whistle-freeze", "lateral-ladder"],
    ["reverse-lunge", "bird-dog", "wall-sit"],
    ["alternating-hand-catch", "line-walk"],
    ["cone-relay"],
    ["hip-circles", "hamstring-stretch", "ankle-mobility"]
  ),

  plan(
    "U14",
    2,
    "Explore controlled changes of direction.",
    ["reaction-steps", "cone-weaving", "partner-mirror"],
    ["split-squat", "push-up", "plank"],
    ["soft-ball-catch", "cross-body-march"],
    ["movement-circuit"],
    ["hip-circles", "ankle-mobility", "hip-flexor-stretch"]
  ),

  // WEEK 3 — STRENGTH, STABILITY AND BODY CONTROL

  plan(
    "U8",
    3,
    "Explore balance and comfortable body movements.",
    ["hoop-steps", "red-light-green-light"],
    ["bodyweight-squat", "wall-push-up"],
    ["line-walk", "single-leg-balance", "hoop-freeze"],
    ["animal-movement"],
    ["butterfly-stretch", "cat-cow", "side-reaches"]
  ),

  plan(
    "U10",
    3,
    "Practice basic stability and coordination.",
    ["square-cone", "ladder-walk", "lateral-ladder"],
    ["bodyweight-squat", "modified-push-up", "wall-sit"],
    ["single-leg-reach", "hoop-freeze", "soft-ball-catch"],
    ["obstacle-course"],
    ["cat-cow", "hip-circles", "ankle-mobility"]
  ),

  plan(
    "U12",
    3,
    "Explore controlled stability movements.",
    ["cone-walk", "lateral-ladder"],
    ["split-squat", "glute-bridge", "plank"],
    ["single-leg-reach", "step-and-balance"],
    ["movement-circuit"],
    ["hip-circles", "calf-stretch", "thoracic-rotation"]
  ),

  plan(
    "U14",
    3,
    "Revisit body control and movement technique.",
    ["lateral-steps", "reaction-steps"],
    ["bodyweight-squat", "push-up", "shoulder-taps"],
    ["single-leg-reach", "tennis-ball-catch"],
    ["movement-circuit"],
    ["hip-circles", "thoracic-rotation", "hip-flexor-stretch"]
  ),

  // WEEK 4 — COMBINED ATHLETIC CHALLENGES

  plan(
    "U8",
    4,
    "Revisit familiar skills through enjoyable games.",
    ["ladder-walk", "cone-weaving"],
    ["squat-reach", "wall-push-up"],
    ["hoop-steps", "soft-ball-catch", "single-leg-balance"],
    ["treasure-hunt"],
    ["full-body-mobility"]
  ),

  plan(
    "U10",
    4,
    "Combine familiar movement and coordination skills.",
    ["ladder-walk", "color-marker-game"],
    ["bodyweight-squat", "glute-bridge", "wall-sit"],
    ["hoop-steps", "bounce-catch", "single-leg-balance"],
    ["obstacle-course"],
    ["full-body-mobility"]
  ),

  plan(
    "U12",
    4,
    "Revisit footwork, balance and cooperative activities.",
    ["lateral-ladder", "reaction-steps", "cone-walk"],
    ["bodyweight-squat", "reverse-lunge", "push-up"],
    ["single-leg-balance", "cross-body-march", "hoop-freeze"],
    ["obstacle-course"],
    ["full-body-mobility"]
  ),

  plan(
    "U14",
    4,
    "Combine previously explored movement patterns.",
    ["lateral-ladder", "lateral-steps", "reaction-steps"],
    ["split-squat", "push-up", "shoulder-taps"],
    ["alternating-hand-catch", "single-leg-balance", "line-walk"],
    ["movement-circuit"],
    ["full-body-mobility"]
  ),
];
