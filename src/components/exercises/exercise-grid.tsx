
import { SearchX } from "lucide-react";

import type { Exercise } from "@/types/fitness";
import { LibraryExerciseCard } from "./library-exercise-card";

interface ExerciseGridProps {
  exercises: Exercise[];
  onSelect: (exercise: Exercise) => void;
}

export function ExerciseGrid({
  exercises,
  onSelect,
}: ExerciseGridProps) {
  if (exercises.length === 0) {
    return (
      <section className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <SearchX className="h-8 w-8" />
        </div>

        <h2 className="text-lg font-bold">
          No Exercises Found
        </h2>

        <p className="max-w-sm text-sm text-muted-foreground">
          Try changing your search or selecting
          different filters.
        </p>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {exercises.map((exercise, index) => (
        <LibraryExerciseCard
          key={exercise.id}
          exercise={exercise}
          index={index}
          onSelect={onSelect}
        />
      ))}
    </section>
  );
}
