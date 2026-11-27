"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  Dumbbell,
  Play,
  Trophy,
} from "lucide-react";

import {
  basketballAgeGroups,
  basketballWeeks,
} from "@/data/basketball-program";
import { allBasketballSessions } from "@/data/basketball-sessions-w3-w4";
import { getFitnessSession } from "@/data/fitness-program";
import { mapAgeGroupToCohort } from "@/lib/session-builder";
import type { BasketballAgeGroup } from "@/types/training";

const AGE_FILTERS: (BasketballAgeGroup | "ALL")[] = [
  "ALL",
  "U8",
  "U10",
  "U12 (B)",
  "U12 (A)",
  "U14-16",
];

export default function TrainingCalendarPage() {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedGroup, setSelectedGroup] = useState<
    BasketballAgeGroup | "ALL"
  >("ALL");

  const activeWeekMeta =
    basketballWeeks.find((w) => w.week === selectedWeek) ??
    basketballWeeks[0];

  const weekSessions = useMemo(() => {
    return allBasketballSessions.filter((session) => {
      if (session.week !== selectedWeek) return false;
      if (selectedGroup !== "ALL" && session.ageGroup !== selectedGroup) {
        return false;
      }
      return true;
    });
  }, [selectedWeek, selectedGroup]);

  const groupedByDay = useMemo(() => {
    const days: ("Wednesday" | "Thursday" | "Saturday")[] = [
      "Wednesday",
      "Thursday",
      "Saturday",
    ];
    return days.map((day) => ({
      day,
      sessions: weekSessions.filter((s) => s.day === day),
    }));
  }, [weekSessions]);

  return (
    <div className="mx-auto max-w-400 space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <CalendarIcon className="h-4 w-4" />
            <span>Month 1 Academy Schedule</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
            Training Calendar
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Weekly Wednesday, Thursday, and Saturday schedule across all{" "}
            {basketballAgeGroups.length} academy training groups.
          </p>
        </div>

        <select
          aria-label="Filter calendar by age group"
          value={selectedGroup}
          onChange={(e) =>
            setSelectedGroup(e.target.value as BasketballAgeGroup | "ALL")
          }
          className="h-11 rounded-xl border bg-card px-3.5 text-sm font-medium outline-none focus:border-primary"
        >
          <option value="ALL">All Age Groups (36 Sessions)</option>
          {AGE_FILTERS.filter((g) => g !== "ALL").map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>

      {/* Week Selector Tabs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {basketballWeeks.map((week) => {
          const isSelected = week.week === selectedWeek;
          return (
            <button
              key={week.week}
              type="button"
              onClick={() => setSelectedWeek(week.week)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-xs"
                  : "bg-card hover:border-primary/40"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-primary">
                <span>Week {week.week}</span>
                <span>{week.dateRange}</span>
              </div>
              <p className="mt-1.5 text-sm font-bold">{week.theme}</p>
            </button>
          );
        })}
      </div>

      {/* Active Week Rationale Banner */}
      <div className="rounded-2xl border bg-card p-4 text-sm shadow-xs">
        <span className="font-bold text-primary">
          Week {activeWeekMeta.week} Focus ({activeWeekMeta.dateRange}):{" "}
        </span>
        <span className="text-muted-foreground">
          {activeWeekMeta.rationale}
        </span>
      </div>

      {/* Day Columns */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {groupedByDay.map(({ day, sessions }) => {
          const isSaturday = day === "Saturday";

          return (
            <section
              key={day}
              className="flex flex-col rounded-2xl border bg-card p-5 shadow-xs"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h2 className="text-lg font-bold">{day}</h2>
                  <p className="text-xs text-muted-foreground">
                    {isSaturday
                      ? "60 min Court + 30 min Post-Practice Fitness"
                      : "60 min Basketball Court Session"}
                  </p>
                </div>

                <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary">
                  {sessions.length}{" "}
                  {sessions.length === 1 ? "group" : "groups"}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {sessions.length === 0 ? (
                  <p className="rounded-xl bg-muted/50 p-4 text-center text-xs text-muted-foreground">
                    No sessions scheduled for {selectedGroup} on {day}.
                  </p>
                ) : (
                  sessions.map((session) => {
                    const cohort = mapAgeGroupToCohort(session.ageGroup);
                    const pairedFitness = isSaturday
                      ? getFitnessSession(cohort, session.week)
                      : undefined;

                    return (
                      <div
                        key={session.id}
                        className="rounded-xl border bg-background/60 p-4 transition-colors hover:border-primary/40"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-md bg-orange-500/15 px-2 py-0.5 text-xs font-bold text-orange-700 dark:text-orange-300">
                            {session.ageGroup}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {session.dateLabel}
                          </span>
                        </div>

                        <h3 className="mt-2 text-sm font-bold">
                          {session.title}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {session.goal}
                        </p>

                        {pairedFitness && (
                          <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                            <Dumbbell className="h-3.5 w-3.5 shrink-0" />
                            <span>
                              +30m {cohort} Fitness: {pairedFitness.title}
                            </span>
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-between border-t pt-2.5">
                          <Link
                            href="/basketball-program"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                          >
                            <Trophy className="h-3.5 w-3.5 text-primary" />
                            View Plan
                          </Link>

                          <Link
                            href="/live-session"
                            className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground hover:bg-orange-400"
                          >
                            <Play className="h-3 w-3" />
                            Run Live
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}