"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  CalendarClock,
  ChevronRight,
  Timer,
} from "lucide-react";

import {
  categories,
  programWeeks,
} from "@/data/dashboard";

import type { AgeCategory } from "@/types/fitness";

const categoryColors: Record<AgeCategory, string> = {
  U8: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  U10: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  U12: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  U14: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

export function UpcomingSessions() {
  const nextWeek = programWeeks.find(
    (week) =>
      week.status === "planned" ||
      week.status === "in-progress"
  );

  return (
    <motion.section
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border bg-card p-5 shadow-sm md:p-6"
    >
      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <CalendarClock className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-bold">
            Upcoming Sessions
          </h2>

          <p className="text-sm text-muted-foreground">
            {nextWeek
              ? `${nextWeek.title} · ${nextWeek.day}`
              : "No upcoming training weeks"}
          </p>
        </div>
      </div>

      {/* Upcoming category sessions */}
      {nextWeek ? (
        <div className="mt-5 space-y-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/fitness-program?category=${category.id}&week=${nextWeek.id}`}
              className="group flex items-center gap-3 rounded-xl border p-3 transition-colors hover:border-primary/40 hover:bg-accent/50"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${categoryColors[category.id]}`}
              >
                {category.id}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold">
                  {category.id} Fitness Session
                </h3>

                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <Timer className="h-3.5 w-3.5" />

                  <span>
                    {category.sessionDuration} min
                  </span>

                  <span>·</span>

                  <span>
                    After basketball training
                  </span>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl bg-muted p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No upcoming sessions are currently planned.
          </p>
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Session dates and starting times will be configured
        when the program schedule is finalized.
      </p>
    </motion.section>
  );
}