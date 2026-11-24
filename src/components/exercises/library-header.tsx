
"use client";

import {
  Dumbbell,
  Layers,
  Users,
  Target,
} from "lucide-react";

import { motion } from "motion/react";
import { exercises } from "@/data/exercises";
import { ageCategories } from "@/data/fitness-program";

export function LibraryHeader() {
  const fitnessAreas = new Set(
    exercises.flatMap((exercise) => exercise.focus)
  );

  const stats = [
    {
      label: "Total Exercises",
      value: exercises.length,
      icon: Layers,
    },
    {
      label: "Age Categories",
      value: ageCategories.length,
      icon: Users,
    },
    {
      label: "Fitness Areas",
      value: fitnessAreas.size,
      icon: Target,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl bg-[#14213D] p-5 text-white shadow-sm md:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border-40 border-white/5"
      />

      <div className="relative z-10 space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 md:h-14 md:w-14">
            <Dumbbell className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">
              Coaching Resources
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              Exercise Library
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
              Explore the academy&apos;s collection of
              fitness exercises, movement activities
              and coaching resources.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-white/5 p-3 md:p-4"
              >
                <Icon className="mb-2 h-5 w-5 text-orange-400" />

                <p className="text-xl font-bold md:text-2xl">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-slate-300">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
