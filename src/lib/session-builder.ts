import { allBasketballSessions, basketballDrills } from "@/data/basketball-sessions-w3-w4";
import { fitnessSessions, getSessionTimeline } from "@/data/fitness-program";
import { getExerciseById, exercises } from "@/data/exercises";
import type { AgeCategory } from "@/types/fitness";
import type {
  BasketballAgeGroup,
  BasketballFocus,
  BasketballSession,
} from "@/types/training";

export type SessionMode = "basketball" | "fitness" | "combined";

export interface LiveTimelineBlock {
  id: string;
  domain: "basketball" | "fitness";
  partLabel: string;
  title: string;
  durationMinutes: number;
  startMinute: number;
  endMinute: number;
  instructions: string[];
  coachingCues: string[];
  equipment: string[];
}

export interface PlayableSession {
  id: string;
  mode: SessionMode;
  title: string;
  subtitle: string;
  ageGroupLabel: string;
  totalDurationMinutes: number;
  equipment: string[];
  blocks: LiveTimelineBlock[];
}

export function basketballSessionToPlayable(
  session: BasketballSession
): PlayableSession {
  const blocks: LiveTimelineBlock[] = session.blocks.map((block) => ({
    id: block.id,
    domain: "basketball",
    partLabel: block.part,
    title: block.activityTitle,
    durationMinutes: block.durationMinutes,
    startMinute: block.startMinute,
    endMinute: block.endMinute,
    instructions: [block.howToDoIt],
    coachingCues: [block.coachSays],
    equipment: [...block.derivedEquipment],
  }));

  return {
    id: session.id,
    mode: "basketball",
    title: session.title,
    subtitle: `Week ${session.week} · ${session.day} (${session.dateLabel})`,
    ageGroupLabel: session.ageGroup,
    totalDurationMinutes: session.duration,
    equipment: [...session.equipment],
    blocks,
  };
}

export function fitnessSessionToPlayable(sessionId: string): PlayableSession | null {
  const session = fitnessSessions.find((s) => s.id === sessionId);
  if (!session) return null;

  const timeline = getSessionTimeline(session);
  const blocks: LiveTimelineBlock[] = timeline.map((block) => {
    const resolvedExercises = block.exercises
      .map((item) => getExerciseById(item.exerciseId))
      .filter((ex): ex is NonNullable<typeof ex> => Boolean(ex));

    const instructions =
      resolvedExercises.length > 0
        ? resolvedExercises.map(
            (ex) => `${ex.name}: ${ex.instructions[0] ?? ex.description}`
          )
        : ["Allow players to rest, hydrate, and prepare for the next block."];

    const coachingCues =
      resolvedExercises.length > 0
        ? resolvedExercises.flatMap((ex) => ex.coachingNotes.slice(0, 1))
        : block.coachingNotes;

    const eqSet = new Set<string>();
    resolvedExercises.forEach((ex) => ex.equipment.forEach((e) => eqSet.add(e)));

    return {
      id: block.id,
      domain: "fitness",
      partLabel: block.title,
      title:
        resolvedExercises.map((e) => e.name).join(" + ") || block.title,
      durationMinutes: block.durationMinutes,
      startMinute: block.startMinute,
      endMinute: block.endMinute,
      instructions,
      coachingCues,
      equipment: Array.from(eqSet),
    };
  });

  return {
    id: session.id,
    mode: "fitness",
    title: `${session.category} Fitness — ${session.title}`,
    subtitle: `Week ${session.week} · Saturday Post-Practice Conditioning`,
    ageGroupLabel: session.category,
    totalDurationMinutes: session.duration,
    equipment: [...session.equipment],
    blocks,
  };
}

