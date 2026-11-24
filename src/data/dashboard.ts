
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
    title: "View Fitness Program",
    description: "Explore the four-week training plan.",
    href: "/fitness-program",
  },
  {
    title: "Exercise Library",
    description: "Browse available fitness exercises.",
    href: "/exercise-library",
  },
  {
    title: "Start Live Session",
    description: "Open the session coaching workspace.",
    href: "/live-session",
  },
  {
    title: "Session Reports",
    description: "Review training observations.",
    href: "/reports",
  },
];

export const suggestedPrompts = [
  "Suggest a coordination exercise for U8.",
  "Help me plan a U12 fitness session.",
  "How can I adapt a session for tired players?",
  "Suggest a balance and mobility activity.",
];
