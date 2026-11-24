
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  CalendarDays,
  ArrowRight,
} from "lucide-react";

import {
  programWeeks,
  programStats,
} from "@/data/dashboard";

export function WeeklyOverview() {
  const progress =
    programStats.totalSessions > 0
      ? Math.round(
          (programStats.completedSessions /
            programStats.totalSessions) *
            100
        )
      : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border bg-card p-5 shadow-sm md:p-6"
    >
      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <CalendarDays className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-bold">
            Weekly Overview
          </h2>

          <p className="text-xs text-muted-foreground sm:text-sm">
            Track your four-week fitness program.
          </p>
        </div>
      </div>

      {/* Overall program progress */}
      <div className="mt-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-sm text-muted-foreground">
              Overall completion
            </p>

            <p className="mt-1 text-3xl font-bold">
              {progress}%
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            {programStats.completedSessions} of{" "}
            {programStats.totalSessions} sessions completed
          </p>
        </div>

        <div
          role="progressbar"
          aria-label="Overall program completion"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6 }}
            className="h-full rounded-full bg-primary"
          />
        </div>
      </div>

      {/* Individual weeks */}
      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {programWeeks.map((week) => {
          const weekProgress =
            week.totalSessions > 0
              ? Math.round(
                  (week.completedSessions /
                    week.totalSessions) *
                    100
                )
              : 0;

          return (
            <Link
              key={week.id}
              href={`/fitness-program?week=${week.id}`}
              className="group rounded-xl border bg-background/50 p-3 transition-colors hover:border-primary/50 hover:bg-accent"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold">
                  {week.title}
                </h3>

                <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                {week.day}
              </p>

              <div
                role="progressbar"
                aria-label={`${week.title} progress`}
                aria-valuenow={weekProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"
              >
                <div
                  style={{ width: `${weekProgress}%` }}
                  className="h-full rounded-full bg-primary"
                />
              </div>

              <div className="mt-2 flex flex-wrap justify-between gap-1 text-[10px] text-muted-foreground">
                <span>
                  {week.completedSessions}/
                  {week.totalSessions} sessions
                </span>

                <span className="capitalize">
                  {week.status.replace("-", " ")}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <Link
        href="/fitness-program"
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:underline dark:text-orange-400"
      >
        View full program
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.section>
  );
}
