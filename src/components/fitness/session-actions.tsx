
import Link from "next/link";

import {
  Play,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import type { FitnessSession } from "@/types/fitness";

interface SessionActionsProps {
  session: FitnessSession;
}

export function SessionActions({
  session,
}: SessionActionsProps) {
  return (
    <div className="space-y-4">
      <section className="space-y-4 rounded-2xl bg-[#14213D] p-5 text-white shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
          <Play className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-bold">
            Ready for the Session?
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Open the coaching workspace for{" "}
            {session.category}, Week {session.week}.
          </p>
        </div>

        <Link
          href={`/live-session?session=${session.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-[#14213D] transition-colors hover:bg-orange-400"
        >
          <Play className="h-4 w-4" />
          Start Session
        </Link>

        <Link
          href="/ai-coach"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/10"
        >
          <Sparkles className="h-4 w-4 text-orange-400" />
          Ask AI Coach
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <h2 className="font-bold">
            Coaching Guidelines
          </h2>
        </div>

        <div className="space-y-3">
          {session.coachingNotes.map((note, index) => (
            <div
              key={index}
              className="flex items-start gap-2"
            >
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

              <p className="text-xs leading-relaxed text-muted-foreground">
                {note}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
