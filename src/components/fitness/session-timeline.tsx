
"use client";

import {
  Droplets,
  Zap,
  Dumbbell,
  Activity,
  Users,
  HeartPulse,
  Clock,
} from "lucide-react";

import { motion } from "motion/react";

import { ExerciseCard } from "./exercise-card";
import { getSessionTimeline } from "@/data/fitness-program";

import type {
  FitnessSession,
  TrainingBlockType,
} from "@/types/fitness";

interface SessionTimelineProps {
  session: FitnessSession;
}

const blockStyles = {
  recovery: {
    icon: Droplets,
    color: "text-slate-500",
    background: "bg-slate-500/10",
    bar: "bg-slate-500",
  },
  "speed-agility": {
    icon: Zap,
    color: "text-blue-500",
    background: "bg-blue-500/10",
    bar: "bg-blue-500",
  },
  strength: {
    icon: Dumbbell,
    color: "text-orange-500",
    background: "bg-orange-500/10",
    bar: "bg-orange-500",
  },
  "coordination-balance": {
    icon: Activity,
    color: "text-emerald-500",
    background: "bg-emerald-500/10",
    bar: "bg-emerald-500",
  },
  "movement-game": {
    icon: Users,
    color: "text-violet-500",
    background: "bg-violet-500/10",
    bar: "bg-violet-500",
  },
  cooldown: {
    icon: HeartPulse,
    color: "text-cyan-500",
    background: "bg-cyan-500/10",
    bar: "bg-cyan-500",
  },
} satisfies Record<
  TrainingBlockType,
  {
    icon: typeof Droplets;
    color: string;
    background: string;
    bar: string;
  }
>;

function formatMinute(minute: number): string {
  return `${String(minute).padStart(2, "0")}:00`;
}

export function SessionTimeline({
  session,
}: SessionTimelineProps) {
  const timeline = getSessionTimeline(session);

  return (
    <section className="min-w-0 space-y-5">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-bold tracking-tight">
            Session Timeline
          </h2>

          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {session.duration} minutes
          </span>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Explore the training blocks and available
          exercise options.
        </p>
      </div>

      {/* Visual timeline */}
      <div
        className="flex h-3 gap-1 overflow-hidden rounded-full"
        aria-label="Session duration breakdown"
      >
        {timeline.map((block) => (
          <div
            key={block.id}
            title={`${block.title}: ${block.durationMinutes} min`}
            className={`${blockStyles[block.type].bar} rounded-full`}
            style={{
              flex: block.durationMinutes,
            }}
          />
        ))}
      </div>

      {/* Training blocks */}
      <div className="space-y-4">
        {timeline.map((block, index) => {
          const styles = blockStyles[block.type];
          const Icon = styles.icon;

          return (
            <motion.article
              key={block.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="space-y-4 rounded-2xl border bg-card p-4 shadow-sm md:p-5"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.background} ${styles.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Block {index + 1}
                  </p>

                  <h3 className="mt-1 font-bold">
                    {block.title}
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatMinute(block.startMinute)}
                    {" – "}
                    {formatMinute(block.endMinute)}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${styles.background} ${styles.color}`}
                >
                  {block.durationMinutes} min
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  {block.exercises.length} activity options
                </p>

                {block.exercises.map((item, index) => (
                  <ExerciseCard
                    key={`${block.id}-${item.exerciseId}-${index}`}
                    item={item}
                  />
                ))}
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Block duration includes demonstrations,
                recovery and transitions. Select suitable
                activities rather than rushing through
                every option.
              </p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
