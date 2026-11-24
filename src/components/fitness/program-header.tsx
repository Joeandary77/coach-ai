
"use client";

import {
  CalendarDays,
  CalendarRange,
  Clock,
  Layers,
} from "lucide-react";

import { motion } from "motion/react";
import { programConfig } from "@/data/dashboard";
import { fitnessSessions } from "@/data/fitness-program";

export function ProgramHeader() {
  const stats = [
    {
      label: "Program Duration",
      value: `${programConfig.totalWeeks} Weeks`,
      icon: CalendarRange,
    },
    {
      label: "Total Sessions",
      value: fitnessSessions.length,
      icon: Layers,
    },
    {
      label: "Session Duration",
      value: `${programConfig.sessionDuration} Min`,
      icon: Clock,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl bg-[#14213D] p-5 text-white shadow-sm md:p-8"
    >
      {/* Decorative court pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border-40 border-white/5"
      />

      <div className="relative z-10 space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 md:h-14 md:w-14">
            <CalendarDays className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">
              Athletic Development
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              Fitness Program
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
              Explore and manage the four-week fitness
              program for every academy age category.
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
                <Icon className="mb-2 h-4 w-4 text-orange-400 md:h-5 md:w-5" />

                <p className="text-lg font-bold md:text-2xl">
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
