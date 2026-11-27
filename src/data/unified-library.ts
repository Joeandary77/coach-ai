import { exercises } from "@/data/exercises";
import { basketballDrills } from "@/data/basketball-sessions-w3-w4";
import type {
  BasketballDrill,
  UnifiedLibraryItem,
} from "@/types/training";
import type { Exercise } from "@/types/fitness";

function mapExerciseToUnified(exercise: Exercise): UnifiedLibraryItem {
  return {
    id: `fitness-${exercise.id}`,
    domain: "fitness",
    name: exercise.name,
    description: exercise.description,
    focus: exercise.focus,
    equipment: exercise.equipment,
    difficulty: exercise.difficulty,
    ageLabels: exercise.suitableCategories,
    cohorts: exercise.suitableCategories,
    instructions: exercise.instructions,
    coachingNotes: exercise.coachingNotes,
    source: "academy_fitness",
    rawExercise: exercise,
  };
}

function mapDrillToUnified(drill: BasketballDrill): UnifiedLibraryItem {
  return {
    id: drill.id,
    domain: "basketball",
    name: drill.name,
    description: `Week ${drill.week} (${drill.part}) · ${drill.sessionTitle}`,
    focus: drill.focus,
    equipment: drill.equipment,
    difficulty: drill.difficulty,
    ageLabels: drill.ageGroups,
    cohorts: drill.cohorts,
    instructions: [drill.instructions],
    coachingNotes: [drill.coachingCues],
    durationMinutes: drill.durationMinutes,
    source: "pdf_month1_foundations",
    rawDrill: drill,
  };
}

export const unifiedFitnessItems: UnifiedLibraryItem[] =
  exercises.map(mapExerciseToUnified);

export const unifiedBasketballItems: UnifiedLibraryItem[] =
  basketballDrills.map(mapDrillToUnified);

export const unifiedLibrary: UnifiedLibraryItem[] = [
  ...unifiedBasketballItems,
  ...unifiedFitnessItems,
];