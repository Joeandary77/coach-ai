import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Trophy,
  Clock,
  Users,
  CalendarDays,
} from "lucide-react";

import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { CategoryCard } from "@/components/dashboard/category-card";
import { WeeklyOverview } from "@/components/dashboard/weekly-overview";
import { UpcomingSessions } from "@/components/dashboard/upcoming-sessions";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { AIAssistantPanel } from "@/components/dashboard/ai-assistant-panel";

import {
  basketballDashboardStats,
  categories,
} from "@/data/dashboard";
import { basketballWeeks } from "@/data/basketball-program";

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
          {/* Basketball Program Overview Section */}
          <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <Trophy className="h-4 w-4" />
                  <span>Basketball Curriculum &bull; November 2026</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight">
                  {basketballDashboardStats.monthTitle}
                </h2>
                <p className="text-sm text-muted-foreground">
                  36 structured 60-minute court sessions across U8, U10, U12
                  (B), U12 (A), and U14-16.
                </p>
              </div>

              <Link
                href="/basketball-program"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-orange-500"
              >
                <span>Open Basketball Plan</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3.5">
                <CalendarDays className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-bold">
                    {basketballDashboardStats.totalSessions} Court Sessions
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Wed, Thu &amp; Sat schedule
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3.5">
                <Users className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-bold">
                    {basketballDashboardStats.totalGroups} Training Groups
                  </p>
                  <p className="text-xs text-muted-foreground">
                    U8, U10, U12 B/A, U14-16
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3.5">
                <Clock className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-bold">
                    {basketballDashboardStats.sessionDuration} Min Structure
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Warm-up, 2 Skills, Game, Talk
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {basketballWeeks.map((week) => (
                <Link
                  key={week.week}
                  href="/basketball-program"
                  className="rounded-xl border bg-background p-3 transition hover:border-primary/40"
                >
                  <p className="text-xs font-bold text-primary">
                    Week {week.week} &bull; {week.dateRange}
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-snug">
                    {week.theme}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* Fitness Age categories */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Saturday Fitness Categories
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                30-minute post-practice fitness sessions for each age group.
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