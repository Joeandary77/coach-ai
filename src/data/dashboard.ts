import type {
  CategoryInfo,
  ProgramWeek,
  ProgramStats,
} from "@/types/fitness";

export const programConfig = {
  totalWeeks: 4,
  sessionDuration: 30,
  basketballTrainingDuration: 60,
  trainingDay: "Saturday",
  excludedEquipment: [
    "Basketballs",
    "Skipping ropes",
  ],
};

export const basketballDashboardStats = {
  monthTitle: "Month 1: Foundations",
  totalGroups: 5,
  totalSessions: 36,
  completedSessions: 0,
  sessionDuration: 60,
  totalWeeks: 4,
  trainingDays: ["Wednesday", "Thursday", "Saturday"],
};

export const categories: CategoryInfo[] = [
  {
    id: "U8",
    title: "Under 8",
    description:
      "Fun movement activities and fundamental motor skills.",
    totalSessions: 4,
    completedSessions: 0,
    sessionDuration: programConfig.sessionDuration,
    focus: [
      "Coordination",
      "Balance",
      "Agility",
    ],
  },
  {
    id: "U10",
    title: "Under 10",
    description:
      "Developing movement confidence and fundamental fitness skills.",
    totalSessions: 4,
    completedSessions: 0,
    sessionDuration: programConfig.sessionDuration,
    focus: [
      "Speed",
      "Coordination",
      "Balance",
    ],
  },
  {
    id: "U12",
    title: "Under 12",
    description:
      "Developing movement technique and controlled physical skills.",
    totalSessions: 4,
    completedSessions: 0,
    sessionDuration: programConfig.sessionDuration,
    focus: [
      "Agility",
      "Strength",
      "Coordination",
    ],
  },
  {
    id: "U14",
    title: "Under 14",
    description:
      "Building controlled athletic movement and age-appropriate fitness.",
    totalSessions: 4,
    completedSessions: 0,
    sessionDuration: programConfig.sessionDuration,
    focus: [
      "Strength",
      "Speed",
      "Agility",
    ],
  },
];

export const programWeeks: ProgramWeek[] = Array.from(
  { length: programConfig.totalWeeks },
  (_, index) => ({
    id: index + 1,
    title: `Week ${index + 1}`,
    day: programConfig.trainingDay,
    totalSessions: categories.length,
    completedSessions: 0,
    status: "planned",
  })
);

export const programStats: ProgramStats = {
  totalCategories: categories.length,

  totalSessions: categories.reduce(
    (total, category) =>
      total + category.totalSessions,
    0
  ),

  completedSessions: categories.reduce(
    (total, category) =>
      total + category.completedSessions,
    0
  ),

  sessionDuration: programConfig.sessionDuration,

  totalWeeks: programConfig.totalWeeks,
};

export const quickActions = [
  {
    title: "Basketball Program",
    description: "Explore 36 court sessions & Month 1 skill checklists.",
    href: "/basketball-program",
  },
  {
    title: "Fitness Program",
    description: "Explore the 16 Saturday post-practice fitness sessions.",
    href: "/fitness-program",
  },
  {
    title: "Drill & Exercise Library",
    description: "Browse basketball drills and fitness exercises.",
    href: "/exercise-library",
  },
  {
    title: "Start Live Session",
    description: "Open the court-side coaching timer workspace.",
    href: "/live-session",
  },
];

export const suggestedPrompts = [
  "Suggest a U10 ball-handling and passing session.",
  "Explain the 4-Out Motion Offense drill for U12 (A).",
  "Adapt a Saturday fitness session for tired players.",
  "Help me organize a combined 90-minute U12 practice.",
];