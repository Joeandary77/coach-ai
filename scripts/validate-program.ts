
import {
  fitnessSessions,
  validateFitnessProgram,
  getFitnessSession,
  getSessionTimeline,
} from "../src/data/fitness-program";

import { exercises } from "../src/data/exercises";

console.log("\n=== COACHAI PROGRAM VALIDATION ===\n");

console.log("Exercise entries:", exercises.length);
console.log("Fitness sessions:", fitnessSessions.length);

const exerciseIds = exercises.map(
  (exercise) => exercise.id
);

const duplicateIds = exerciseIds.filter(
  (id, index) => exerciseIds.indexOf(id) !== index
);

const result = validateFitnessProgram();

console.log("\nProgram validation:", result.valid);
console.log("Errors:", result.errors.length);
console.log("Warnings:", result.warnings.length);
console.log("Duplicate exercise IDs:", duplicateIds.length);

if (result.errors.length > 0) {
  console.log("\nValidation errors:");

  result.errors.forEach((error) =>
    console.error("-", error)
  );
}

if (result.warnings.length > 0) {
  console.log("\nValidation warnings:");

  result.warnings.forEach((warning) =>
    console.warn("-", warning)
  );
}

console.log("\n=== SESSION SUMMARY ===\n");

console.table(
  fitnessSessions.map((session) => ({
    ID: session.id,
    Category: session.category,
    Week: session.week,
    Duration: session.duration,
    Blocks: session.blocks.length,
    Equipment: session.equipment.length,
  }))
);

const sample = getFitnessSession("U12", 1);

if (sample) {
  console.log("\n=== SAMPLE SESSION TIMELINE ===\n");

  console.table(
    getSessionTimeline(sample).map((block) => ({
      Block: block.title,
      Start: block.startMinute,
      End: block.endMinute,
      Minutes: block.durationMinutes,
      Exercises: block.exercises.length,
    }))
  );

  console.log("\nEquipment:", sample.equipment);
}

if (!result.valid || duplicateIds.length > 0) {
  console.error("\nVALIDATION FAILED");
  process.exitCode = 1;
} else {
  console.log("\nALL STRUCTURAL VALIDATION CHECKS PASSED");
}
