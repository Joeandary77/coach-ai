
"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp } from "lucide-react";

import { LibraryHeader } from "./library-header";
import { ExerciseGrid } from "./exercise-grid";
import { ExerciseFilters } from "./exercise-filters";
import { ActiveFilters } from "./active-filters";
import { ExerciseDetails } from "./exercise-details";

import { exercises } from "@/data/exercises";

import {
  defaultExerciseFilters,
  filterExercises,
  getActiveFilterCount,
} from "@/lib/exercise-filters";

import type {
  ExerciseFilters as FilterValues,
  ExerciseSort,
} from "@/lib/exercise-filters";

import type { Exercise } from "@/types/fitness";

export function ExerciseLibraryView() {
  // Search and filter state
  const [filters, setFilters] =
    useState<FilterValues>({
      ...defaultExerciseFilters,
    });

  // Exercise details state
  const [selectedExercise, setSelectedExercise] =
    useState<Exercise | null>(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  // Filtered exercise results
  const filteredExercises = useMemo(
    () => filterExercises(exercises, filters),
    [filters]
  );

  const activeCount =
    getActiveFilterCount(filters);

  function handleExerciseSelect(
    exercise: Exercise
  ) {
    setSelectedExercise(exercise);
    setDetailsOpen(true);
  }

  function handleDetailsOpenChange(
    open: boolean
  ) {
    setDetailsOpen(open);
  }

  return (
    <div className="mx-auto max-w-400 space-y-6">
      <LibraryHeader />

      <ExerciseFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      <ActiveFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {activeCount > 0
                ? "Search Results"
                : "All Exercises"}
            </h2>

            <p
              aria-live="polite"
              className="mt-1 text-sm text-muted-foreground"
            >
              Showing {filteredExercises.length} of{" "}
              {exercises.length} exercises
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border bg-card px-3">
            <ArrowDownUp className="h-4 w-4 shrink-0 text-muted-foreground" />

            <select
              aria-label="Sort exercises"
              value={filters.sort}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  sort: event.target.value as ExerciseSort,
                }))
              }
              className="h-11 bg-transparent text-sm outline-none"
            >
              <option
                value="default"
                className="bg-card text-foreground"
              >
                Default Order
              </option>

              <option
                value="name-asc"
                className="bg-card text-foreground"
              >
                Name: A–Z
              </option>

              <option
                value="name-desc"
                className="bg-card text-foreground"
              >
                Name: Z–A
              </option>
            </select>
          </div>
        </div>

        <ExerciseGrid
          exercises={filteredExercises}
          onSelect={handleExerciseSelect}
        />

        {filteredExercises.length === 0 && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() =>
                setFilters({
                  ...defaultExerciseFilters,
                })
              }
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>

      {/* Shared exercise details dialog */}
      <ExerciseDetails
        exercise={selectedExercise}
        open={detailsOpen}
        onOpenChange={handleDetailsOpenChange}
      />
    </div>
  );
}
