"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  CheckSquare,
  ClipboardList,
  Plus,
  Square,
  Trash2,
  Users,
} from "lucide-react";

import { endOfMonthChecklists } from "@/data/basketball-program";
import type { BasketballAgeGroup } from "@/types/training";

const BACKEND_URL_STORAGE_KEY = "coachai_backend_url_v1";
const DEFAULT_BACKEND_URL = "http://127.0.0.1:8000";

interface SessionReportEntry {
  id: string;
  date: string;
  ageGroup: BasketballAgeGroup;
  sessionType: "Basketball (60m)" | "Fitness (30m)" | "Saturday Combined (90m)";
  attendanceCount: number;
  readinessRating: "High Energy" | "Normal" | "Fatigued — Adapted";
  notes: string;
  storage?: "mongodb" | "memory" | "local" | "file";
}

interface BackendReportRecord {
  id: string;
  date: string;
  age_group: BasketballAgeGroup;
  session_type: SessionReportEntry["sessionType"];
  attendance_count: number;
  readiness_rating: SessionReportEntry["readinessRating"];
  notes: string;
  storage?: "mongodb" | "memory" | "file";
}

const STORAGE_REPORTS_KEY = "coachai_session_reports_v1";
const STORAGE_CHECKLIST_KEY = "coachai_skill_checklists_v1";

const DEFAULT_REPORTS: SessionReportEntry[] = [
  {
    id: "seed-report-1",
    date: "2026-11-07",
    ageGroup: "U12 (A)",
    sessionType: "Saturday Combined (90m)",
    attendanceCount: 14,
    readinessRating: "High Energy",
    notes:
      "Completed Week 1 ball-handling & footwork progressions followed by 30-min U12 conditioning. All players maintained clean posture.",
    storage: "local",
  },
];

function getBackendBaseUrl(): string {
  if (typeof window === "undefined") return DEFAULT_BACKEND_URL;
  return (
    localStorage.getItem(BACKEND_URL_STORAGE_KEY)?.trim() ||
    DEFAULT_BACKEND_URL
  ).replace(/\/+$/, "");
}

function mapBackendReport(item: BackendReportRecord): SessionReportEntry {
  return {
    id: item.id,
    date: item.date,
    ageGroup: item.age_group,
    sessionType: item.session_type,
    attendanceCount: item.attendance_count,
    readinessRating: item.readiness_rating,
    notes: item.notes,
    storage: item.storage ?? "memory",
  };
}

