
import assert from "node:assert/strict";

import { exercises } from "../src/data/exercises";

import {
  defaultExerciseFilters,
  filterExercises,
  getAvailableEquipment,
  getActiveFilterCount,
} from "../src/lib/exercise-filters";

import type {
  ExerciseFilters,
} from "../src/lib/exercise-filters";

let passed = 0;
let failed = 0;

function test(
  name: string,
  callback: () => void
) {
  try {
    callback();
    passed++;
    console.log(`PASS: ${name}`);
  } catch (error) {
    failed++;
    console.error(`FAIL: ${name}`);
    console.error(error);
  }
}

function search(
  filters: Partial<ExerciseFilters> = {}
) {
  return filterExercises(exercises, {
    ...defaultExerciseFilters,
    ...filters,
  });
}

console.log("\n=== EXERCISE FILTER VALIDATION ===\n");

test("Default filters return all exercises", () => {
  assert.equal(search().length, exercises.length);
});

test("Search finds Bodyweight Squat", () => {
  const results = search({
    search: "bodyweight squat",
  });

  assert.ok(
    results.some(
      (exercise) =>
        exercise.id === "bodyweight-squat"
    )
  );
});

test("Search is case insensitive", () => {
  assert.deepEqual(
    search({ search: "squat" }),
    search({ search: "SQUAT" })
  );
});

test("Search ignores surrounding whitespace", () => {
  assert.deepEqual(
    search({ search: "squat" }),
    search({ search: "  squat  " })
  );
});

test("U8 category filter works", () => {
  const results = search({
    category: "U8",
  });

  assert.ok(results.length > 0);

  assert.ok(
    results.every((exercise) =>
      exercise.suitableCategories.includes("U8")
    )
  );
});

test("Coordination focus filter works", () => {
  const results = search({
    focus: "Coordination",
  });

  assert.ok(results.length > 0);

  assert.ok(
    results.every((exercise) =>
      exercise.focus.includes("Coordination")
    )
  );
});

test("Equipment filter works", () => {
  const results = search({
    equipment: "Cones",
  });

  assert.ok(results.length > 0);

  assert.ok(
    results.every((exercise) =>
      exercise.equipment.includes("Cones")
    )
  );
});

test("No-equipment filter works", () => {
  const results = search({
    equipment: "none",
  });

  assert.ok(results.length > 0);

  assert.ok(
    results.every(
      (exercise) =>
        exercise.equipment.length === 0
    )
  );
});

test("Difficulty filter works", () => {
  const results = search({
    difficulty: "Intermediate",
  });

  assert.ok(results.length > 0);

  assert.ok(
    results.every(
      (exercise) =>
        exercise.difficulty === "Intermediate"
    )
  );
});

test("Multiple filters work together", () => {
  const results = search({
    category: "U12",
    focus: "Balance",
    equipment: "none",
  });

  assert.ok(results.length > 0);

  assert.ok(
    results.every(
      (exercise) =>
        exercise.suitableCategories.includes("U12") &&
        exercise.focus.includes("Balance") &&
        exercise.equipment.length === 0
    )
  );
});

test("Unmatched search returns no results", () => {
  assert.equal(
    search({
      search: "invalid-exercise-xyz",
    }).length,
    0
  );
});

test("Ascending alphabetical sorting works", () => {
  const names = search({
    sort: "name-asc",
  }).map((exercise) => exercise.name);

  assert.deepEqual(
    names,
    [...names].sort((a, b) =>
      a.localeCompare(b)
    )
  );
});

test("Descending alphabetical sorting works", () => {
  const names = search({
    sort: "name-desc",
  }).map((exercise) => exercise.name);

  assert.deepEqual(
    names,
    [...names].sort((a, b) =>
      b.localeCompare(a)
    )
  );
});

test("Sorting does not modify original database", () => {
  const originalIds = exercises.map(
    (exercise) => exercise.id
  );

  search({ sort: "name-desc" });

  assert.deepEqual(
    exercises.map((exercise) => exercise.id),
    originalIds
  );
});

test("Equipment options contain no duplicates", () => {
  const equipment =
    getAvailableEquipment(exercises);

  assert.equal(
    equipment.length,
    new Set(equipment).size
  );
});

test("Active filter counter works", () => {
  const count = getActiveFilterCount({
    ...defaultExerciseFilters,
    category: "U12",
    focus: "Balance",
    equipment: "none",
  });

  assert.equal(count, 3);
});

console.log("\n=== TEST SUMMARY ===");
console.log("Passed:", passed);
console.log("Failed:", failed);

if (failed > 0) {
  process.exitCode = 1;
} else {
  console.log("\nALL FILTER TESTS PASSED");
}
