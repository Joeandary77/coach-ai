
import type {
  AgeCategory,
  Equipment,
  FitnessFocus,
  FitnessSession,
  SessionExercise,
  TrainingBlock,
  TrainingBlockType,
} from "@/types/fitness";

import { academySessionPlans } from "@/data/session-plans";
import { getExerciseById } from "@/data/exercises";
import { programConfig } from "@/data/dashboard";

export const ageCategories: AgeCategory[] = [
  "U8",
  "U10",
  "U12",
  "U14",
];

export const weekThemes = [
  "Athletic Foundations",
  "Speed, Agility & Reaction",
  "Strength, Stability & Body Control",
  "Combined Athletic Challenges",
];

interface BlockTemplate {
  type: TrainingBlockType;
  title: string;
  durationMinutes: number;
}

export const blockTemplates: BlockTemplate[] = [
  {
    type: "recovery",
    title: "Hydration & Recovery",
    durationMinutes: 3,
  },
  {
    type: "speed-agility",
    title: "Speed & Agility",
    durationMinutes: 6,
  },
  {
    type: "strength",
    title: "Bodyweight Strength",
    durationMinutes: 6,
  },
  {
    type: "coordination-balance",
    title: "Coordination & Balance",
    durationMinutes: 6,
  },
  {
    type: "movement-game",
    title: "Optional Movement Game",
    durationMinutes: 4,
  },
  {
    type: "cooldown",
    title: "Mobility & Cooldown",
    durationMinutes: 5,
  },
];

export const sessionSafetyNotes = [
  "Check player readiness after basketball practice.",
  "All blocks include rest, demonstrations and transitions.",
  "Activities are optional and may be shortened or skipped.",
  "Prioritize technique, enjoyment and comfortable movement.",
  "Provide water and additional recovery whenever needed.",
  "Stop activities if players experience pain, dizziness or unusual breathlessness.",
  "Adult supervision is required.",
];

export interface SessionPlan {
  category: AgeCategory;
  week: number;
  description: string;
  exercises: Partial<
    Record<TrainingBlockType, SessionExercise[]>
  >;
}

export function createSessionId(
  category: AgeCategory,
  week: number
): string {
  return `${category.toLowerCase()}-week-${week}`;
}

export function getSessionEquipment(
  blocks: TrainingBlock[]
): Equipment[] {
  const equipment = new Set<Equipment>();

  for (const block of blocks) {
    for (const item of block.exercises) {
      const exercise = getExerciseById(item.exerciseId);

      if (exercise) {
        exercise.equipment.forEach((value) =>
          equipment.add(value)
        );
      }
    }
  }

  return Array.from(equipment).sort();
}

export function getSessionFocus(
  blocks: TrainingBlock[]
): FitnessFocus[] {
  const focus = new Set<FitnessFocus>();

  for (const block of blocks) {
    for (const item of block.exercises) {
      const exercise = getExerciseById(item.exerciseId);

      if (exercise) {
        exercise.focus.forEach((value) =>
          focus.add(value)
        );
      }
    }
  }

  return Array.from(focus);
}

export function createTrainingBlocks(
  sessionId: string,
  plan: SessionPlan
): TrainingBlock[] {
  return blockTemplates.map((template) => ({
    id: `${sessionId}-${template.type}`,
    type: template.type,
    title: template.title,
    durationMinutes: template.durationMinutes,
    exercises: plan.exercises[template.type] ?? [],
    coachingNotes: [
      "Include rest and transitions within this block.",
      "Adapt activities to player readiness.",
    ],
  }));
}

export function createFitnessSession(
  plan: SessionPlan
): FitnessSession {
  const id = createSessionId(
    plan.category,
    plan.week
  );

  const blocks = createTrainingBlocks(id, plan);

  return {
    id,
    category: plan.category,
    week: plan.week,
    title:
      weekThemes[plan.week - 1] ?? "Fitness Session",
    description: plan.description,
    day: programConfig.trainingDay,
    duration: blocks.reduce(
      (total, block) =>
        total + block.durationMinutes,
      0
    ),
    status: "planned",
    focus: getSessionFocus(blocks),
    blocks,
    equipment: getSessionEquipment(blocks),
    coachingNotes: [...sessionSafetyNotes],
  };
}

// Actual session content will be added after
// the exercise library has been expanded.

export const sessionPlans: SessionPlan[] =
  academySessionPlans;

export const fitnessSessions: FitnessSession[] =
  sessionPlans.map(createFitnessSession);

