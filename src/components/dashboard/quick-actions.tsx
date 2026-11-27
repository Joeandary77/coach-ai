"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Trophy,
  CalendarDays,
  Dumbbell,
  Timer,
  ClipboardList,
  ArrowUpRight,
  Zap,
} from "lucide-react";

import { quickActions } from "@/data/dashboard";

const actionStyles = {
  "/basketball-program": {
    icon: Trophy,
    color: "text-orange-600 dark:text-orange-400",
    background: "bg-orange-500/10",
  },
  "/fitness-program": {
    icon: CalendarDays,
    color: "text-emerald-600 dark:text-emerald-400",
    background: "bg-emerald-500/10",
  },
  "/exercise-library": {
    icon: Dumbbell,
    color: "text-blue-600 dark:text-blue-400",
    background: "bg-blue-500/10",
  },
  "/live-session": {
    icon: Timer,
    color: "text-violet-600 dark:text-violet-400",
    background: "bg-violet-500/10",
  },
  "/reports": {
    icon: ClipboardList,
    color: "text-violet-600 dark:text-violet-400",
    background: "bg-violet-500/10",
  },
};

export function QuickActions() {
  return (
    <section className="space-y-4">
      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Zap className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Quick Actions
          </h2>

          <p className="text-sm text-muted-foreground">
            Access your coaching tools.
          </p>
        </div>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {quickActions.map((action, index) => {
          const style =
            actionStyles[
              action.href as keyof typeof actionStyles
            ] ?? {
              icon: Zap,
              color: "text-primary",
              background: "bg-primary/10",
            };

          const Icon = style.icon;

          return (
            <motion.div
              key={action.href}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: index * 0.08,
              }}
            >
              <Link
                href={action.href}
                className="group block h-full rounded-2xl border bg-card p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${style.background} ${style.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>

                <h3 className="mt-4 text-sm font-bold">
                  {action.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {action.description}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}