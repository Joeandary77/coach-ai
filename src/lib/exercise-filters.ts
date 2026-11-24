
import type {
  AgeCategory,
  Equipment,
  Exercise,
  ExerciseDifficulty,
  FitnessFocus,
} from "@/types/fitness";

export type ExerciseSort =
  | "default"
  | "name-asc"
  | "name-desc";

export interface ExerciseFilters {
  search: string;
  category: AgeCategory | "all";
  focus: FitnessFocus | "all";
  equipment: Equipment | "all" | "none";
  difficulty: ExerciseDifficulty | "all";
  sort: ExerciseSort;
}

export const defaultExerciseFilters: ExerciseFilters = {
  search: "",
  category: "all",
  focus: "all",
  equipment: "all",
  difficulty: "all",
  sort: "default",
};

// Normalize search text to handle hyphens,
// underscores, uppercase letters and extra spaces.
function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[-_\u2010-\u2015]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Filter and sort exercises.
export function filterExercises(
  exercises: Exercise[],
  filters: ExerciseFilters
): Exercise[] {
  const search = normalizeSearchText(filters.search);

  const filtered = exercises.filter((exercise) => {
    const searchableText = normalizeSearchText(
      [
        exercise.name,
        exercise.description,
        ...exercise.focus,
        ...exercise.equipment,
        ...exercise.suitableCategories,
      ].join(" ")
    );

    // Search filter
    const matchesSearch =
      search === "" || searchableText.includes(search);

    // Age category filter
    const matchesCategory =
      filters.category === "all" ||
      exercise.suitableCategories.includes(
        filters.category
      );

    // Fitness focus filter
    const matchesFocus =
      filters.focus === "all" ||
      exercise.focus.includes(filters.focus);

    // Equipment filter
    const matchesEquipment =
      filters.equipment === "all" ||
      (filters.equipment === "none"
        ? exercise.equipment.length === 0
        : exercise.equipment.includes(filters.equipment));

    // Difficulty filter
    const matchesDifficulty =
      filters.difficulty === "all" ||
      exercise.difficulty === filters.difficulty;

    // All active filters must match.
    return (
      matchesSearch &&
      matchesCategory &&
      matchesFocus &&
      matchesEquipment &&
      matchesDifficulty
    );
  });

  // Sort filtered results.
  switch (filters.sort) {
    case "name-asc":
      return filtered.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

    case "name-desc":
      return filtered.sort((a, b) =>
        b.name.localeCompare(a.name)
      );

    default:
      return filtered;
  }
}

// Retrieve unique equipment options.
export function getAvailableEquipment(
  exercises: Exercise[]
): Equipment[] {
  return Array.from(
    new Set(
      exercises.flatMap(
        (exercise) => exercise.equipment
      )
    )
  ).sort();
}

// Retrieve unique fitness focus options.
export function getAvailableFocusAreas(
  exercises: Exercise[]
): FitnessFocus[] {
  return Array.from(
    new Set(
      exercises.flatMap(
        (exercise) => exercise.focus
      )
    )
  ).sort();
}

// Count currently active filters.
export function getActiveFilterCount(
  filters: ExerciseFilters
): number {
  return [
    normalizeSearchText(filters.search) !== "",
    filters.category !== "all",
    filters.focus !== "all",
    filters.equipment !== "all",
    filters.difficulty !== "all",
  ].filter(Boolean).length;
}
