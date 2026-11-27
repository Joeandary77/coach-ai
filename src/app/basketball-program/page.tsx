import { Suspense } from "react";
import type { Metadata } from "next";

import { BasketballProgramView } from "@/components/basketball/basketball-program-view";

export const metadata: Metadata = {
  title: "Basketball Program | CoachAI",
  description:
    "Explore Month 1: Foundations — 36 structured basketball training sessions across U8, U10, U12 (B), U12 (A), and U14-16.",
};

function BasketballProgramLoading() {
  return (
    <div className="mx-auto max-w-400 animate-pulse space-y-6">
      <div className="h-56 rounded-2xl bg-muted" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="h-80 rounded-2xl bg-muted" />
    </div>
  );
}

export default function BasketballProgramPage() {
  return (
    <Suspense fallback={<BasketballProgramLoading />}>
      <BasketballProgramView />
    </Suspense>
  );
}