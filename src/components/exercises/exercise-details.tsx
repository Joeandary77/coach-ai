
"use client";

import {
  Package,
  Users,
  Target,
  Layers,
  BookOpen,
  ShieldCheck,
  Info,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { focusStyles } from "@/data/exercise-styles";
import { cn } from "@/lib/utils";

import type { Exercise } from "@/types/fitness";

interface ExerciseDetailsProps {
  exercise: Exercise | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExerciseDetails({
  exercise,
  open,
  onOpenChange,
}: ExerciseDetailsProps) {
  if (!exercise) {
    return null;
  }

  const primaryFocus =
    exercise.focus[0] ?? "Recovery";

  const styles = focusStyles[primaryFocus];
  const Icon = styles.icon;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl gap-0 overflow-y-auto rounded-2xl p-0 sm:max-w-2xl">
        <DialogHeader className="p-5 pr-12">
          <DialogTitle>
            Exercise Details
          </DialogTitle>

          <DialogDescription>
            Explore exercise information and
            coaching guidelines.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 px-5 pb-5 md:px-6 md:pb-6">
          {/* Exercise banner */}
          <div className="relative overflow-hidden rounded-2xl bg-[#14213D] p-6 text-center text-white">
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-12 h-48 w-48 rounded-full border-24 border-white/5"
            />

            <div className="relative z-10 space-y-4">
              <div
                className={cn(
                  "mx-auto flex h-20 w-20 items-center justify-center rounded-2xl",
                  styles.background
                )}
              >
                <Icon
                  className={cn(
                    "h-10 w-10",
                    styles.color
                  )}
                />
              </div>

              <div>
                <h2 className="text-xl font-bold md:text-2xl">
                  {exercise.name}
                </h2>

                <p className="mt-2 text-sm text-slate-300">
                  {exercise.focus.join(" · ")}
                </p>
              </div>
            </div>
          </div>

          {/* Exercise statistics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border bg-muted/30 p-4">
              <Layers className="mb-2 h-5 w-5 text-primary" />

              <p className="text-xs text-muted-foreground">
                Difficulty
              </p>

              <p className="mt-1 text-sm font-semibold">
                {exercise.difficulty}
              </p>
            </div>

            <div className="rounded-xl border bg-muted/30 p-4">
              <Package className="mb-2 h-5 w-5 text-primary" />

              <p className="text-xs text-muted-foreground">
                Equipment
              </p>

              <p className="mt-1 text-sm font-semibold">
                {exercise.equipment.length > 0
                  ? exercise.equipment.join(", ")
                  : "None required"}
              </p>
            </div>
          </div>

          {/* Description */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />

              <h3 className="font-bold">
                Description
              </h3>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {exercise.description}
            </p>
          </section>

          {/* Age categories */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />

              <h3 className="font-bold">
                Suitable Age Categories
              </h3>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {exercise.suitableCategories.map(
                (category) => (
                  <div
                    key={category}
                    className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-center text-sm font-semibold text-primary"
                  >
                    {category}
                  </div>
                )
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              Category compatibility is a planning
              guideline. Individual readiness and
              coach supervision remain important.
            </p>
          </section>

          {/* Fitness focus */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />

              <h3 className="font-bold">
                Fitness Focus
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {exercise.focus.map((focus) => {
                const focusStyle =
                  focusStyles[focus];

                const FocusIcon =
                  focusStyle.icon;

                return (
                  <span
                    key={focus}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold",
                      focusStyle.background,
                      focusStyle.color
                    )}
                  >
                    <FocusIcon className="h-4 w-4" />

                    {focus}
                  </span>
                );
              })}
            </div>
          </section>

          {/* Instructions */}
          <section className="space-y-3 border-t pt-5">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />

              <h3 className="font-bold">
                Exercise Instructions
              </h3>
            </div>

            <ol className="space-y-3">
              {exercise.instructions.map(
                (instruction, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 rounded-xl border bg-muted/20 p-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </span>

                    <p className="pt-1 text-sm leading-relaxed">
                      {instruction}
                    </p>
                  </li>
                )
              )}
            </ol>
          </section>

          {/* Coaching guidelines */}
          <section className="space-y-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />

              <h3 className="font-bold">
                Coaching Guidelines
              </h3>
            </div>

            {exercise.coachingNotes.map(
              (note, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2"
                >
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {note}
                  </p>
                </div>
              )
            )}
          </section>

          {/* General recovery reminder */}
          <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <p className="text-xs leading-relaxed text-muted-foreground">
              Fitness activities follow basketball
              practice. Allow water and recovery,
              adapt activities to player readiness,
              and stop if a player experiences pain,
              dizziness or unusual breathlessness.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-11 w-full rounded-xl"
          >
            Close Exercise
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