export function buildCombinedSaturdaySession(
  basketballSessionId: string,
  fitnessSessionId: string
): PlayableSession | null {
  const bball = allBasketballSessions.find((s) => s.id === basketballSessionId);
  const fit = fitnessSessionToPlayable(fitnessSessionId);
  if (!bball || !fit) return null;

  const bballPlayable = basketballSessionToPlayable(bball);
  const shiftedFitnessBlocks: LiveTimelineBlock[] = fit.blocks.map((block) => ({
    ...block,
    id: `combined-${block.id}`,
    partLabel: `Fitness · ${block.partLabel}`,
    startMinute: block.startMinute + 60,
    endMinute: block.endMinute + 60,
  }));

  const equipmentSet = new Set<string>([
    ...bballPlayable.equipment,
    ...fit.equipment,
  ]);

  return {
    id: `combined-${bball.id}-${fit.id}`,
    mode: "combined",
    title: `${bball.ageGroup} Saturday Full Session (Court + Fitness)`,
    subtitle: `Week ${bball.week} · 60 min Basketball + 30 min Conditioning`,
    ageGroupLabel: bball.ageGroup,
    totalDurationMinutes: 90,
    equipment: Array.from(equipmentSet),
    blocks: [...bballPlayable.blocks, ...shiftedFitnessBlocks],
  };
}

export function mapAgeGroupToCohort(group: BasketballAgeGroup): AgeCategory {
  if (group === "U8" || group === "U8-10") return "U8";
  if (group === "U10") return "U10";
  if (group === "U12 (B)" || group === "U12 (A)") return "U12";
  return "U14";
}

