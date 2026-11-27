"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Server,
  Settings as SettingsIcon,
  ShieldCheck,
} from "lucide-react";

export const BACKEND_URL_STORAGE_KEY = "coachai_backend_url_v1";
export const DEFAULT_BACKEND_URL = "http://127.0.0.1:8000";

export default function SettingsPage() {
  const [backendUrl, setBackendUrl] = useState(DEFAULT_BACKEND_URL);
  const [defaultGroup, setDefaultGroup] = useState("U12 (A)");
  const [waterBreakSeconds, setWaterBreakSeconds] = useState(45);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(BACKEND_URL_STORAGE_KEY);
    if (saved) {
      setBackendUrl(saved);
    }
  }, []);

  function handleUrlChange(value: string) {
    setBackendUrl(value);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        BACKEND_URL_STORAGE_KEY,
        value.trim() || DEFAULT_BACKEND_URL
      );
    }
  }

  async function handlePingBackend() {
    const cleanUrl = (backendUrl.trim() || DEFAULT_BACKEND_URL).replace(
      /\/+$/,
      ""
    );
    if (typeof window !== "undefined") {
      localStorage.setItem(BACKEND_URL_STORAGE_KEY, cleanUrl);
    }

    setStatusMessage("Checking FastAPI backend...");
    try {
      const response = await fetch(`${cleanUrl}/health`);
      if (response.ok) {
        const data = (await response.json()) as {
          status?: string;
          mongodb_connected?: boolean;
        };
        setStatusMessage(
          `Connected to CoachAI FastAPI backend (status: ${
            data.status ?? "ok"
          }, MongoDB: ${data.mongodb_connected ? "connected" : "memory fallback"}).`
        );
      } else {
        setStatusMessage(
          `Backend responded with HTTP ${response.status}.`
        );
      }
    } catch {
      setStatusMessage(
        `Could not reach ${cleanUrl}. Start Uvicorn with: uvicorn main:app --reload --host 127.0.0.1 --port 8000`
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
              onChange={(e) => handleUrlChange(e.target.value)}
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