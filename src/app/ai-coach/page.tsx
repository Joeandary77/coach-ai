
import { AIAssistantPanel } from "@/components/dashboard/ai-assistant-panel";

export default function AICoachPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          AI Coach
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Your intelligent basketball fitness coaching assistant.
        </p>
      </div>

      <AIAssistantPanel fullPage />
    </div>
  );
}
