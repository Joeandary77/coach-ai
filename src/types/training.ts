export * from "@/types/fitness";

import type {
  AgeCategory,
  Equipment,
  Exercise,
  ExerciseDifficulty,
  FitnessFocus,
  SessionStatus,
} from "@/types/fitness";

export type TrainingDomain = "basketball" | "fitness";

export type BasketballAgeGroup =
  | "U8"
  | "U10"
  | "U8-10"
  | "U12 (B)"
  | "U12 (A)"
  | "U14-16";

export type UnifiedAgeCategory = AgeCategory | BasketballAgeGroup;

export type TrainingDay = "Wednesday" | "Thursday" | "Saturday";

export type BasketballFocus =
  | "Ball Handling"
  | "Footwork"
  | "Passing"
  | "Catching"
  | "Off-Ball Movement"
  | "Finishing"
  | "Shooting"
  | "Defense"
  | "Team Concepts"
  | "Conditioning";

export type BasketballEquipment =
  | "Basketballs"
  | "Cones"
  | "Chairs"
  | "Backboard tape"
  | "Bumping pads"
  | "Lower baskets";

export type BasketballBlockPart =
  | "Warm-up"
  | "Skill 1"
  | "Skill 2"
  | "Game"
  | "Cool-down & Talk";

export interface CoachRule {
  id: number;
  title: string;
  description: string;
}

export interface BasketballAgeGroupInfo {
  id: BasketballAgeGroup;
  title: string;
  cohort: AgeCategory;
  trainingDays: TrainingDay[];
  focusSummary: string;
  weeklySessionCount: number;
  totalMonthSessions: number;
}

export interface BasketballWeekOverview {
  week: number;
  dateRange: string;
  theme: string;
  rationale: string;
}

export interface BasketballActivityBlock {
  id: string;
  part: BasketballBlockPart;
  startMinute: number;
  endMinute: number;
  durationMinutes: number;
  activityTitle: string;
  howToDoIt: string;
  coachSays: string;
  focus: BasketballFocus[];
  derivedEquipment: BasketballEquipment[];
  isConditioning?: boolean;
}

export interface BasketballSession {
  id: string;
  month: number;
  week: number;
  dateLabel: string;
  day: TrainingDay;
  ageGroup: BasketballAgeGroup;
  cohort: AgeCategory;
  title: string;
  goal: string;
  duration: number;
  waterBreakSeconds: number;
  status: SessionStatus;
  focus: BasketballFocus[];
  blocks: BasketballActivityBlock[];
  equipment: BasketballEquipment[];
  successLooksLike: string;
  source: "pdf_month1_foundations";
}

export interface BasketballDrill {
  id: string;
  name: string;
  sessionId: string;
  sessionTitle: string;
  week: number;
  part: BasketballBlockPart;
  durationMinutes: number;
  ageGroups: BasketballAgeGroup[];
  cohorts: AgeCategory[];
  focus: BasketballFocus[];
  equipment: BasketballEquipment[];
  difficulty: ExerciseDifficulty;
  instructions: string;
  coachingCues: string;
  source: "pdf_month1_foundations";
}

export interface SkillChecklistGroup {
  id: "U8" | "U10" | "U12" | "U14-16";
  title: string;
  skills: string[];
}

export interface UnifiedLibraryItem {
  id: string;
  domain: TrainingDomain;
  name: string;
  description: string;
  focus: (FitnessFocus | BasketballFocus)[];
  equipment: (Equipment | BasketballEquipment)[];
  difficulty: ExerciseDifficulty;
  ageLabels: string[];
  cohorts: AgeCategory[];
  instructions: string[];
  coachingNotes: string[];
  durationMinutes?: number;
  source: "academy_fitness" | "pdf_month1_foundations";
  rawExercise?: Exercise;
  rawDrill?: BasketballDrill;
}