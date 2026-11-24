
import { Timer } from "lucide-react";
import Link from "next/link";

export default function LiveSessionPage() {
  return (
    <div className="mx-auto max-w-400 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Live Session
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Your real-time coaching workspace.
        </p>
      </div>

      <section className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-10 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Timer className="h-8 w-8" />
        </div>

        <h2 className="text-xl font-bold">
          Live Session Workspace
        </h2>

        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Session timers, training block navigation
          and coaching controls will be available
          in Phase 6.
        </p>

        <Link
          href="/fitness-program"
          className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
        >
          Back to Fitness Program
        </Link>
      </section>
    </div>
  );
}
