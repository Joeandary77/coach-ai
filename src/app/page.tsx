
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { CategoryCard } from "@/components/dashboard/category-card";
import { WeeklyOverview } from "@/components/dashboard/weekly-overview";
import { UpcomingSessions } from "@/components/dashboard/upcoming-sessions";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { AIAssistantPanel } from "@/components/dashboard/ai-assistant-panel";

import { categories } from "@/data/dashboard";

export default function Home() {
  return (
    <div className="mx-auto max-w-400 space-y-6">
      {/* Welcome banner */}
      <WelcomeBanner />

      {/* Program statistics */}
      <StatsOverview />

      {/* Main dashboard layout */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Main dashboard content */}
        <div className="min-w-0 space-y-6">
          {/* Age categories */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Age Categories
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Explore the fitness program for each age group.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                />
              ))}
            </div>
          </section>

          {/* Weekly overview */}
          <WeeklyOverview />

          {/* Upcoming sessions */}
          <UpcomingSessions />

          {/* Quick actions */}
          <QuickActions />
        </div>

        {/* Desktop AI assistant */}
        <aside className="sticky top-24 hidden min-w-0 xl:block">
          <AIAssistantPanel />
        </aside>
      </div>

      {/* Mobile and tablet AI assistant shortcut */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm xl:hidden">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold">
              AI Coaching Assistant
            </h2>

            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Explore your intelligent coaching workspace.
              Currently available in preview mode.
            </p>

            <Link
              href="/ai-coach"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-orange-400"
            >
              Open AI Coach
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
