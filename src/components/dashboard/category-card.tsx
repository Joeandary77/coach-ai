"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Users,
  ArrowRight,
  CalendarDays,
  Timer,
} from "lucide-react";

import type {
  AgeCategory,
  CategoryInfo,
} from "@/types/fitness";

interface CategoryCardProps {
  category: CategoryInfo;
  index?: number;
}

const categoryStyles: Record<
  AgeCategory,
  {
    icon: string;
    background: string;
    progress: string;
  }
> = {
  U8: {
    icon: "text-emerald-600 dark:text-emerald-400",
    background: "bg-emerald-500/10",
    progress: "bg-emerald-500",
  },
  U10: {
    icon: "text-blue-600 dark:text-blue-400",
    background: "bg-blue-500/10",
    progress: "bg-blue-500",
  },
  U12: {
    icon: "text-orange-600 dark:text-orange-400",
    background: "bg-orange-500/10",
    progress: "bg-orange-500",
  },
  U14: {
    icon: "text-violet-600 dark:text-violet-400",
    background: "bg-violet-500/10",
    progress: "bg-violet-500",
  },
};

export function CategoryCard({
  category,
  index = 0,
}: CategoryCardProps) {
  const styles = categoryStyles[category.id];

  const progress =
    category.totalSessions > 0
      ? Math.round(
          (category.completedSessions /
            category.totalSessions) *
            100
        )
      : 0;

  return (
    <motion.article
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.08,
      }}
      className="group flex h-full flex-col rounded-2xl border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
    >
      {/* Category heading */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${styles.background} ${styles.icon}`}
        >
          <Users className="h-6 w-6" />
        </div>

        <div>
          <h3 className="text-2xl font-bold tracking-tight">
            {category.id}
          </h3>

          <p className="text-xs text-muted-foreground">
            {category.title}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {category.description}
      </p>

      {/* Fitness focus areas */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {category.focus.map((focus) => (
          <span
            key={focus}
            className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
          >
            {focus}
          </span>
        ))}
      </div>

      {/* Session information */}
      <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4" />
          {category.totalSessions} sessions
        </div>

        <div className="flex items-center gap-1.5">
          <Timer className="h-4 w-4" />
          {category.sessionDuration} min
        </div>
      </div>

      {/* Program progress */}
      <div className="mt-auto pt-5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium">
            Program progress
          </span>

          <span className="text-muted-foreground">
            {category.completedSessions}/
            {category.totalSessions}
          </span>
        </div>

        <div
          role="progressbar"
          aria-label={`${category.id} program progress`}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-2 overflow-hidden rounded-full bg-muted"
        >
          <div
            style={{ width: `${progress}%` }}
            className={`h-full rounded-full transition-all duration-500 ${styles.progress}`}
          />
        </div>
      </div>

      {/* Program navigation */}
      <Link
        href={`/fitness-program?category=${category.id}`}
        className="mt-5 flex items-center justify-between rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        View Program

        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </motion.article>
  );
}