
import type {
  AgeCategory,
  Equipment,
  Exercise,
  FitnessFocus,
} from "@/types/fitness";

const all: AgeCategory[] = [
  "U8",
  "U10",
  "U12",
  "U14",
];

const older: AgeCategory[] = [
  "U12",
  "U14",
];

function defineExercise(
  id: string,
  name: string,
  focus: FitnessFocus[],
  equipment: Equipment[],
  suitableCategories: AgeCategory[] = all
): Exercise {
  return {
    id,
    name,
    description: `${name} — academy fitness activity.`,
    focus,
    equipment,
    suitableCategories,
    difficulty: "Beginner",
    instructions: [
      "Review the activity with the supervising coach.",
      "Use a comfortable and controlled movement range.",
      "Allow rest or an alternative activity when needed.",
    ],
    coachingNotes: [
      "Prioritize movement quality and enjoyment.",
      "Do not require players to complete an activity when fatigued.",
    ],
  };
}

export const additionalExercises: Exercise[] = [
  // AGILITY

  defineExercise(
    "cone-weaving",
    "Cone Weaving",
    ["Agility", "Coordination"],
    ["Cones"]
  ),

  defineExercise(
    "two-foot-ladder",
    "Two-Foot Ladder Steps",
    ["Agility", "Coordination"],
    ["Agility ladder"]
  ),

  defineExercise(
    "lateral-ladder",
    "Lateral Ladder Steps",
    ["Agility", "Coordination"],
    ["Agility ladder"]
  ),

  defineExercise(
    "red-light-green-light",
    "Red Light, Green Light",
    ["Agility", "Coordination"],
    ["Cones"]
  ),

  defineExercise(
    "whistle-freeze",
    "Whistle Freeze",
    ["Agility", "Coordination"],
    ["Whistle"]
  ),

  defineExercise(
    "partner-mirror",
    "Partner Mirror",
    ["Agility", "Coordination"],
    [],
    older
  ),

  defineExercise(
    "square-cone",
    "Square Cone Drill",
    ["Agility"],
    ["Cones"]
  ),

  defineExercise(
    "hoop-steps",
    "Hoop Stepping",
    ["Coordination", "Balance"],
    ["Hula hoops"]
  ),

  // STRENGTH

  defineExercise(
    "squat-reach",
    "Squat and Reach",
    ["Strength", "Coordination"],
    []
  ),

  defineExercise(
    "squat-calf-raise",
    "Squat and Calf Raise",
    ["Strength", "Balance"],
    []
  ),

  defineExercise(
    "reverse-lunge",
    "Reverse Lunge",
    ["Strength", "Balance"],
    [],
    older
  ),

  defineExercise(
    "split-squat",
    "Split Squat",
    ["Strength", "Balance"],
    [],
    older
  ),

  defineExercise(
    "modified-push-up",
    "Modified Push-Up",
    ["Strength"],
    ["Exercise mats"],
    ["U10", "U12", "U14"]
  ),

  defineExercise(
    "push-up",
    "Push-Up",
    ["Strength"],
    ["Exercise mats"],
    older
  ),

  defineExercise(
    "plank",
    "Plank",
    ["Strength", "Balance"],
    ["Exercise mats"],
    older
  ),

  defineExercise(
    "wall-sit",
    "Wall Sit",
    ["Strength"],
    ["Wall"],
    ["U10", "U12", "U14"]
  ),

  defineExercise(
    "shoulder-taps",
    "Shoulder Taps",
    ["Strength", "Coordination"],
    ["Exercise mats"],
    older
  ),

  // COORDINATION AND BALANCE

  defineExercise(
    "soft-ball-catch",
    "Soft-Ball Catch",
    ["Coordination"],
    ["Soft balls"]
  ),

  defineExercise(
    "tennis-ball-catch",
    "Tennis-Ball Catch",
    ["Coordination"],
    ["Tennis balls"],
    ["U10", "U12", "U14"]
  ),

  defineExercise(
    "bounce-catch",
    "Bounce and Catch",
    ["Coordination"],
    ["Tennis balls"],
    ["U10", "U12", "U14"]
  ),

  defineExercise(
    "single-leg-reach",
    "Single-Leg Reach",
    ["Balance", "Coordination"],
    ["Floor markers"],
    ["U10", "U12", "U14"]
  ),

  defineExercise(
    "hoop-freeze",
    "Hoop Step and Freeze",
    ["Balance", "Coordination"],
    ["Hula hoops"]
  ),

  defineExercise(
    "alternating-hand-catch",
    "Alternating-Hand Catch",
    ["Coordination"],
    ["Soft balls"],
    older
  ),

  // MOVEMENT GAMES

  defineExercise(
    "treasure-hunt",
    "Cone Treasure Hunt",
    ["Coordination", "Endurance"],
    ["Cones"]
  ),

  defineExercise(
    "cone-relay",
    "Cooperative Cone Relay",
    ["Coordination", "Endurance"],
    ["Cones"]
  ),

  defineExercise(
    "obstacle-course",
    "Easy Obstacle Course",
    ["Agility", "Coordination"],
    ["Cones", "Agility ladder", "Hula hoops"]
  ),

  defineExercise(
    "movement-circuit",
    "Easy Movement Circuit",
    ["Coordination", "Endurance"],
    ["Cones", "Floor markers"]
  ),

  defineExercise(
    "animal-movement",
    "Animal Movement Game",
    ["Coordination"],
    []
  ),

  // MOBILITY

  defineExercise(
    "butterfly-stretch",
    "Butterfly Stretch",
    ["Mobility"],
    ["Exercise mats"]
  ),

  defineExercise(
    "hip-circles",
    "Hip Circles",
    ["Mobility"],
    []
  ),

  defineExercise(
    "knee-hugs",
    "Knee Hugs",
    ["Mobility", "Balance"],
    []
  ),

  defineExercise(
    "calf-stretch",
    "Calf Stretch",
    ["Mobility"],
    []
  ),

  defineExercise(
    "hamstring-stretch",
    "Hamstring Stretch",
    ["Mobility"],
    []
  ),

  defineExercise(
    "hip-flexor-stretch",
    "Hip Flexor Stretch",
    ["Mobility"],
    ["Exercise mats"]
  ),

  defineExercise(
    "cat-cow",
    "Cat-Cow Mobility",
    ["Mobility"],
    ["Exercise mats"]
  ),

  defineExercise(
    "thoracic-rotation",
    "Thoracic Rotation",
    ["Mobility"],
    ["Exercise mats"]
  ),

  defineExercise(
    "side-reaches",
    "Side Reaches",
    ["Mobility"],
    []
  ),

  defineExercise(
    "full-body-mobility",
    "Guided Full-Body Mobility",
    ["Mobility", "Recovery"],
    []
  ),
];
