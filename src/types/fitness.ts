
export type AgeCategory = "U8" | "U10" | "U12" | "U14";

export type SessionStatus =
  | "planned"
  | "in-progress"
  | "completed"
  | "cancelled";

export type FitnessFocus =
  | "Strength"
  | "Speed"
  | "Agility"
  | "Coordination"
  | "Balance"
  | "Endurance"
  | "Mobility"
  | "Recovery";

export type Equipment =
  | "Cones"
  | "Agility ladder"
  | "Exercise mats"
  | "Wall"
  | "Floor markers"
  | "Soft balls"
  | "Tennis balls"
  | "Hula hoops"
  | "Whistle"
  | "Stopwatch";

export type TrainingBlockType =
  | "recovery"
  | "speed-agility"
  | "strength"
  | "coordination-balance"
  | "movement-game"
  | "cooldown";

export type ExerciseDifficulty =
  | "Beginner"
  | "Intermediate";

export interface CategoryInfo {
  id: AgeCategory;
  title: string;
  description: string;
  totalSessions: number;
  completedSessions: number;
  sessionDuration: number;
  focus: FitnessFocus[];
}

export interface ProgramWeek {
  id: number;
  title: string;
  day: string;
  totalSessions: number;
  completedSessions: number;
  status: SessionStatus;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  focus: FitnessFocus[];
  equipment: Equipment[];
  difficulty: ExerciseDifficulty;
  suitableCategories: AgeCategory[];
  instructions: string[];
  coachingNotes: string[];
  durationSeconds?: number;
  repetitions?: number;
  sets?: number;
  restSeconds?: number;
}

export interface SessionExercise {
  exerciseId: string;
  durationSeconds?: number;
  repetitions?: number;
  sets?: number;
  restSeconds?: number;
  notes?: string;
}

export interface TrainingBlock {
  id: string;
  type: TrainingBlockType;
  title: string;
  durationMinutes: number;
  exercises: SessionExercise[];
  coachingNotes: string[];
}

export interface FitnessSession {
  id: string;
  category: AgeCategory;
  week: number;
  title: string;
  description: string;
  day: string;
  duration: number;
  status: SessionStatus;
  focus: FitnessFocus[];
  blocks: TrainingBlock[];
  equipment: Equipment[];
  coachingNotes: string[];
}

export interface ProgramStats {
  totalCategories: number;
  totalSessions: number;
  completedSessions: number;
  sessionDuration: number;
  totalWeeks: number;
}
