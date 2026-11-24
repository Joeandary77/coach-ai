
"use client";

import {
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";

import { ProgramHeader } from "./program-header";
import { CategorySelector } from "./category-selector";
import { WeekSelector } from "./week-selector";
import { SessionOverview } from "./session-overview";
import { SessionTimeline } from "./session-timeline";
import { EquipmentList } from "./equipment-list";
import { SessionActions } from "./session-actions";

import {
  ageCategories,
  getFitnessSession,
} from "@/data/fitness-program";

import { programConfig } from "@/data/dashboard";
import type { AgeCategory } from "@/types/fitness";

export function FitnessProgramView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category");
  const weekParam = Number(searchParams.get("week"));

  const selectedCategory: AgeCategory =
    ageCategories.includes(categoryParam as AgeCategory)
      ? (categoryParam as AgeCategory)
      : "U8";

  const selectedWeek =
    Number.isInteger(weekParam) &&
    weekParam >= 1 &&
    weekParam <= programConfig.totalWeeks
      ? weekParam
      : 1;

  const session = getFitnessSession(
    selectedCategory,
    selectedWeek
  );

  function updateSelection(
    category: AgeCategory,
    week: number
  ) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("category", category);
    params.set("week", String(week));

    router.replace(
      `${pathname}?${params.toString()}`,
      { scroll: false }
    );
  }

  return (
    <div className="mx-auto max-w-400 space-y-6">
      <ProgramHeader />

      <CategorySelector
        selectedCategory={selectedCategory}
        onCategoryChange={(category) =>
          updateSelection(category, selectedWeek)
        }
      />

      <WeekSelector
        selectedWeek={selectedWeek}
        onWeekChange={(week) =>
          updateSelection(selectedCategory, week)
        }
      />

      {session ? (
        <>
          <SessionOverview session={session} />

          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <SessionTimeline
              key={session.id}
              session={session}
            />

            <aside className="min-w-0 space-y-5">
              <EquipmentList
                key={session.id}
                equipment={session.equipment}
              />

              <SessionActions session={session} />
            </aside>
          </div>
        </>
      ) : (
        <section className="rounded-2xl border bg-card p-8 text-center">
          <h2 className="text-lg font-semibold">
            Session Not Found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            No fitness session is available for the
            selected category and week.
          </p>
        </section>
      )}
    </div>
  );
}
