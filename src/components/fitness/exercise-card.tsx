
"use client";

import { useState } from "react";
import {
  ChevronDown,
  Dumbbell,
  Package,
  Info,
} from "lucide-react";

import { getExerciseById } from "@/data/exercises";
import type { SessionExercise } from "@/types/fitness";
import { cn } from "@/lib/utils";

interface ExerciseCardProps {
  item: SessionExercise;
}

export function ExerciseCard({
  item,
}: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false);

  const exercise = getExerciseById(item.exerciseId);

  if (!exercise) {
    return (
      <div className="rounded-xl border border-red-500/20 p-3 text-sm text-red-500">
        Exercise not found: {item.exerciseId}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-muted/50"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Dumbbell className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold">
            {exercise.name}
          </h4>

          <p className="mt-1 text-xs text-muted-foreground">
            {exercise.focus.join(" · ")}
          </p>
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-180"
          )}
        />
      </button>

      {expanded && (
        <div className="space-y-4 border-t p-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {exercise.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-medium">
              {exercise.difficulty}
            </span>

            {exercise.suitableCategories.map(
              (category) => (
                <span
                  key={category}
                  className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {category}
                </span>
              )
            )}
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-semibold uppercase tracking-wider">
              Instructions
            </h5>

            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              {exercise.instructions.map(
                (instruction, index) => (
                  <li key={index}>{instruction}</li>
                )
              )}
            </ol>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />

              <h5 className="text-sm font-semibold">
                Equipment
              </h5>
            </div>

            <p className="text-sm text-muted-foreground">
              {exercise.equipment.length > 0
                ? exercise.equipment.join(", ")
                : "No equipment required"}
            </p>
          </div>

          <div className="space-y-2 rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />

              <h5 className="text-sm font-semibold">
                Coaching Notes
              </h5>
            </div>

            {exercise.coachingNotes.map(
              (note, index) => (
                <p
                  key={index}
                  className="text-xs leading-relaxed text-muted-foreground"
                >
                  • {note}
                </p>
              )
            )}

            {item.notes && (
              <p className="text-xs font-medium">
                {item.notes}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
