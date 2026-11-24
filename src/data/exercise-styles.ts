
import {
  Dumbbell,
  Zap,
  Footprints,
  Activity,
  Target,
  HeartPulse,
  StretchHorizontal,
  Droplets,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type { FitnessFocus } from "@/types/fitness";

interface ExerciseStyle {
  icon: LucideIcon;
  color: string;
  background: string;
}

export const focusStyles: Record<
  FitnessFocus,
  ExerciseStyle
> = {
  Strength: {
    icon: Dumbbell,
    color: "text-orange-500",
    background: "bg-orange-500/10",
  },
  Speed: {
    icon: Zap,
    color: "text-yellow-500",
    background: "bg-yellow-500/10",
  },
  Agility: {
    icon: Footprints,
    color: "text-blue-500",
    background: "bg-blue-500/10",
  },
  Coordination: {
    icon: Target,
    color: "text-violet-500",
    background: "bg-violet-500/10",
  },
  Balance: {
    icon: Activity,
    color: "text-emerald-500",
    background: "bg-emerald-500/10",
  },
  Endurance: {
    icon: HeartPulse,
    color: "text-rose-500",
    background: "bg-rose-500/10",
  },
  Mobility: {
    icon: StretchHorizontal,
    color: "text-cyan-500",
    background: "bg-cyan-500/10",
  },
  Recovery: {
    icon: Droplets,
    color: "text-slate-500",
    background: "bg-slate-500/10",
  },
};
