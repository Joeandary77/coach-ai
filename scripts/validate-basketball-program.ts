import {
  basketballProgramConfig,
  basketballWeeks,
  coachRules,
  endOfMonthChecklists,
} from "../src/data/basketball-program";
import {
  allBasketballSessions,
  basketballDrills,
} from "../src/data/basketball-sessions-w3-w4";
import { exercises } from "../src/data/exercises";
import { unifiedLibrary } from "../src/data/unified-library";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`VALIDATION FAILED: ${message}`);
  }
}

function runValidation() {
  console.log("Running CoachAI Phase 3 Unified Knowledge Base validation...");

  // 1. Basketball program structure
  assert(
    allBasketballSessions.length === 36,
    `Expected 36 basketball sessions, got ${allBasketballSessions.length}`
  );
  assert(
    basketballWeeks.length === 4,
    `Expected 4 basketball weeks, got ${basketballWeeks.length}`
  );
  assert(
    coachRules.length === 4,
    `Expected 4 coach rules, got ${coachRules.length}`
  );
  assert(
    endOfMonthChecklists.length === 4,
    `Expected 4 end-of-month checklists, got ${endOfMonthChecklists.length}`
  );

  // 2. Verify every session is 60 minutes with 5 blocks
  for (const session of allBasketballSessions) {
    assert(
      session.blocks.length === 5,
      `Session ${session.id} expected 5 blocks, got ${session.blocks.length}`
    );
    const blockMinutes = session.blocks.reduce(
      (sum, b) => sum + b.durationMinutes,
      0
    );
    assert(
      blockMinutes === basketballProgramConfig.sessionDuration,
      `Session ${session.id} block sum is ${blockMinutes}, expected 60`
    );
  }

  // 3. Verify fitness equipment rules (no basketballs, no skipping ropes)
  const forbiddenEquipment = ["basketball", "skipping rope", "jump rope"];
  for (const exercise of exercises) {
    const equipmentText = exercise.equipment.join(" ").toLowerCase();

    for (const term of forbiddenEquipment) {
      assert(
        !equipmentText.includes(term),
        `Fitness exercise "${exercise.id}" includes forbidden equipment "${term}"`
      );
    }
    assert(
      exercise.instructions.length >= 3 &&
        !exercise.instructions[0].startsWith(
          "Review the activity with the supervising coach"
        ),
      `Fitness exercise "${exercise.id}" still has placeholder instructions`
    );
  }

  // 4. Verify unified library totals
  assert(
    unifiedLibrary.length === basketballDrills.length + exercises.length,
    `Unified library count mismatch`
  );

  console.log(
    `ALL CHECKS PASSED: ${allBasketballSessions.length} basketball sessions, ${basketballDrills.length} basketball drills, ${exercises.length} enriched fitness exercises (${unifiedLibrary.length} total items).`
  );
}

runValidation();