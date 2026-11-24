
"use client";

import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  X,
} from "lucide-react";

import { exercises } from "@/data/exercises";
import { ageCategories } from "@/data/fitness-program";

import {
  defaultExerciseFilters,
  getAvailableEquipment,
  getAvailableFocusAreas,
  getActiveFilterCount,
} from "@/lib/exercise-filters";

import type {
  ExerciseFilters as FilterValues,
} from "@/lib/exercise-filters";

interface ExerciseFiltersProps {
  filters: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
}

const equipmentOptions =
  getAvailableEquipment(exercises);

const focusOptions =
  getAvailableFocusAreas(exercises);

const selectClassName =
  "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

export function ExerciseFilters({
  filters,
  onFiltersChange,
}: ExerciseFiltersProps) {
  const activeCount = getActiveFilterCount(filters);

  function updateFilter<K extends keyof FilterValues>(
    key: K,
    value: FilterValues[K]
  ) {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  }

  function resetFilters() {
    onFiltersChange({
      ...defaultExerciseFilters,
    });
  }

  return (
    <section className="space-y-5 rounded-2xl border bg-card p-4 shadow-sm md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <SlidersHorizontal className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-bold">
              Search & Filters
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Find exercises that match your needs.
            </p>
          </div>

          {activeCount > 0 && (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              {activeCount} active
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors hover:bg-muted"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Filters
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

        <input
          type="search"
          aria-label="Search exercises"
          placeholder="Search by exercise name, focus or equipment..."
          value={filters.search}
          onChange={(event) =>
            updateFilter("search", event.target.value)
          }
          className="h-12 w-full rounded-xl border border-input bg-background pl-11 pr-11 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 [&::-webkit-search-cancel-button]:hidden"
        />

        {filters.search && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => updateFilter("search", "")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter controls */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2">
          <label
            htmlFor="exercise-category"
            className="text-xs font-semibold"
          >
            Age Category
          </label>

          <select
            id="exercise-category"
            value={filters.category}
            onChange={(event) =>
              updateFilter(
                "category",
                event.target.value as FilterValues["category"]
              )
            }
            className={selectClassName}
          >
            <option value="all">All Categories</option>

            {ageCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="exercise-focus"
            className="text-xs font-semibold"
          >
            Fitness Focus
          </label>

          <select
            id="exercise-focus"
            value={filters.focus}
            onChange={(event) =>
              updateFilter(
                "focus",
                event.target.value as FilterValues["focus"]
              )
            }
            className={selectClassName}
          >
            <option value="all">All Fitness Areas</option>

            {focusOptions.map((focus) => (
              <option key={focus} value={focus}>
                {focus}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="exercise-equipment"
            className="text-xs font-semibold"
          >
            Equipment
          </label>

          <select
            id="exercise-equipment"
            value={filters.equipment}
            onChange={(event) =>
              updateFilter(
                "equipment",
                event.target.value as FilterValues["equipment"]
              )
            }
            className={selectClassName}
          >
            <option value="all">All Equipment</option>
            <option value="none">No Equipment</option>

            {equipmentOptions.map((equipment) => (
              <option key={equipment} value={equipment}>
                {equipment}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="exercise-difficulty"
            className="text-xs font-semibold"
          >
            Difficulty
          </label>

          <select
            id="exercise-difficulty"
            value={filters.difficulty}
            onChange={(event) =>
              updateFilter(
                "difficulty",
                event.target.value as FilterValues["difficulty"]
              )
            }
            className={selectClassName}
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">
              Intermediate
            </option>
          </select>
        </div>
      </div>
    </section>
  );
}
