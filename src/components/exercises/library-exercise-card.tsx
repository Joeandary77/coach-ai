
"use client";

import {
  Package,
  ArrowRight,
} from "lucide-react";

import { motion } from "motion/react";

import type { Exercise } from "@/types/fitness";

import { focusStyles } from "@/data/exercise-styles";
import { cn } from "@/lib/utils";

interface LibraryExerciseCardProps {
  exercise: Exercise;
  index: number;
  onSelect: (exercise: Exercise) => void;
}

export function LibraryExerciseCard({
  exercise,
  index,
  onSelect,
}: LibraryExerciseCardProps) {
  const primaryFocus =
    exercise.focus[0] ?? "Recovery";

  const styles = focusStyles[primaryFocus];
  const Icon = styles.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: Math.min(index * 0.025, 0.25),
      }}
      className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Exercise visual */}
      <button
        type="button"
        onClick={() => onSelect(exercise)}
        aria-label={`View ${exercise.name}`}
        className={cn(
          "relative flex h-32 w-full items-center justify-center overflow-hidden transition-opacity hover:opacity-80",
          styles.background
        )}
      >
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-16 border-current opacity-5"
        />

        <Icon
          className={cn(
            "h-14 w-14",
            styles.color
          )}
        />

        <span className="absolute right-3 top-3 rounded-full border bg-card px-2.5 py-1 text-xs font-medium">
          {exercise.difficulty}
        </span>
      </button>

      {/* Exercise information */}
      <div className="flex flex-1 flex-col space-y-4 p-4">
        <div>
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              styles.color
            )}
          >
            {primaryFocus}
          </p>

          <h3 className="mt-2 text-base font-bold">
            {exercise.name}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {exercise.description}
          </p>
        </div>

        {/* Fitness focus tags */}
        <div className="flex flex-wrap gap-1.5">
          {exercise.focus.map((focus) => (
            <span
              key={focus}
              className="rounded-md bg-muted px-2 py-1 text-xs font-medium"
            >
              {focus}
            </span>
          ))}
        </div>

        {/* Age categories */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Suitable Categories
          </p>

          <div className="flex flex-wrap gap-1.5">
            {exercise.suitableCategories.map(
              (category) => (
                <span
                  key={category}
                  className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary"
                >
                  {category}
                </span>
              )
            )}
          </div>
        </div>

        {/* Equipment */}
        <div className="mt-auto flex items-start gap-2 border-t pt-4">
          <Package className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

          <p className="text-xs leading-relaxed text-muted-foreground">
            {exercise.equipment.length > 0
              ? exercise.equipment.join(", ")
              : "No equipment required"}
          </p>
        </div>

        {/* View details */}
        <button
          type="button"
          onClick={() => onSelect(exercise)}
          aria-label={`View details for ${exercise.name}`}
          className="group flex w-full items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          View Exercise

          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.article>
  );
}
