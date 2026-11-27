"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpenCheck,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Trophy,
  Droplets,
  Info,
  MessageSquareQuote,
  Package,
  Play,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";

import {
  basketballAgeGroups,
  basketballProgramConfig,
  basketballWeeks,
  coachRules,
  endOfMonthChecklists,
  month1PlanningNotes,
} from "@/data/basketball-program";
import { allBasketballSessions } from "@/data/basketball-sessions-w3-w4";
import type {
  BasketballAgeGroup,
  BasketballSession,
} from "@/types/training";

type GroupFilter = BasketballAgeGroup | "ALL";
type ActiveTab = "sessions" | "checklists";

export function BasketballProgramView() {
  const [selectedGroup, setSelectedGroup] = useState<GroupFilter>("ALL");
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<ActiveTab>("sessions");
  const [showCoachRules, setShowCoachRules] = useState<boolean>(false);
  const [expandedSessionId, setExpandedSessionId] = useState<string>(
    allBasketballSessions[0]?.id ?? ""
  );
  const [selectedChecklistId, setSelectedChecklistId] = useState<
    "U8" | "U10" | "U12" | "U14-16"
  >("U12");

  const currentWeekOverview = useMemo(
    () =>
      basketballWeeks.find((w) => w.week === selectedWeek) ??
      basketballWeeks[0],
    [selectedWeek]
  );

  const filteredSessions = useMemo(() => {
    return allBasketballSessions.filter((session) => {
      const matchesWeek = session.week === selectedWeek;
      const matchesGroup =
        selectedGroup === "ALL" || session.ageGroup === selectedGroup;
      return matchesWeek && matchesGroup;
    });
  }, [selectedWeek, selectedGroup]);

  const activeChecklist = useMemo(
    () =>
      endOfMonthChecklists.find((c) => c.id === selectedChecklistId) ??
      endOfMonthChecklists[0],
    [selectedChecklistId]
  );

  const toggleSession = (sessionId: string) => {
    setExpandedSessionId((prev) => (prev === sessionId ? "" : sessionId));
  };

  return (
    <div className="mx-auto max-w-400 space-y-6">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-2xl border bg-[#14213D] p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-300">
              <Trophy className="h-3.5 w-3.5" />
              <span>Month 1 Curriculum &bull; November 2026</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {basketballProgramConfig.title}
            </h1>

            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              &ldquo;{basketballProgramConfig.motto}&rdquo; &mdash; 4 weeks, 36
              structured 60-minute court sessions across 5 academy training
              groups.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:w-auto">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-center">
              <p className="text-xl font-bold text-orange-400 sm:text-2xl">
                {basketballProgramConfig.totalSessions}
              </p>
              <p className="mt-0.5 text-xs text-slate-300">Sessions</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-center">
              <p className="text-xl font-bold text-orange-400 sm:text-2xl">
                {basketballProgramConfig.sessionDuration}m
              </p>
              <p className="mt-0.5 text-xs text-slate-300">Per Practice</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-center">
              <p className="text-xl font-bold text-orange-400 sm:text-2xl">
                {basketballProgramConfig.totalWeeks}
              </p>
              <p className="mt-0.5 text-xs text-slate-300">Weeks</p>
            </div>
          </div>
        </div>

        {/* Collapsible 4 Coach Rules Bar */}
        <div className="mt-6 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={() => setShowCoachRules((prev) => !prev)}
            className="flex w-full items-center justify-between text-left text-sm font-semibold text-orange-300 hover:text-orange-200"
          >
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Our 4 Rules for Every Coach &amp; Session Structure
            </span>
            {showCoachRules ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {showCoachRules && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {coachRules.map((rule) => (
                <div
                  key={rule.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-3.5"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-400">
                    Rule {rule.id}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {rule.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">
                    {rule.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Top Mode Switcher: Weekly Sessions vs. End-of-Month Checklists */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border bg-card p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("sessions")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === "sessions"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Weekly Sessions (36)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("checklists")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === "checklists"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpenCheck className="h-4 w-4" />
            <span>Month 1 Skill Checklists</span>
          </button>
        </div>

        <Link
          href="/exercise-library"
          className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 text-sm font-semibold shadow-xs transition hover:border-primary/40 hover:text-primary"
        >
          <span>Browse All Basketball Drills</span>
        </Link>
      </div>

      {activeTab === "sessions" ? (
        <>
          {/* Week Selector */}
          <section className="space-y-3">
            <h2 className="text-base font-bold tracking-tight sm:text-lg">
              Select Training Week
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {basketballWeeks.map((weekItem) => {
                const isSelected = weekItem.week === selectedWeek;
                return (
                  <button
                    key={weekItem.week}
                    type="button"
                    onClick={() => setSelectedWeek(weekItem.week)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : "bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-primary">
                        Week {weekItem.week}
                      </span>
                      <span className="text-muted-foreground">
                        {weekItem.dateRange}
                      </span>
                    </div>
                    <p className="mt-1.5 font-bold text-foreground">
                      {weekItem.theme}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {weekItem.rationale}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Age Group Filter Pills */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold tracking-tight sm:text-lg">
                Filter by Age Group
              </h2>
              <span className="text-xs text-muted-foreground">
                Showing {filteredSessions.length} session
                {filteredSessions.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedGroup("ALL")}
                className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                  selectedGroup === "ALL"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:border-primary/40"
                }`}
              >
                All Groups (9 / wk)
              </button>

              {basketballAgeGroups.map((group) => {
                const isActive = selectedGroup === group.id;
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setSelectedGroup(group.id)}
                    className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "bg-card text-foreground hover:border-primary/40"
                    }`}
                  >
                    {group.id}
                  </button>
                );
              })}
            </div>

            {/* Selected Group Focus Callout */}
            {selectedGroup !== "ALL" && (
              <div className="flex items-start gap-3 rounded-xl border bg-muted/40 p-3.5 text-xs sm:text-sm">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <span className="font-semibold text-foreground">
                    {selectedGroup} Focus:{" "}
                  </span>
                  <span className="text-muted-foreground">
                    {
                      basketballAgeGroups.find((g) => g.id === selectedGroup)
                        ?.focusSummary
                    }
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* Week Theme Summary Banner */}
          <div className="rounded-2xl border bg-card p-4 shadow-xs sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Week {currentWeekOverview.week} Theme &bull;{" "}
                  {currentWeekOverview.dateRange}
                </span>
                <h3 className="mt-0.5 text-lg font-bold">
                  {currentWeekOverview.theme}
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Droplets className="h-3.5 w-3.5" />
                30s water breaks between parts
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {currentWeekOverview.rationale}
            </p>
          </div>

          {/* Sessions List */}
          <section className="space-y-4">
            {filteredSessions.map((session: BasketballSession) => {
              const isExpanded = expandedSessionId === session.id;

              return (
                <article
                  key={session.id}
                  className="overflow-hidden rounded-2xl border bg-card shadow-xs transition"
                >
                  {/* Session Header Row */}
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-lg bg-[#14213D] px-2.5 py-1 text-xs font-bold text-white dark:bg-orange-500/20 dark:text-orange-300">
                            {session.ageGroup}
                          </span>
                          <span className="rounded-lg border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            {session.dateLabel}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            {session.duration} min
                          </span>
                        </div>

                        <h3 className="text-lg font-bold tracking-tight sm:text-xl">
                          {session.title}
                        </h3>

                        <p className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>
                            <strong className="font-semibold text-foreground">
                              Goal:
                            </strong>{" "}
                            {session.goal}
                          </span>
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <Link
                          href={`/live-session?domain=basketball&sessionId=${session.id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-orange-500 sm:text-sm"
                        >
                          <Play className="h-3.5 w-3.5" />
                          <span>Start Live</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => toggleSession(session.id)}
                          className="inline-flex items-center gap-1 rounded-xl border px-3 py-2.5 text-xs font-semibold hover:bg-muted sm:text-sm"
                        >
                          <span>{isExpanded ? "Hide Plan" : "View Plan"}</span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Focus & Equipment Tags */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-3">
                      {session.focus.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}

                      <span className="mx-1 text-muted-foreground">&bull;</span>

                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Package className="h-3.5 w-3.5" />
                        {session.equipment.join(", ")}
                      </span>
                    </div>
                  </div>

                  {/* Expanded 60-Minute Timeline */}
                  {isExpanded && (
                    <div className="space-y-4 border-t bg-muted/20 p-4 sm:p-5">
                      <div className="space-y-3">
                        {session.blocks.map((block) => (
                          <div
                            key={block.id}
                            className="rounded-xl border bg-card p-4 shadow-2xs"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="rounded-md bg-primary/15 px-2.5 py-0.5 font-mono text-xs font-bold text-primary">
                                  {block.startMinute}-{block.endMinute} min
                                </span>
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                  {block.part}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {block.durationMinutes} min
                              </span>
                            </div>

                            <h4 className="mt-2 text-base font-bold">
                              {block.activityTitle}
                            </h4>

                            <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
                              {block.howToDoIt}
                            </p>

                            <div className="mt-3 flex items-start gap-2 rounded-lg bg-orange-500/10 p-2.5 text-xs text-foreground">
                              <MessageSquareQuote className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              <div>
                                <span className="font-bold text-primary">
                                  Coach says / key point:{" "}
                                </span>
                                <span>{block.coachSays}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Success Looks Like Footer */}
                      <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <span className="font-bold text-emerald-800 dark:text-emerald-300">
                            Success Looks Like:{" "}
                          </span>
                          <span className="text-foreground">
                            {session.successLooksLike}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        </>
      ) : (
        /* End-of-Month 1 Player Checklists Tab */
        <section className="space-y-5">
          <div className="rounded-2xl border bg-card p-5 shadow-xs">
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h2 className="text-lg font-bold">
                  End of Month 1: Skill Checklists (Week 4 Evaluation)
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Used during the Week 4 skills check (Saturday Nov 28) to
                  evaluate group readiness (Yes / Almost / Not yet) before
                  building Month 2.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {endOfMonthChecklists.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setSelectedChecklistId(group.id)}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    selectedChecklistId === group.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-background hover:border-primary/40"
                  }`}
                >
                  {group.id} Checklist ({group.skills.length} skills)
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-xs">
            <h3 className="text-base font-bold sm:text-lg">
              {activeChecklist.title}
            </h3>

            <div className="mt-4 divide-y">
              {activeChecklist.skills.map((skill, index) => (
                <div
                  key={skill}
                  className="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium">{skill}</span>
                  </div>

                  <div className="flex items-center gap-2 pl-9 sm:pl-0">
                    <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                      Yes
                    </span>
                    <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                      Almost
                    </span>
                    <span className="rounded-md border border-slate-500/30 bg-slate-500/10 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                      Not yet
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-muted/40 p-5">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Notes for Month 2 Planning
            </h4>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              {month1PlanningNotes.map((note) => (
                <li key={note}>&bull; {note}</li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}