
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  CalendarDays,
  Timer,
} from "lucide-react";

import { programConfig } from "@/data/dashboard";

export function WelcomeBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl bg-[#14213D] p-6 text-white md:p-8"
    >
      {/* Basketball court decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 opacity-15 sm:block"
      >
        <svg
          viewBox="0 0 300 240"
          className="h-full w-full"
          fill="none"
          stroke="#F97316"
          strokeWidth="2"
        >
          <rect x="40" y="15" width="250" height="210" rx="5" />
          <path d="M165 15V225" />
          <circle cx="165" cy="120" r="35" />
          <rect x="40" y="80" width="65" height="80" />
          <rect x="225" y="80" width="65" height="80" />
          <path d="M40 35 Q230 120 40 205" />
          <path d="M290 35 Q100 120 290 205" />
          <circle cx="55" cy="120" r="6" />
          <circle cx="275" cy="120" r="6" />
        </svg>
      </div>

      {/* Banner content */}
      <div className="relative z-10">
        <span className="inline-flex rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold tracking-wide text-orange-300">
          BASKETBALL ACADEMY
        </span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          Welcome, Coach!
        </h1>

        <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-300 md:text-base">
          Your intelligent workspace for planning fitness
          sessions, supporting player development and
          managing your academy.
        </p>

        {/* Program information */}
        <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-300 sm:text-sm">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            Every {programConfig.trainingDay}
          </div>

          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-primary" />
            {programConfig.sessionDuration}-minute sessions
          </div>
        </div>

        {/* Quick navigation */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/fitness-program"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-orange-400"
          >
            View Fitness Program
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/live-session"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <Timer className="h-4 w-4" />
            Live Session
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
