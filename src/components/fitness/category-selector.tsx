
"use client";

import { Users, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

import { categories } from "@/data/dashboard";
import type { AgeCategory } from "@/types/fitness";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  selectedCategory: AgeCategory;
  onCategoryChange: (category: AgeCategory) => void;
}

const categoryStyles: Record<
  AgeCategory,
  {
    icon: string;
    active: string;
    text: string;
  }
> = {
  U8: {
    icon: "bg-emerald-500/10 text-emerald-500",
    active: "border-emerald-500 bg-emerald-500/5",
    text: "text-emerald-500",
  },
  U10: {
    icon: "bg-blue-500/10 text-blue-500",
    active: "border-blue-500 bg-blue-500/5",
    text: "text-blue-500",
  },
  U12: {
    icon: "bg-orange-500/10 text-orange-500",
    active: "border-orange-500 bg-orange-500/5",
    text: "text-orange-500",
  },
  U14: {
    icon: "bg-violet-500/10 text-violet-500",
    active: "border-violet-500 bg-violet-500/5",
    text: "text-violet-500",
  },
};

export function CategorySelector({
  selectedCategory,
  onCategoryChange,
}: CategorySelectorProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold tracking-tight">
          Age Category
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Select the age group you want to manage.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {categories.map((category, index) => {
          const selected =
            selectedCategory === category.id;

          const styles = categoryStyles[category.id];

          return (
            <motion.button
              key={category.id}
              type="button"
              aria-pressed={selected}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                onCategoryChange(category.id)
              }
              className={cn(
                "relative rounded-2xl border-2 bg-card p-4 text-left shadow-sm transition-colors",
                selected
                  ? styles.active
                  : "border-border hover:border-primary/40"
              )}
            >
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    styles.icon
                  )}
                >
                  <Users className="h-5 w-5" />
                </div>

                {selected && (
                  <CheckCircle2
                    className={cn(
                      "h-5 w-5",
                      styles.text
                    )}
                  />
                )}
              </div>

              <h3
                className={cn(
                  "mt-3 text-xl font-bold",
                  styles.text
                )}
              >
                {category.id}
              </h3>

              <p className="mt-1 text-sm font-medium">
                {category.title}
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                {category.totalSessions} sessions
              </p>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
