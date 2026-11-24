
"use client";

import {
  CalendarDays,
  Clock,
  Layers,
  Package,
  Info,
  Target,
} from "lucide-react";

import { motion } from "motion/react";

import type {
  FitnessSession,
  SessionStatus,
} from "@/types/fitness";

import { programConfig } from "@/data/dashboard";
import { cn } from "@/lib/utils";

interface SessionOverviewProps {
  session: FitnessSession;
}

const statusStyles: Record<SessionStatus, string> = {
  planned:
    "bg-blue-500/10 text-blue-500",
  "in-progress":
    "bg-orange-500/10 text-orange-500",
  completed:
    "bg-emerald-500/10 text-emerald-500",
  cancelled:
    "bg-red-500/10 text-red-500",
};

const statusLabels: Record<SessionStatus, string> = {
  planned: "Planned",
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function SessionOverview({
  session,
}: SessionOverviewProps) {
  const stats = [
    {
      label: "Training Day",
      value: session.day,
      icon: CalendarDays,
    },
    {
      label: "Duration",
      value: `${session.duration} min`,
      icon: Clock,
    },
    {
      label: "Training Blocks",
      value: session.blocks.length,
      icon: Layers,
    },
    {
      label: "Equipment Types",
      value: session.equipment.length,
      icon: Package,
    },
  ];

  return (
    <motion.section
      key={session.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5 rounded-2xl border bg-card p-5 shadow-sm md:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
            {session.category}
          </span>

          <span className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold">
            Week {session.week}
          </span>
        </div>

        <span
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold",
            statusStyles[session.status]
          )}
        >
          {statusLabels[session.status]}
        </span>
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">
          {session.title}
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {session.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border bg-background/50 p-4"
            >
              <Icon className="mb-3 h-5 w-5 text-primary" />

              <p className="text-lg font-bold">
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />

          <h3 className="text-sm font-semibold">
            Fitness Focus
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {session.focus.map((focus) => (
            <span
              key={focus}
              className="rounded-lg border bg-muted/50 px-3 py-1.5 text-xs font-medium"
            >
              {focus}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

        <div>
          <p className="text-sm font-semibold">
            Post-Basketball Session
          </p>

          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            This session follows{" "}
            {programConfig.basketballTrainingDuration}{" "}
            minutes of basketball practice. Check player
            readiness, provide recovery opportunities,
            and adapt or skip activities when needed.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