// Retrieve a specific session.
export function getFitnessSession(
  category: AgeCategory,
  week: number
): FitnessSession | undefined {
  return fitnessSessions.find(
    (session) =>
      session.category === category &&
      session.week === week
  );
}

// Retrieve all sessions for an age category.
export function getSessionsByCategory(
  category: AgeCategory
): FitnessSession[] {
  return fitnessSessions.filter(
    (session) => session.category === category
  );
}

// Retrieve all sessions for a specific week.
export function getSessionsByWeek(
  week: number
): FitnessSession[] {
  return fitnessSessions.filter(
    (session) => session.week === week
  );
}

// Retrieve a session by its unique ID.
export function getSessionById(
  id: string
): FitnessSession | undefined {
  return fitnessSessions.find(
    (session) => session.id === id
  );
}

// Calculate the start and end of each block.
export function getSessionTimeline(
  session: FitnessSession
) {
  let elapsedMinutes = 0;

  return session.blocks.map((block) => {
    const startMinute = elapsedMinutes;

    elapsedMinutes += block.durationMinutes;

    return {
      ...block,
      startMinute,
      endMinute: elapsedMinutes,
    };
  });
}


export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateFitnessSession(
  session: FitnessSession
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!ageCategories.includes(session.category)) {
    errors.push("Invalid age category.");
  }

  if (
    !Number.isInteger(session.week) ||
    session.week < 1 ||
    session.week > programConfig.totalWeeks
  ) {
    errors.push("Invalid program week.");
  }

  const totalDuration = session.blocks.reduce(
    (total, block) =>
      total + block.durationMinutes,
    0
  );

  if (
    totalDuration !== programConfig.sessionDuration
  ) {
    errors.push(
      `Expected 30 minutes, received ${totalDuration}.`
    );
  }

  if (session.duration !== totalDuration) {
    errors.push("Session duration does not match its blocks.");
  }

  if (session.blocks.length !== blockTemplates.length) {
    errors.push("Incorrect number of training blocks.");
  }

  for (const template of blockTemplates) {
    const matchingBlocks = session.blocks.filter(
      (block) => block.type === template.type
    );

    if (matchingBlocks.length !== 1) {
      errors.push(
        `Expected exactly one ${template.type} block.`
      );
      continue;
    }

    if (
      matchingBlocks[0].durationMinutes !==
      template.durationMinutes
    ) {
      errors.push(
        `Incorrect duration for ${template.title}.`
      );
    }
  }

  for (const block of session.blocks) {
    if (block.exercises.length === 0) {
      warnings.push(
        `${block.title} has no exercise options.`
      );
    }

    for (const item of block.exercises) {
      const exercise = getExerciseById(
        item.exerciseId
      );

      if (!exercise) {
        errors.push(
          `Exercise not found: ${item.exerciseId}`
        );

        continue;
      }

      if (
        !exercise.suitableCategories.includes(
          session.category
        )
      ) {
        errors.push(
          `${exercise.name} is not approved for ${session.category}.`
        );
      }

      for (const equipment of exercise.equipment) {
        if (
          programConfig.excludedEquipment.some(
            (excluded) =>
              excluded.toLowerCase() ===
              equipment.toLowerCase()
          )
        ) {
          errors.push(
            `Excluded equipment: ${equipment}`
          );
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateFitnessProgram(
  sessions: FitnessSession[] = fitnessSessions
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const expectedSessions =
    ageCategories.length * programConfig.totalWeeks;

  if (sessions.length !== expectedSessions) {
    errors.push(
      `Expected ${expectedSessions} sessions, received ${sessions.length}.`
    );
  }

  const ids = new Set<string>();

  for (const session of sessions) {
    if (ids.has(session.id)) {
      errors.push(
        `Duplicate session ID: ${session.id}`
      );
    }

    ids.add(session.id);

    const result = validateFitnessSession(session);

    errors.push(
      ...result.errors.map(
        (error) => `${session.id}: ${error}`
      )
    );

    warnings.push(
      ...result.warnings.map(
        (warning) => `${session.id}: ${warning}`
      )
    );
  }

  for (const category of ageCategories) {
    for (
      let week = 1;
      week <= programConfig.totalWeeks;
      week++
    ) {
      const matches = sessions.filter(
        (session) =>
          session.category === category &&
          session.week === week
      );

      if (matches.length !== 1) {
        errors.push(
          `Expected one session for ${category}, Week ${week}.`
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