export function generateCustomSession(options: {
  mode: SessionMode;
  ageGroup: BasketballAgeGroup;
  week: number;
  basketballFocus?: BasketballFocus | "ALL";
  seedOffset?: number;
}): PlayableSession {
  const {
    mode,
    ageGroup,
    week,
    basketballFocus = "ALL",
    seedOffset = 0,
  } = options;
  const cohort = mapAgeGroupToCohort(ageGroup);

  const pickRotated = <T,>(items: T[], indexOffset: number): T => {
    const idx = (indexOffset + seedOffset) % items.length;
    return items[idx];
  };

  // Build 60-min basketball blocks
  const buildBasketballBlocks = (): LiveTimelineBlock[] => {
    const cohortDrills = basketballDrills.filter(
      (d) => d.cohorts.includes(cohort) || d.ageGroups.includes(ageGroup)
    );
    const pool = cohortDrills.length > 0 ? cohortDrills : basketballDrills;

    const warmups = pool.filter((d) => d.part === "Warm-up");
    const skills = pool.filter((d) => {
      const isSkill = d.part === "Skill 1" || d.part === "Skill 2";
      if (!isSkill) return false;
      if (basketballFocus === "ALL") return true;
      return d.focus.includes(basketballFocus);
    });
    const skillPool =
      skills.length >= 2
        ? skills
        : pool.filter((d) => d.part === "Skill 1" || d.part === "Skill 2");
    const games = pool.filter((d) => d.part === "Game");
    const cooldowns = pool.filter((d) => d.part === "Cool-down & Talk");

    const w = pickRotated(warmups.length ? warmups : pool, 0);
    const s1 = pickRotated(skillPool.length ? skillPool : pool, 1);
    const s2 = pickRotated(skillPool.length ? skillPool : pool, 2);
    const g = pickRotated(games.length ? games : pool, 3);
    const c = pickRotated(cooldowns.length ? cooldowns : pool, 4);

    const raw = [
      { part: "Warm-up", mins: 8, drill: w },
      { part: "Skill 1", mins: 15, drill: s1 },
      { part: "Skill 2", mins: 15, drill: s2 },
      { part: "Game", mins: 17, drill: g },
      { part: "Cool-down & Talk", mins: 5, drill: c },
    ];

    let cursor = 0;
    return raw.map((item, idx) => {
      const startMinute = cursor;
      cursor += item.mins;
      return {
        id: `gen-bball-${idx}-${item.drill.id}`,
        domain: "basketball",
        partLabel: item.part,
        title: item.drill.name,
        durationMinutes: item.mins,
        startMinute,
        endMinute: cursor,
        instructions: [item.drill.instructions],
        coachingCues: [item.drill.coachingCues],
        equipment: [...item.drill.equipment],
      };
    });
  };

  // Build 30-min fitness blocks (strictly no basketballs / skipping ropes)
  const buildFitnessBlocks = (minuteOffset = 0): LiveTimelineBlock[] => {
    const eligible = exercises.filter((ex) =>
      ex.suitableCategories.includes(cohort)
    );

    const byFocus = (focus: string) => {
      const matches = eligible.filter((ex) =>
        ex.focus.includes(focus as never)
      );
      return matches.length > 0 ? matches : eligible;
    };

    const recovery =
      eligible.find((e) => e.id === "water-recovery") ?? eligible[0];
    const agility = pickRotated(byFocus("Agility"), 1);
    const strength = pickRotated(byFocus("Strength"), 2);
    const balance = pickRotated(byFocus("Balance"), 3);
    const endurance = pickRotated(byFocus("Endurance"), 4);
    const mobility = pickRotated(byFocus("Mobility"), 5);

    const templates = [
      { label: "Hydration & Recovery", mins: 3, ex: recovery },
      { label: "Speed & Agility", mins: 6, ex: agility },
      { label: "Bodyweight Strength", mins: 6, ex: strength },
      { label: "Coordination & Balance", mins: 6, ex: balance },
      { label: "Movement Game", mins: 4, ex: endurance },
      { label: "Mobility & Cooldown", mins: 5, ex: mobility },
    ];

    let cursor = minuteOffset;
    return templates.map((t, idx) => {
      const startMinute = cursor;
      cursor += t.mins;
      return {
        id: `gen-fit-${idx}-${t.ex.id}`,
        domain: "fitness",
        partLabel:
          minuteOffset > 0 ? `Fitness · ${t.label}` : t.label,
        title: t.ex.name,
        durationMinutes: t.mins,
        startMinute,
        endMinute: cursor,
        instructions: t.ex.instructions,
        coachingCues: t.ex.coachingNotes,
        equipment: [...t.ex.equipment],
      };
    });
  };

  if (mode === "basketball") {
    const blocks = buildBasketballBlocks();
    const eq = Array.from(new Set(blocks.flatMap((b) => b.equipment)));
    return {
      id: `custom-basketball-${ageGroup}-w${week}-${seedOffset}`,
      mode: "basketball",
      title: `${ageGroup} Custom Basketball Session`,
      subtitle: `Week ${week} · ${
        basketballFocus === "ALL" ? "Balanced Foundations" : basketballFocus
      } (60 min)`,
      ageGroupLabel: ageGroup,
      totalDurationMinutes: 60,
      equipment: eq,
      blocks,
    };
  }

  if (mode === "fitness") {
    const blocks = buildFitnessBlocks(0);
    const eq = Array.from(new Set(blocks.flatMap((b) => b.equipment)));
    return {
      id: `custom-fitness-${cohort}-w${week}-${seedOffset}`,
      mode: "fitness",
      title: `${cohort} Post-Practice Fitness Session`,
      subtitle: `Week ${week} · 30 min Youth Conditioning (No Basketballs)`,
      ageGroupLabel: cohort,
      totalDurationMinutes: 30,
      equipment: eq,
      blocks,
    };
  }

  const bBlocks = buildBasketballBlocks();
  const fBlocks = buildFitnessBlocks(60);
  const allBlocks = [...bBlocks, ...fBlocks];
  const eq = Array.from(new Set(allBlocks.flatMap((b) => b.equipment)));

  return {
    id: `custom-combined-${ageGroup}-w${week}-${seedOffset}`,
    mode: "combined",
    title: `${ageGroup} Combined Saturday Practice + Fitness`,
    subtitle: `Week ${week} · 60 min Court + 30 min Conditioning`,
    ageGroupLabel: ageGroup,
    totalDurationMinutes: 90,
    equipment: eq,
    blocks: allBlocks,
  };
}