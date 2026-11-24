
import type { Metadata } from "next";

import { ExerciseLibraryView } from "@/components/exercises/exercise-library-view";

export const metadata: Metadata = {
  title: "Exercise Library | CoachAI",
  description:
    "Explore the academy's fitness exercises and coaching resources.",
};

export default function ExerciseLibraryPage() {
  return <ExerciseLibraryView />;
}
