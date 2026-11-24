
import { Suspense } from "react";
import type { Metadata } from "next";

import { FitnessProgramView } from "@/components/fitness/fitness-program-view";

export const metadata: Metadata = {
  title: "Fitness Program | CoachAI",
  description:
    "Explore the four-week academy fitness program.",
};

function FitnessProgramLoading() {
  return (
    <div className="mx-auto max-w-400 animate-pulse space-y-6">
      <div className="h-64 rounded-2xl bg-muted" />

      <div className="space-y-3">
        <div className="h-6 w-40 rounded bg-muted" />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-36 rounded-2xl bg-muted"
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-40 rounded-2xl bg-muted"
          />
        ))}
      </div>

      <div className="h-72 rounded-2xl bg-muted" />
    </div>
  );
}

export default function FitnessProgramPage() {
  return (
    <Suspense fallback={<FitnessProgramLoading />}>
      <FitnessProgramView />
    </Suspense>
  );
}
