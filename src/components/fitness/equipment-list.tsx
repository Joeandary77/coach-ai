
"use client";

import { useState } from "react";

import {
  Package,
  Check,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

import type { Equipment } from "@/types/fitness";
import { cn } from "@/lib/utils";

interface EquipmentListProps {
  equipment: Equipment[];
}

export function EquipmentList({
  equipment,
}: EquipmentListProps) {
  const [checked, setChecked] = useState<Equipment[]>([]);

  const completed = equipment.filter((item) =>
    checked.includes(item)
  ).length;

  const progress =
    equipment.length > 0
      ? (completed / equipment.length) * 100
      : 100;

  function toggleEquipment(item: Equipment) {
    setChecked((previous) =>
      previous.includes(item)
        ? previous.filter((value) => value !== item)
        : [...previous, item]
    );
  }

  return (
    <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Package className="h-5 w-5" />
        </div>

        <div className="flex-1">
          <h2 className="font-bold">
            Equipment Checklist
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Prepare the selected session.
          </p>
        </div>

        <button
          type="button"
          title="Reset checklist"
          aria-label="Reset equipment checklist"
          onClick={() => setChecked([])}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">
            Preparation progress
          </span>

          <span className="font-semibold">
            {completed}/{equipment.length}
          </span>
        </div>

        <div
          role="progressbar"
          aria-label="Equipment preparation progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          className="h-2 overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {equipment.map((item) => {
          const selected = checked.includes(item);

          return (
            <button
              key={item}
              type="button"
              role="checkbox"
              aria-checked={selected}
              onClick={() => toggleEquipment(item)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                selected
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "hover:bg-muted/50"
              )}
            >
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                  selected
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-muted-foreground/40"
                )}
              >
                {selected && (
                  <Check className="h-3.5 w-3.5" />
                )}
              </div>

              <span
                className={cn(
                  "text-sm font-medium",
                  selected &&
                    "text-muted-foreground line-through"
                )}
              >
                {item}
              </span>
            </button>
          );
        })}
      </div>

      {completed === equipment.length && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-5 w-5 shrink-0" />

          <p className="text-xs font-semibold">
            Equipment checklist complete.
          </p>
        </div>
      )}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Equipment is generated automatically from the
        selected session&apos;s exercise options.
      </p>
    </section>
  );
}
