"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Dumbbell,
  Layers,
  MessageSquareQuote,
  Package,
  Play,
  RefreshCw,
  Trophy,
  Wand2,
} from "lucide-react";

import {
  generateCustomSession,
  type SessionMode,
} from "@/lib/session-builder";
import type {
  BasketballAgeGroup,
  BasketballFocus,
} from "@/types/training";

const AGE_GROUPS: BasketballAgeGroup[] = [
  "U8",
  "U10",
  "U12 (B)",
  "U12 (A)",
  "U14-16",
];

const BASKETBALL_FOCUSES: (BasketballFocus | "ALL")[] = [
  "ALL",
  "Ball Handling",
  "Footwork",
  "Passing",
  "Catching",
  "Finishing",
  "Shooting",
  "Defense",
  "Team Concepts",
];

export default function SessionGeneratorPage() {
  const router = useRouter();

  const [mode, setMode] = useState<SessionMode>("combined");
  const [ageGroup, setAgeGroup] = useState<BasketballAgeGroup>("U12 (A)");
  const [week, setWeek] = useState<number>(1);
  const [basketballFocus, setBasketballFocus] = useState<
    BasketballFocus | "ALL"
  >("ALL");
  const [seedOffset, setSeedOffset] = useState<number>(0);

  const generatedSession = useMemo(
    () =>
      generateCustomSession({
        mode,
        ageGroup,
        week,
        basketballFocus,
        seedOffset,
      }),
    [mode, ageGroup, week, basketballFocus, seedOffset]
  );

  function handleLaunchLive() {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "coachai_active_generated_session",
        JSON.stringify(generatedSession)
      );
    }
    router.push("/live-session?source=generated");
  }

  return (
    <div className="mx-auto max-w-400 space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <Wand2 className="h-4 w-4" />
            <span>Smart Practice Planner</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
            Session Generator
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build structured 60-minute basketball practices, 30-minute fitness
            blocks, or full 90-minute Saturday academy sessions.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setSeedOffset((prev) => prev + 1)}
            className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary/40 hover:bg-accent"
          >
            <RefreshCw className="h-4 w-4" />
            Shuffle Activities
          </button>

          <button
            type="button"
            onClick={handleLaunchLive}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-orange-400"
          >
            <Play className="h-4 w-4" />
            Launch in Live Session
          </button>
        </div>
      </div>

      {/* Configuration Controls */}
      <section className="grid grid-cols-1 gap-4 rounded-2xl border bg-card p-5 shadow-xs md:grid-cols-2 xl:grid-cols-4">
        {/* Session Format */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Session Format
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => setMode("basketball")}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                mode === "basketball"
                  ? "border-primary bg-primary/10 text-primary"
                  : "bg-background hover:bg-accent"
              }`}
            >
              <Trophy className="h-4 w-4 shrink-0" />
              <span>Basketball Only (60 min)</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("fitness")}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                mode === "fitness"
                  ? "border-primary bg-primary/10 text-primary"
                  : "bg-background hover:bg-accent"
              }`}
            >
              <Dumbbell className="h-4 w-4 shrink-0" />
              <span>Fitness Only (30 min)</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("combined")}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                mode === "combined"
                  ? "border-primary bg-primary/10 text-primary"
                  : "bg-background hover:bg-accent"
              }`}
            >
              <Layers className="h-4 w-4 shrink-0" />
              <span>Saturday Combined (90 min)</span>
            </button>
          </div>
        </div>

        {/* Age Group */}
        <div className="space-y-2">
          <label
            htmlFor="gen-age-group"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
          >
            Academy Age Group
          </label>
          <select
            id="gen-age-group"
            value={ageGroup}
            onChange={(e) =>
              setAgeGroup(e.target.value as BasketballAgeGroup)
            }
            className="h-11 w-full rounded-xl border bg-background px-3 text-sm font-medium outline-none focus:border-primary"
          >
            {AGE_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Automatically matches age-appropriate drills and youth fitness
            load.
          </p>
        </div>

        {/* Curriculum Week */}
        <div className="space-y-2">
          <label
            htmlFor="gen-week"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
          >
            Month 1 Curriculum Week
          </label>
          <select
            id="gen-week"
            value={week}
            onChange={(e) => setWeek(Number(e.target.value))}
            className="h-11 w-full rounded-xl border bg-background px-3 text-sm font-medium outline-none focus:border-primary"
          >
            <option value={1}>Week 1 — Ball Handling &amp; Footwork</option>
            <option value={2}>Week 2 — Passing, Catching &amp; Spacing</option>
            <option value={3}>Week 3 — Finishing &amp; Shooting</option>
            <option value={4}>Week 4 — Defense &amp; Team Play</option>
          </select>
        </div>

        {/* Basketball Focus */}
        <div className="space-y-2">
          <label
            htmlFor="gen-focus"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
          >
            Primary Court Focus
          </label>
          <select
            id="gen-focus"
            disabled={mode === "fitness"}
            value={basketballFocus}
            onChange={(e) =>
              setBasketballFocus(e.target.value as BasketballFocus | "ALL")
            }
            className="h-11 w-full rounded-xl border bg-background px-3 text-sm font-medium outline-none focus:border-primary disabled:opacity-50"
          >
            {BASKETBALL_FOCUSES.map((focus) => (
              <option key={focus} value={focus}>
                {focus === "ALL" ? "Balanced Full-Court Mix" : focus}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            {mode === "fitness"
              ? "Fitness sessions strictly exclude basketballs and skipping ropes."
              : "Prioritizes matching drills in Skill 1 and Skill 2 blocks."}
          </p>
        </div>
      </section>

      {/* Generated Session Preview */}
      <section className="rounded-2xl border bg-card p-5 shadow-xs sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary">
                {generatedSession.ageGroupLabel}
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {generatedSession.totalDurationMinutes} min total
              </span>
              <span className="text-xs text-muted-foreground">
                {generatedSession.blocks.length} timed blocks
              </span>
            </div>

            <h2 className="mt-2 text-xl font-bold">
              {generatedSession.title}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {generatedSession.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Package className="h-4 w-4 text-primary" />
              Equipment:
            </span>
            {generatedSession.equipment.length > 0 ? (
              generatedSession.equipment.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium"
                >
                  {item}
                </span>
              ))
            ) : (
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                Bodyweight / No Equipment
              </span>
            )}
          </div>
        </div>

        {/* Timeline Blocks */}
        <div className="mt-5 space-y-3">
          {generatedSession.blocks.map((block, index) => {
            const isBasketball = block.domain === "basketball";

            return (
              <div
                key={block.id}
                className="rounded-2xl border bg-background/60 p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                      {index + 1}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold ${
                        isBasketball
                          ? "bg-orange-500/15 text-orange-700 dark:text-orange-300"
                          : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      {isBasketball ? (
                        <Trophy className="h-3 w-3" />
                      ) : (
                        <Dumbbell className="h-3 w-3" />
                      )}
                      {block.partLabel}
                    </span>

                    <h3 className="text-sm font-bold sm:text-base">
                      {block.title}
                    </h3>
                  </div>

                  <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold">
                    Min {block.startMinute}&ndash;{block.endMinute} (
                    {block.durationMinutes} min)
                  </span>
                </div>

                <ul className="mt-2.5 space-y-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {block.instructions.map((step, i) => (
                    <li key={i}>&bull; {step}</li>
                  ))}
                </ul>

                {block.coachingCues.length > 0 && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl bg-primary/10 px-3 py-2 text-xs">
                    <MessageSquareQuote className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>
                      <strong className="text-primary">Coach Cue: </strong>
                      {block.coachingCues[0]}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}