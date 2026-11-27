"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Server,
  Settings as SettingsIcon,
  ShieldCheck,
} from "lucide-react";

export default function SettingsPage() {
  const [backendUrl, setBackendUrl] = useState("http://127.0.0.1:8000");
  const [defaultGroup, setDefaultGroup] = useState("U12 (A)");
  const [waterBreakSeconds, setWaterBreakSeconds] = useState(45);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  async function handlePingBackend() {
    setStatusMessage("Checking FastAPI backend...");
    try {
      const response = await fetch(`${backendUrl}/health`);
      if (response.ok) {
        setStatusMessage("Connected to CoachAI FastAPI backend.");
      } else {
        setStatusMessage(
          `Backend responded with status ${response.status}.`
        );
      }
    } catch {
      setStatusMessage(
        "Backend not running yet — ready to start in Phase 6 (backend/main.py)."
      );
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
          <SettingsIcon className="h-4 w-4" />
          <span>Workspace Configuration</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure CoachAI academy rules, session defaults, and Python FastAPI
          backend connection.
        </p>
      </div>

      {/* Academy Coaching Defaults */}
      <section className="space-y-4 rounded-2xl border bg-card p-6 shadow-xs">
        <div className="flex items-center gap-2 text-base font-bold">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h2>Academy Coaching Rules &amp; Defaults</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Default Age Group
            </label>
            <select
              value={defaultGroup}
              onChange={(e) => setDefaultGroup(e.target.value)}
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
              Water Break Duration (Seconds)
            </label>
            <input
              type="number"
              min={30}
              max={90}
              step={15}
              value={waterBreakSeconds}
              onChange={(e) => setWaterBreakSeconds(Number(e.target.value))}
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="rounded-xl bg-muted/60 p-3.5 text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Enforced Youth Safety Guardrails:</strong>{" "}
          Post-practice Saturday fitness sessions are capped at 30 minutes and
          strictly exclude basketballs and skipping ropes.
        </div>
      </section>

      {/* AI & Backend Connection */}
      <section className="space-y-4 rounded-2xl border bg-card p-6 shadow-xs">
        <div className="flex items-center gap-2 text-base font-bold">
          <Server className="h-5 w-5 text-primary" />
          <h2>FastAPI &amp; AI Backend Connection</h2>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            Backend API Base URL
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              className="h-10 flex-1 rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={handlePingBackend}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-orange-400"
            >
              <CheckCircle2 className="h-4 w-4" />
              Test Connection
            </button>
          </div>
        </div>

        {statusMessage && (
          <p className="rounded-xl border bg-background px-3.5 py-2.5 text-xs font-medium">
            {statusMessage}
          </p>
        )}
      </section>
    </div>
  );
}