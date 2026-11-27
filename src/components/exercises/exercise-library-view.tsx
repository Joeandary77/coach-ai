"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownUp,
  Clock,
  Dumbbell,
  Layers,
  MessageSquareQuote,
  Package,
  Search,
  Trophy,
  X,
} from "lucide-react";

import { LibraryHeader } from "./library-header";
import { ExerciseGrid } from "./exercise-grid";
import { ExerciseFilters } from "./exercise-filters";
import { ActiveFilters } from "./active-filters";
import { ExerciseDetails } from "./exercise-details";

import { exercises } from "@/data/exercises";
import {
  unifiedBasketballItems,
  unifiedLibrary,
} from "@/data/unified-library";

import {
  defaultExerciseFilters,
  filterExercises,
  getActiveFilterCount,
} from "@/lib/exercise-filters";

import type {
  ExerciseFilters as FilterValues,
  ExerciseSort,
} from "@/lib/exercise-filters";

import type { AgeCategory, Exercise } from "@/types/fitness";
import type { UnifiedLibraryItem } from "@/types/training";

type DomainTab = "all" | "basketball" | "fitness";

export function ExerciseLibraryView() {
  const [domainTab, setDomainTab] = useState<DomainTab>("all");

  // Fitness-specific filter state
  const [filters, setFilters] = useState<FilterValues>({
    ...defaultExerciseFilters,
  });

  // Unified / Basketball search & filter state
  const [unifiedSearch, setUnifiedSearch] = useState("");
  const [selectedCohort, setSelectedCohort] = useState<AgeCategory | "ALL">(
    "ALL"
  );
  const [selectedFocus, setSelectedFocus] = useState<string>("ALL");

  // Modal state
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [selectedUnifiedItem, setSelectedUnifiedItem] =
    useState<UnifiedLibraryItem | null>(null);

  // Filtered fitness exercises
  const filteredExercises = useMemo(
    () => filterExercises(exercises, filters),
    [filters]
  );

  const activeCount = getActiveFilterCount(filters);

  // Available focus tags for active unified tab
  const availableFocusTags = useMemo(() => {
    const source =
      domainTab === "basketball" ? unifiedBasketballItems : unifiedLibrary;
    const set = new Set<string>();
    source.forEach((item) => item.focus.forEach((f) => set.add(f)));
    return Array.from(set).sort();
  }, [domainTab]);

  // Filtered unified / basketball items
  const filteredUnifiedItems = useMemo(() => {
    const source =
      domainTab === "basketball" ? unifiedBasketballItems : unifiedLibrary;
    const query = unifiedSearch.trim().toLowerCase();

    return source.filter((item) => {
      if (
        selectedCohort !== "ALL" &&
        !item.cohorts.includes(selectedCohort)
      ) {
        return false;
      }

      if (
        selectedFocus !== "ALL" &&
        !item.focus.includes(selectedFocus as never)
      ) {
        return false;
      }

      if (!query) return true;

      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.focus.some((f) => f.toLowerCase().includes(query)) ||
        item.instructions.some((step) => step.toLowerCase().includes(query))
      );
    });
  }, [domainTab, unifiedSearch, selectedCohort, selectedFocus]);

  function handleExerciseSelect(exercise: Exercise) {
    setSelectedExercise(exercise);
    setDetailsOpen(true);
  }

  function handleDetailsOpenChange(open: boolean) {
    setDetailsOpen(open);
  }

  function handleUnifiedSelect(item: UnifiedLibraryItem) {
    if (item.domain === "fitness" && item.rawExercise) {
      handleExerciseSelect(item.rawExercise);
      return;
    }
    setSelectedUnifiedItem(item);
  }

  return (
    <div className="mx-auto max-w-400 space-y-6">
      <LibraryHeader />

      {/* Domain Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex flex-wrap rounded-2xl border bg-card p-1.5 shadow-xs">
          <button
            type="button"
            onClick={() => {
              setDomainTab("all");
              setSelectedFocus("ALL");
            }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition sm:text-sm ${
              domainTab === "all"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>All Knowledge Base ({unifiedLibrary.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setDomainTab("basketball");
              setSelectedFocus("ALL");
            }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition sm:text-sm ${
              domainTab === "basketball"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>Basketball Drills ({unifiedBasketballItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setDomainTab("fitness")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition sm:text-sm ${
              domainTab === "fitness"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Dumbbell className="h-4 w-4" />
            <span>Fitness Exercises ({exercises.length})</span>
          </button>
        </div>
      </div>

      {domainTab === "fitness" ? (
        <>
          <ExerciseFilters
            filters={filters}
            onFiltersChange={setFilters}
          />

          <ActiveFilters
            filters={filters}
            onFiltersChange={setFilters}
          />

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  {activeCount > 0 ? "Search Results" : "Fitness Exercises"}
                </h2>

                <p
                  aria-live="polite"
                  className="mt-1 text-sm text-muted-foreground"
                >
                  Showing {filteredExercises.length} of {exercises.length}{" "}
                  fitness exercises (no basketballs or skipping ropes)
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl border bg-card px-3">
                <ArrowDownUp className="h-4 w-4 shrink-0 text-muted-foreground" />

                <select
                  aria-label="Sort exercises"
                  value={filters.sort}
                  onChange={(event) =>
                    setFilters((previous) => ({
                      ...previous,
                      sort: event.target.value as ExerciseSort,
                    }))
                  }
                  className="h-11 bg-transparent text-sm outline-none"
                >
                  <option
                    value="default"
                    className="bg-card text-foreground"
                  >
                    Default Order
                  </option>

                  <option
                    value="name-asc"
                    className="bg-card text-foreground"
                  >
                    Name: A–Z
                  </option>

                  <option
                    value="name-desc"
                    className="bg-card text-foreground"
                  >
                    Name: Z–A
                  </option>
                </select>
              </div>
            </div>

            <ExerciseGrid
              exercises={filteredExercises}
              onSelect={handleExerciseSelect}
            />

            {filteredExercises.length === 0 && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...defaultExerciseFilters,
                    })
                  }
                  className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </section>
        </>
      ) : (
        /* Unified All / Basketball Drills View */
        <section className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="grid grid-cols-1 gap-3 rounded-2xl border bg-card p-4 shadow-xs md:grid-cols-[minmax(0,1fr)_180px_220px]">
            <div className="relative flex items-center">
              <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={unifiedSearch}
                onChange={(e) => setUnifiedSearch(e.target.value)}
                placeholder={
                  domainTab === "basketball"
                    ? "Search basketball drills, skills, or coaching cues..."
                    : "Search all drills and fitness exercises..."
                }
                className="h-11 w-full rounded-xl border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <select
              aria-label="Filter by age cohort"
              value={selectedCohort}
              onChange={(e) =>
                setSelectedCohort(e.target.value as AgeCategory | "ALL")
              }
              className="h-11 rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary"
            >
              <option value="ALL">All Age Groups</option>
              <option value="U8">U8</option>
              <option value="U10">U10</option>
              <option value="U12">U12 (A &amp; B)</option>
              <option value="U14">U14-16</option>
            </select>

            <select
              aria-label="Filter by focus area"
              value={selectedFocus}
              onChange={(e) => setSelectedFocus(e.target.value)}
              className="h-11 rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary"
            >
              <option value="ALL">All Focus Areas</option>
              {availableFocusTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {domainTab === "basketball"
                  ? "Basketball Drills (Month 1)"
                  : "Unified Drills & Exercises"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Showing {filteredUnifiedItems.length} of{" "}
                {domainTab === "basketball"
                  ? unifiedBasketballItems.length
                  : unifiedLibrary.length}{" "}
                activities
              </p>
            </div>

            {(unifiedSearch ||
              selectedCohort !== "ALL" ||
              selectedFocus !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setUnifiedSearch("");
                  setSelectedCohort("ALL");
                  setSelectedFocus("ALL");
                }}
                className="rounded-xl border bg-card px-3.5 py-2 text-xs font-semibold hover:border-primary/40"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredUnifiedItems.map((item) => {
              const isBasketball = item.domain === "basketball";

              return (
                <article
                  key={item.id}
                  onClick={() => handleUnifiedSelect(item)}
                  className="group flex cursor-pointer flex-col justify-between rounded-2xl border bg-card p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${
                          isBasketball
                            ? "bg-orange-500/15 text-orange-700 dark:text-orange-300"
                            : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        }`}
                      >
                        {isBasketball ? (
                          <Trophy className="h-3.5 w-3.5" />
                        ) : (
                          <Dumbbell className="h-3.5 w-3.5" />
                        )}
                        {isBasketball ? "Basketball Drill" : "Fitness"}
                      </span>

                      <span className="text-xs font-medium text-muted-foreground">
                        {item.ageLabels.join(", ")}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold tracking-tight group-hover:text-primary">
                      {item.name}
                    </h3>

                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 space-y-3 border-t pt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {item.focus.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Package className="h-3.5 w-3.5" />
                        {item.equipment.length > 0
                          ? item.equipment.join(", ")
                          : "No equipment"}
                      </span>

                      {item.durationMinutes && (
                        <span className="inline-flex items-center gap-1 font-semibold text-primary">
                          <Clock className="h-3.5 w-3.5" />
                          {item.durationMinutes} min
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Fitness Exercise Details Modal */}
      <ExerciseDetails
        exercise={selectedExercise}
        open={detailsOpen}
        onOpenChange={handleDetailsOpenChange}
      />

      {/* Basketball Drill Details Modal */}
      {selectedUnifiedItem && selectedUnifiedItem.rawDrill && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelectedUnifiedItem(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500/15 px-2.5 py-1 text-xs font-bold text-orange-700 dark:text-orange-300">
                    <Trophy className="h-3.5 w-3.5" />
                    Week {selectedUnifiedItem.rawDrill.week} &bull;{" "}
                    {selectedUnifiedItem.rawDrill.part}
                  </span>
                  <span className="rounded-lg border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {selectedUnifiedItem.ageLabels.join(", ")}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    <Clock className="h-3.5 w-3.5" />
                    {selectedUnifiedItem.durationMinutes} min
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-bold">
                  {selectedUnifiedItem.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  From session: {selectedUnifiedItem.rawDrill.sessionTitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUnifiedItem(null)}
                aria-label="Close drill details"
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  How To Do It
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed">
                  {selectedUnifiedItem.rawDrill.instructions}
                </p>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl bg-orange-500/10 p-3.5 text-sm">
                <MessageSquareQuote className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <span className="font-bold text-primary">
                    Coach says / key point:{" "}
                  </span>
                  <span>{selectedUnifiedItem.rawDrill.coachingCues}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                <div className="flex flex-wrap gap-1.5">
                  {selectedUnifiedItem.focus.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href="/basketball-program"
                  onClick={() => setSelectedUnifiedItem(null)}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-orange-500"
                >
                  Open in Basketball Program
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}