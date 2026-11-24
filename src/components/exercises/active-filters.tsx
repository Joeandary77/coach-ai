
"use client";

import { X } from "lucide-react";

import {
  defaultExerciseFilters,
} from "@/lib/exercise-filters";

import type {
  ExerciseFilters,
} from "@/lib/exercise-filters";

interface ActiveFiltersProps {
  filters: ExerciseFilters;
  onFiltersChange: (filters: ExerciseFilters) => void;
}

type FilterKey = Exclude<
  keyof ExerciseFilters,
  "sort"
>;

export function ActiveFilters({
  filters,
  onFiltersChange,
}: ActiveFiltersProps) {
  const tags: {
    key: FilterKey;
    label: string;
  }[] = [];

  if (filters.search.trim()) {
    tags.push({
      key: "search",
      label: `Search: ${filters.search.trim()}`,
    });
  }

  if (filters.category !== "all") {
    tags.push({
      key: "category",
      label: filters.category,
    });
  }

  if (filters.focus !== "all") {
    tags.push({
      key: "focus",
      label: filters.focus,
    });
  }

  if (filters.equipment !== "all") {
    tags.push({
      key: "equipment",
      label:
        filters.equipment === "none"
          ? "No Equipment"
          : filters.equipment,
    });
  }

  if (filters.difficulty !== "all") {
    tags.push({
      key: "difficulty",
      label: filters.difficulty,
    });
  }

  function removeFilter(key: FilterKey) {
    onFiltersChange({
      ...filters,
      [key]: defaultExerciseFilters[key],
    });
  }

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">
        Active filters:
      </span>

      {tags.map((tag) => (
        <button
          key={tag.key}
          type="button"
          aria-label={`Remove filter ${tag.label}`}
          onClick={() => removeFilter(tag.key)}
          className="flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
        >
          <span className="truncate">
            {tag.label}
          </span>

          <X className="h-3.5 w-3.5 shrink-0" />
        </button>
      ))}
    </div>
  );
}
