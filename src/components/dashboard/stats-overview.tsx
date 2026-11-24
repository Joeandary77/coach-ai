
"use client";

import { motion } from "motion/react";
import {
  Users,
  CalendarDays,
  Timer,
  CalendarRange,
} from "lucide-react";

import { programStats } from "@/data/dashboard";

const statistics = [
  {
    title: "Age Categories",
    value: programStats.totalCategories,
    description: "U8, U10, U12 and U14",
    icon: Users,
    color: "text-orange-600 dark:text-orange-400",
    background: "bg-orange-500/10",
  },
  {
    title: "Planned Sessions",
    value: programStats.totalSessions,
    description: "Across all categories",
    icon: CalendarDays,
    color: "text-blue-600 dark:text-blue-400",
    background: "bg-blue-500/10",
  },
  {
    title: "Session Duration",
    value: `${programStats.sessionDuration} min`,
    description: "After basketball training",
    icon: Timer,
    color: "text-emerald-600 dark:text-emerald-400",
    background: "bg-emerald-500/10",
  },
  {
    title: "Program Weeks",
    value: programStats.totalWeeks,
    description: "Every Saturday",
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
            initial={{ opacity: 0, y: 12 }}
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