export default function SessionReportsPage() {
  const [reports, setReports] = useState<SessionReportEntry[]>(DEFAULT_REPORTS);
  const [checkedSkills, setCheckedSkills] = useState<Record<string, boolean>>(
    {}
  );

  // Form state
  const [ageGroup, setAgeGroup] = useState<BasketballAgeGroup>("U12 (A)");
  const [sessionType, setSessionType] = useState<
    SessionReportEntry["sessionType"]
  >("Basketball (60m)");
  const [attendanceCount, setAttendanceCount] = useState<number>(12);
  const [readinessRating, setReadinessRating] =
    useState<SessionReportEntry["readinessRating"]>("Normal");
  const [notes, setNotes] = useState<string>("");

  function saveLocalReports(next: SessionReportEntry[]) {
    setReports(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(next));
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedReports = localStorage.getItem(STORAGE_REPORTS_KEY);
      if (savedReports) {
        setReports(JSON.parse(savedReports) as SessionReportEntry[]);
      }
      const savedChecks = localStorage.getItem(STORAGE_CHECKLIST_KEY);
      if (savedChecks) {
        setCheckedSkills(JSON.parse(savedChecks) as Record<string, boolean>);
      }
    } catch {
      // Ignore storage parse issues
    }

    async function loadBackendReports() {
      try {
        const res = await fetch(`${getBackendBaseUrl()}/api/v1/reports`);
        if (!res.ok) return;
        const remote = (await res.json()) as BackendReportRecord[];
        const mapped = remote.map(mapBackendReport);
        saveLocalReports(mapped);
      } catch {
        // Keep local reports when backend is not running
      }
    }

    void loadBackendReports();
  }, []);

  function toggleSkill(skillKey: string) {
    setCheckedSkills((prev) => {
      const next = { ...prev, [skillKey]: !prev[skillKey] };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_CHECKLIST_KEY, JSON.stringify(next));
      }
      return next;
    });
  }

  async function handleAddReport(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!notes.trim()) return;

    const today = new Date().toISOString().slice(0, 10);
    const trimmedNotes = notes.trim();

    try {
      const res = await fetch(`${getBackendBaseUrl()}/api/v1/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: today,
          age_group: ageGroup,
          session_type: sessionType,
          attendance_count: attendanceCount,
          readiness_rating: readinessRating,
          notes: trimmedNotes,
        }),
      });

      if (res.ok) {
        const created = (await res.json()) as BackendReportRecord;
        const next = [mapBackendReport(created), ...reports];
        saveLocalReports(next);
        setNotes("");
        return;
      }
    } catch {
      // Fall back to local storage if backend is offline
    }

    const fallbackEntry: SessionReportEntry = {
      id: crypto.randomUUID(),
      date: today,
      ageGroup,
      sessionType,
      attendanceCount,
      readinessRating,
      notes: trimmedNotes,
      storage: "local",
    };

    saveLocalReports([fallbackEntry, ...reports]);
    setNotes("");
  }

  async function handleDeleteReport(id: string) {
    try {
      const res = await fetch(
        `${getBackendBaseUrl()}/api/v1/reports/${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      if (!res.ok && res.status !== 404) {
        return;
      }
    } catch {
      // Allow local cleanup when backend is offline
    }

    saveLocalReports(reports.filter((r) => r.id !== id));
  }

  return (
    <div className="mx-auto max-w-400 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
          <ClipboardList className="h-4 w-4" />
          <span>Academy Tracking &amp; Evaluation</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
          Session Reports &amp; Skill Checklists
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Log post-practice attendance, player readiness, and Month 1 skill
          progression benchmarks.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        {/* New Report Form */}
        <form
          onSubmit={(e) => void handleAddReport(e)}
          className="space-y-4 rounded-2xl border bg-card p-5 shadow-xs"
        >
          <h2 className="text-base font-bold">Log New Session Report</h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Age Group
            </label>
            <select
              value={ageGroup}
              onChange={(e) =>
                setAgeGroup(e.target.value as BasketballAgeGroup)
              }
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary"
            >
              <option value="U8">U8</option>
              <option value="U10">U10</option>
              <option value="U12 (B)">U12 (B)</option>
              <option value="U12 (A)">U12 (A)</option>
              <option value="U14-16">U14-16</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Session Format
            </label>
            <select
              value={sessionType}
              onChange={(e) =>
                setSessionType(
                  e.target.value as SessionReportEntry["sessionType"]
                )
              }
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary"
            >
              <option value="Basketball (60m)">Basketball (60m)</option>
              <option value="Fitness (30m)">Fitness (30m)</option>
              <option value="Saturday Combined (90m)">
                Saturday Combined (90m)
              </option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Players Present
              </label>
              <input
                type="number"
                min={1}
                max={40}
                value={attendanceCount}
                onChange={(e) => setAttendanceCount(Number(e.target.value))}
                className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Group Readiness
              </label>
              <select
                value={readinessRating}
                onChange={(e) =>
                  setReadinessRating(
                    e.target.value as SessionReportEntry["readinessRating"]
                  )
                }
                className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary"
              >
                <option value="High Energy">High Energy</option>
                <option value="Normal">Normal</option>
                <option value="Fatigued — Adapted">
                  Fatigued &mdash; Adapted
                </option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Coaching Observations &amp; Follow-Ups
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Note skill breakthroughs, spacing adjustments, or fitness modifications..."
              className="w-full rounded-xl border bg-background p-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={!notes.trim()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-orange-400 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
            Save Session Report
          </button>
        </form>

        {/* Logged Reports & End-of-Month Checklists */}
        <div className="space-y-6">
          <section className="rounded-2xl border bg-card p-5 shadow-xs">
            <h2 className="text-base font-bold">
              Recent Session Logs ({reports.length})
            </h2>

            <div className="mt-4 space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-xl border bg-background/60 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">
                        {report.ageGroup}
                      </span>
                      <span className="text-xs font-semibold">
                        {report.sessionType}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {report.attendanceCount} players
                      </span>
                      {report.storage && (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {report.storage}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {report.date}
                      </span>
                      <button
                        type="button"
                        onClick={() => void handleDeleteReport(report.id)}
                        aria-label="Delete report"
                        className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed">
                    {report.notes}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Interactive Month 1 Skill Checklists */}
          <section className="rounded-2xl border bg-card p-5 shadow-xs">
            <h2 className="text-base font-bold">
              Month 1 End-of-Month Skill Checklists
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Track group mastery across all four academy benchmarks.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {endOfMonthChecklists.map((group) => (
                <div
                  key={group.id}
                  className="rounded-xl border bg-background/60 p-4"
                >
                  <h3 className="text-sm font-bold text-primary">
                    {group.title}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {group.skills.map((skill, idx) => {
                      const key = `${group.id}-${idx}`;
                      const checked = Boolean(checkedSkills[key]);

                      return (
                        <li key={key}>
                          <button
                            type="button"
                            onClick={() => toggleSkill(key)}
                            className="flex w-full items-start gap-2 text-left text-xs leading-relaxed transition hover:text-primary"
                          >
                            {checked ? (
                              <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            ) : (
                              <Square className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                            )}
                            <span
                              className={
                                checked
                                  ? "text-muted-foreground line-through"
                                  : ""
                              }
                            >
                              {skill}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}