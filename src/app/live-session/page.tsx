"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Dumbbell,
  MessageSquareQuote,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Timer,
  Trophy,
  Wand2,
} from "lucide-react";

import { allBasketballSessions } from "@/data/basketball-sessions-w3-w4";
import { fitnessSessions } from "@/data/fitness-program";
import {
  basketballSessionToPlayable,
  buildCombinedSaturdaySession,
  fitnessSessionToPlayable,
  type PlayableSession,
} from "@/lib/session-builder";

function formatClock(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function LiveSessionPage() {
  const presetSessions = useMemo<PlayableSession[]>(() => {
    const combinedU12 = buildCombinedSaturdaySession(
      "bball-w1-sat-u12-a",
      "u12-week-1"
    );
    const combinedU10 = buildCombinedSaturdaySession(
      "bball-w1-sat-u10",
      "u10-week-1"
    );

    const bballPresets = allBasketballSessions
      .slice(0, 12)
      .map(basketballSessionToPlayable);

    const fitnessPresets = fitnessSessions
      .slice(0, 8)
      .map((s) => fitnessSessionToPlayable(s.id))
      .filter((s): s is PlayableSession => Boolean(s));

    return [
      ...(combinedU12 ? [combinedU12] : []),
      ...(combinedU10 ? [combinedU10] : []),
      ...bballPresets,
      ...fitnessPresets,
    ];
  }, []);

  const [generatedSession, setGeneratedSession] =
    useState<PlayableSession | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");

  // Load generated session from sessionStorage if launched from Session Generator
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem("coachai_active_generated_session");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as PlayableSession;
        if (parsed && Array.isArray(parsed.blocks) && parsed.blocks.length > 0) {
          setGeneratedSession(parsed);
          if (window.location.search.includes("source=generated")) {
            setSelectedId(parsed.id);
            return;
          }
        }
      } catch {
        // Ignore malformed storage entry
      }
    }
    if (presetSessions.length > 0) {
      setSelectedId(presetSessions[0].id);
    }
  }, [presetSessions]);

  const availableSessions = useMemo(() => {
    if (!generatedSession) return presetSessions;
    return [generatedSession, ...presetSessions];
  }, [generatedSession, presetSessions]);

  const activeSession = useMemo(() => {
    return (
      availableSessions.find((s) => s.id === selectedId) ??
      availableSessions[0] ??
      null
    );
  }, [availableSessions, selectedId]);

  // Timer state
  const [blockIndex, setBlockIndex] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSession, setCompletedSession] = useState<boolean>(false);

  // Reset timer when active session changes
  useEffect(() => {
    if (!activeSession || activeSession.blocks.length === 0) return;
    setBlockIndex(0);
    setSecondsLeft(activeSession.blocks[0].durationMinutes * 60);
    setIsRunning(false);
    setCompletedSession(false);
  }, [activeSession]);

  // Countdown tick
  useEffect(() => {
    if (!isRunning || !activeSession) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Advance to next block automatically
        if (blockIndex < activeSession.blocks.length - 1) {
          const nextIdx = blockIndex + 1;
          setBlockIndex(nextIdx);
          return activeSession.blocks[nextIdx].durationMinutes * 60;
        }

        setIsRunning(false);
        setCompletedSession(true);
        return 0;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, activeSession, blockIndex]);

  if (!activeSession) {
    return null;
  }

  const currentBlock = activeSession.blocks[blockIndex] ?? activeSession.blocks[0];
  const nextBlock = activeSession.blocks[blockIndex + 1] ?? null;

  const blockTotalSeconds = currentBlock.durationMinutes * 60;
  const blockProgressPct =
    blockTotalSeconds > 0
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round(
              ((blockTotalSeconds - secondsLeft) / blockTotalSeconds) * 100
            )
          )
        )
      : 0;

  function jumpToBlock(index: number) {
    if (!activeSession) return;
    const clamped = Math.max(
      0,
      Math.min(activeSession.blocks.length - 1, index)
    );
    setBlockIndex(clamped);
    setSecondsLeft(activeSession.blocks[clamped].durationMinutes * 60);
    setCompletedSession(false);
  }

  function resetAll() {
    if (!activeSession) return;
    setIsRunning(false);
    setCompletedSession(false);
    setBlockIndex(0);
    setSecondsLeft(activeSession.blocks[0].durationMinutes * 60);
  }

  return (
    <div className="mx-auto max-w-400 space-y-6">
      {/* Header & Session Picker */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <Timer className="h-4 w-4" />
            <span>Court-Side Coaching Timer</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
            Live Session
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Run timed basketball practices, post-practice conditioning, or
            90-minute combined Saturday sessions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            aria-label="Select training session"
            value={activeSession.id}
            onChange={(e) => setSelectedId(e.target.value)}
            className="h-11 max-w-full rounded-xl border bg-card px-3.5 text-sm font-medium outline-none focus:border-primary sm:min-w-80"
          >
            {availableSessions.map((session) => (
              <option key={session.id} value={session.id}>
                [{session.totalDurationMinutes}m] {session.title}
              </option>
            ))}
          </select>

          <Link
            href="/session-generator"
            className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary/40 hover:bg-accent"
          >
            <Wand2 className="h-4 w-4 text-primary" />
            Custom Session
          </Link>
        </div>
      </div>

      {/* Main Live Workspace Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Active Timer & Current Drill Card */}
        <div className="space-y-6">
          <section className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold ${
                  currentBlock.domain === "basketball"
                    ? "bg-orange-500/15 text-orange-700 dark:text-orange-300"
                    : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                }`}
              >
                {currentBlock.domain === "basketball" ? (
                  <Trophy className="h-3.5 w-3.5" />
                ) : (
                  <Dumbbell className="h-3.5 w-3.5" />
                )}
                Block {blockIndex + 1} of {activeSession.blocks.length} &bull;{" "}
                {currentBlock.partLabel}
              </span>

              <span className="text-xs font-semibold text-muted-foreground">
                {activeSession.ageGroupLabel} &bull;{" "}
                {activeSession.totalDurationMinutes} min total
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
              {currentBlock.title}
            </h2>

            {/* Digital Countdown */}
            <div className="mt-6 flex flex-col items-center justify-between gap-6 rounded-2xl bg-[#14213D] p-6 text-white sm:flex-row">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-300">
                  Block Time Remaining
                </p>
                <div className="mt-1 font-mono text-5xl font-extrabold tracking-tight md:text-6xl">
                  {formatClock(secondsLeft)}
                </div>
                <p className="mt-1.5 text-xs text-slate-300">
                  Scheduled window: Min {currentBlock.startMinute}&ndash;
                  {currentBlock.endMinute} ({currentBlock.durationMinutes} min)
                </p>
              </div>

              {/* Transport Controls */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => jumpToBlock(blockIndex - 1)}
                  disabled={blockIndex === 0}
                  aria-label="Previous block"
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-40"
                >
                  <SkipBack className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsRunning((prev) => !prev)}
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition hover:bg-orange-400"
                >
                  {isRunning ? (
                    <>
                      <Pause className="h-5 w-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      {completedSession ? "Restart" : "Start Timer"}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => jumpToBlock(blockIndex + 1)}
                  disabled={blockIndex === activeSession.blocks.length - 1}
                  aria-label="Next block"
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-40"
                >
                  <SkipForward className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={resetAll}
                  aria-label="Reset session timer"
                  title="Reset session timer"
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition hover:bg-white/15"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Block Progress Bar */}
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                style={{ width: `${blockProgressPct}%` }}
                className="h-full rounded-full bg-primary transition-all duration-300"
              />
            </div>

            {completedSession && (
              <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-emerald-500/15 p-3.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>
                  Session complete! Great work on the court today, Coach.
                </span>
              </div>
            )}

            {/* Instructions & Coaching Cues */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border bg-background/60 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Execution &amp; Setup
                </h3>
                <ul className="mt-2.5 space-y-2 text-sm leading-relaxed">
                  {currentBlock.instructions.map((line, i) => (
                    <li key={i}>&bull; {line}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <MessageSquareQuote className="h-4 w-4" />
                  <span>Coach Says / Key Points</span>
                </div>
                <ul className="mt-2.5 space-y-2 text-sm leading-relaxed">
                  {currentBlock.coachingCues.map((cue, i) => (
                    <li key={i}>&bull; {cue}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Up Next Preview */}
            {nextBlock && (
              <div className="mt-5 flex items-center justify-between rounded-xl border bg-muted/40 px-4 py-3 text-xs sm:text-sm">
                <div>
                  <span className="font-bold text-primary">Up Next: </span>
                  <span className="font-semibold">{nextBlock.title}</span>{" "}
                  <span className="text-muted-foreground">
                    ({nextBlock.partLabel} &bull; {nextBlock.durationMinutes}{" "}
                    min)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => jumpToBlock(blockIndex + 1)}
                  className="font-semibold text-primary hover:underline"
                >
                  Skip &rarr;
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Full Session Timeline Sidebar */}
        <aside className="rounded-2xl border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-base font-bold">Session Timeline</h2>
              <p className="text-xs text-muted-foreground">
                Click any block to jump immediately
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
              <Clock className="h-3.5 w-3.5" />
              {activeSession.totalDurationMinutes}m
            </span>
          </div>

          <div className="mt-4 space-y-2">
            {activeSession.blocks.map((block, idx) => {
              const isActive = idx === blockIndex;
              const isDone = idx < blockIndex || completedSession;

              return (
                <button
                  key={block.id}
                  type="button"
                  onClick={() => jumpToBlock(idx)}
                  className={`flex w-full items-start justify-between gap-2 rounded-xl border p-3 text-left transition ${
                    isActive
                      ? "border-primary bg-primary/10"
                      : isDone
                      ? "border-emerald-500/30 bg-emerald-500/5 opacity-80"
                      : "bg-background/60 hover:border-primary/40"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold uppercase text-primary">
                        {block.partLabel}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        &bull; {block.durationMinutes}m
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs font-semibold sm:text-sm">
                      {block.title}
                    </p>
                  </div>

                  <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
                    {block.startMinute}&ndash;{block.endMinute}m
                  </span>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}