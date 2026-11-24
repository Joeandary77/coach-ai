
"use client";

import {
  CalendarDays,
  CheckCircle2,
  Footprints,
  Zap,
  Dumbbell,
  Trophy,
} from "lucide-react";

import { motion } from "motion/react";

import { weekThemes } from "@/data/fitness-program";
import { cn } from "@/lib/utils";

interface WeekSelectorProps {
  selectedWeek: number;
  onWeekChange: (week: number) => void;
}

const weekIcons = [
  Footprints,
  Zap,
  Dumbbell,
  Trophy,
];

export function WeekSelector({
  selectedWeek,
  onWeekChange,
}: WeekSelectorProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold tracking-tight">
          Training Week
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Explore the focus of each training week.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {weekThemes.map((theme, index) => {
          const week = index + 1;
          const selected = selectedWeek === week;
          const Icon = weekIcons[index] ?? CalendarDays;

          return (
            <motion.button
              key={week}
              type="button"
              aria-pressed={selected}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onWeekChange(week)}
              className={cn(
                "flex flex-col rounded-2xl border-2 bg-card p-4 text-left shadow-sm transition-colors",
                selected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              )}
            >
              <div className="flex w-full items-center justify-between">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    selected
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {selected && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </div>

              <p
                className={cn(
                  "mt-3 text-xs font-semibold uppercase tracking-wider",
                  selected
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                Week {week}
              </p>

              <h3 className="mt-2 flex-1 text-sm font-semibold leading-relaxed">
                {theme}
              </h3>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                Saturday
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
