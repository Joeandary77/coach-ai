"use client";

import { motion } from "motion/react";
import {
  Trophy,
  CalendarDays,
  Users,
  CalendarRange,
} from "lucide-react";

import {
  basketballDashboardStats,
  programStats,
} from "@/data/dashboard";

const statistics = [
  {
    title: "Basketball Sessions",
    value: basketballDashboardStats.totalSessions,
    description: "60 min court practices (Wed, Thu, Sat)",
    icon: Trophy,
    color: "text-orange-600 dark:text-orange-400",
    background: "bg-orange-500/10",
  },
  {
    title: "Fitness Sessions",
    value: programStats.totalSessions,
    description: "30 min post-practice every Saturday",
    icon: CalendarDays,
    color: "text-emerald-600 dark:text-emerald-400",
    background: "bg-emerald-500/10",
  },
  {
    title: "Training Groups",
    value: basketballDashboardStats.totalGroups,
    description: "U8, U10, U12 (B), U12 (A) & U14-16",
    icon: Users,
    color: "text-blue-600 dark:text-blue-400",
    background: "bg-blue-500/10",
  },
  {
    title: "Month 1 Curriculum",
    value: `${programStats.totalWeeks} Weeks`,
    description: "52 total basketball & fitness sessions",
    icon: CalendarRange,
    color: "text-violet-600 dark:text-violet-400",
    background: "bg-violet-500/10",
  },
];

export function StatsOverview() {
  return (
    <section
      aria-label="Program statistics"
      className="grid grid-cols-2 gap-3 xl:grid-cols-4"
    >
      {statistics.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.title}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: index * 0.08,
            }}
            className="rounded-2xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md md:p-5"
          >
            <div
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${stat.background} ${stat.color}`}
            >
              <Icon className="h-5 w-5" />
            </div>

            <p className="text-xs font-medium text-muted-foreground sm:text-sm">
              {stat.title}
            </p>

            <h3 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              {stat.value}
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {stat.description}
            </p>
          </motion.div>
        );
      })}
    </section>
  );
}