
import type {
  AgeCategory,
  Exercise,
} from "@/types/fitness";

import { additionalExercises } from "@/data/additional-exercises";

const allCategories: AgeCategory[] = [
  "U8",
  "U10",
  "U12",
  "U14",
];

export const exercises: Exercise[] = [
  // RECOVERY

  {
    id: "water-recovery",
    name: "Water and Recovery Break",
    description:
      "A recovery period following basketball training.",
    focus: ["Recovery"],
    equipment: [],
    difficulty: "Beginner",
    suitableCategories: allCategories,
    instructions: [
      "Allow players to drink water.",
      "Check how players are feeling.",
      "Give additional recovery time when needed.",
    ],
    coachingNotes: [
      "Check readiness before starting fitness activities.",
      "Never restrict access to water.",
    ],
  },

  // SPEED AND AGILITY

  {
    id: "cone-walk",
    name: "Cone Walk",
    description:
      "Controlled movement between cones.",
    focus: ["Agility", "Coordination"],
    equipment: ["Cones"],
    difficulty: "Beginner",
    suitableCategories: allCategories,
    instructions: [
      "Arrange cones with sufficient space.",
      "Walk between the cones.",
      "Change direction with control.",
    ],
    coachingNotes: [
      "Maintain safe spacing.",
      "Prioritize movement quality over speed.",
    ],
  },

  {
    id: "lateral-steps",
    name: "Lateral Steps",
    description:
      "Controlled sideways movement.",
    focus: ["Agility", "Coordination"],
    equipment: ["Cones"],
    difficulty: "Beginner",
    suitableCategories: allCategories,
    instructions: [
      "Stand comfortably with knees slightly bent.",
      "Step sideways between the markers.",
      "Return in the opposite direction.",
    ],
    coachingNotes: [
      "Keep movements comfortable.",
      "Avoid rushing direction changes.",
    ],
  },

  {
    id: "ladder-walk",
    name: "Agility Ladder Walk",
    description:
      "A basic foot coordination activity.",
    focus: ["Agility", "Coordination"],
    equipment: ["Agility ladder"],
    difficulty: "Beginner",
    suitableCategories: allCategories,
    instructions: [
      "Step through the ladder squares.",
      "Place each foot carefully.",
      "Walk back around the ladder.",
    ],
    coachingNotes: [
      "Use a comfortable pace.",
      "Ensure the ladder lies flat.",
    ],
  },

  {
    id: "reaction-steps",
    name: "Reaction Steps",
    description:
      "Responding to simple coaching signals.",
    focus: ["Speed", "Agility"],
    equipment: ["Floor markers"],
    difficulty: "Beginner",
    suitableCategories: allCategories,
    instructions: [
      "Stand near the starting marker.",
      "Listen for the coach's direction.",
      "Step toward the indicated marker.",
    ],
    coachingNotes: [
      "Keep distances short.",
      "Avoid collisions between players.",
    ],
  },

  // STRENGTH

  {
    id: "bodyweight-squat",
    name: "Bodyweight Squat",
    description:
      "A foundational lower-body movement.",
    focus: ["Strength", "Balance"],
    equipment: [],
    difficulty: "Beginner",
    suitableCategories: allCategories,
    instructions: [
      "Stand with feet comfortably apart.",
      "Bend the knees and hips gently.",
      "Return to a comfortable standing position.",
    ],
    coachingNotes: [
      "Use a comfortable movement range.",
      "Stop before technique deteriorates.",
    ],
  },

  {
    id: "wall-push-up",
    name: "Wall Push-Up",
    description:
      "An introductory upper-body movement.",
    focus: ["Strength"],
    equipment: ["Wall"],
    difficulty: "Beginner",
    suitableCategories: allCategories,
    instructions: [
      "Place hands against a stable wall.",
      "Bend the elbows gently.",
      "Push back to the starting position.",
    ],
    coachingNotes: [
      "Maintain comfortable body alignment.",
      "Avoid exercising to exhaustion.",
    ],
  },

  {
    id: "glute-bridge",
    name: "Glute Bridge",
    description:
      "A controlled hip movement on a mat.",
    focus: ["Strength", "Coordination"],
    equipment: ["Exercise mats"],
    difficulty: "Beginner",
    suitableCategories: ["U10", "U12", "U14"],
    instructions: [
      "Lie on the mat with knees bent.",
      "Lift the hips gently.",
      "Lower the hips with control.",
    ],
    coachingNotes: [
      "Avoid excessive back arching.",
      "Keep the movement comfortable.",
    ],
  },

  {
    id: "bird-dog",
    name: "Bird Dog",
    description:
      "A controlled stability and coordination exercise.",
    focus: ["Strength", "Balance", "Coordination"],
    equipment: ["Exercise mats"],
    difficulty: "Intermediate",
    suitableCategories: ["U10", "U12", "U14"],
    instructions: [
      "Start on hands and knees.",
      "Extend one arm or the opposite leg.",
      "Return slowly and change sides.",
    ],
    coachingNotes: [
      "Begin with one limb at a time.",
      "Focus on stability rather than repetitions.",
    ],
  },

  // COORDINATION AND BALANCE

  {
    id: "single-leg-balance",
    name: "Single-Leg Balance",
    description:
      "Developing controlled standing balance.",
    focus: ["Balance", "Coordination"],
    equipment: [],
    difficulty: "Beginner",
    suitableCategories: allCategories,
    instructions: [
      "Stand on one leg.",
      "Keep the other foot close to the floor.",
      "Switch legs when comfortable.",
    ],
    coachingNotes: [
      "Allow support when needed.",
      "Avoid competitive holding times.",
    ],
  },

  {
    id: "line-walk",
    name: "Line Walk",
    description:
      "Walking along a marked line with control.",
    focus: ["Balance", "Coordination"],
    equipment: ["Floor markers"],
    difficulty: "Beginner",
    suitableCategories: allCategories,
    instructions: [
      "Follow a straight marked line.",
      "Take controlled steps.",
      "Keep the head in a comfortable position.",
    ],
    coachingNotes: [
      "Allow arms to assist balance.",
      "Use wider paths when needed.",
    ],
  },

  {
    id: "cross-body-march",
    name: "Cross-Body March",
    description:
      "Coordinating opposite sides of the body.",
    focus: ["Coordination", "Balance"],
    equipment: [],
    difficulty: "Beginner",
    suitableCategories: allCategories,
    instructions: [
      "March gently in place.",
      "Move the opposite arm and leg together.",
      "Maintain a comfortable rhythm.",
    ],
    coachingNotes: [
      "Demonstrate the movement first.",
      "Allow players to move at their own pace.",
    ],
  },

  {
    id: "step-and-balance",
    name: "Step and Balance",
    description:
      "Combining controlled stepping and balance.",
    focus: ["Balance", "Coordination"],
    equipment: ["Floor markers"],
    difficulty: "Beginner",
    suitableCategories: allCategories,
    instructions: [
      "Step toward a nearby marker.",
      "Pause briefly in a stable position.",
      "Return to the starting position.",
    ],
    coachingNotes: [
      "Maintain clear space between players.",
      "Use smaller steps if needed.",
    ],
  },

  // MOVEMENT GAMES

  {
    id: "follow-the-leader",
    name: "Follow the Leader",
    description:
      "A cooperative movement activity.",
    focus: ["Coordination", "Endurance"],
    equipment: ["Cones"],
    difficulty: "Beginner",
    suitableCategories: allCategories,
    instructions: [
      "Follow the coach through simple movements.",
      "Walk, step sideways or march gently.",
      "Change movements when instructed.",
    ],
    coachingNotes: [
      "Keep the game enjoyable and noncompetitive.",
      "Include frequent recovery opportunities.",
    ],
  },

  {
    id: "color-marker-game",
    name: "Color Marker Game",
    description:
      "A movement game using colored markers.",
    focus: ["Agility", "Coordination"],
    equipment: ["Floor markers"],
    difficulty: "Beginner",
    suitableCategories: allCategories,
    instructions: [
      "Listen for the announced color.",
      "Move toward a matching marker.",
      "Return when the coach gives a signal.",
    ],
    coachingNotes: [
      "Avoid elimination rules.",
      "Provide enough markers for everyone.",
    ],
  },

  // MOBILITY AND COOLDOWN

  {
    id: "arm-circles",
    name: "Gentle Arm Circles",
    description:
      "Comfortable shoulder mobility.",
    focus: ["Mobility"],
    equipment: [],
    difficulty: "Beginner",
    suitableCategories: allCategories,
    instructions: [
      "Stand in a comfortable position.",
      "Make small controlled arm circles.",
      "Change direction gently.",
    ],
    coachingNotes: [
      "Avoid painful movement ranges.",
      "Keep shoulders relaxed.",
    ],
  },

  {
    id: "ankle-mobility",
    name: "Ankle Mobility",
    description:
      "Gentle ankle movement and control.",
    focus: ["Mobility", "Balance"],
    equipment: [],
    difficulty: "Beginner",
    suitableCategories: allCategories,
    instructions: [
      "Stand or sit comfortably.",
      "Move one ankle gently.",
      "Repeat on the other side.",
    ],
    coachingNotes: [
      "Use support if standing.",
      "Never force the movement.",
    ],
  },

  {
    id: "cooldown-walk",
    name: "Cooldown Walk",
    description:
      "Relaxed movement to finish the session.",
    focus: ["Recovery", "Mobility"],
    equipment: [],
    difficulty: "Beginner",
    suitableCategories: allCategories,
    instructions: [
      "Walk slowly around the training area.",
      "Allow breathing to settle naturally.",
      "Finish with water and recovery.",
    ],
    coachingNotes: [
      "Allow players to rest whenever needed.",
      "Check for discomfort or unusual fatigue.",
    ],
  },
  ...additionalExercises,
];

// Find an exercise by its unique ID.
export function getExerciseById(
  id: string
): Exercise | undefined {
  return exercises.find(
    (exercise) => exercise.id === id
  );
}

// Retrieve exercises suitable for an age category.
export function getExercisesByCategory(
  category: AgeCategory
): Exercise[] {
  return exercises.filter((exercise) =>
    exercise.suitableCategories.includes(category)
  );
}

// Retrieve exercises by fitness focus.
export function getExercisesByFocus(
  focus: Exercise["focus"][number]
): Exercise[] {
  return exercises.filter((exercise) =>
    exercise.focus.includes(focus)
  );
}
