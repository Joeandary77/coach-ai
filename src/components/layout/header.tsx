
"use client";

import { usePathname } from "next/navigation";
import { CircleDot } from "lucide-react";

import { navigationItems } from "@/data/navigation";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const pathname = usePathname();

  const currentPage = navigationItems.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/" &&
        pathname.startsWith(`${item.href}/`))
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/95 px-4 backdrop-blur md:h-20 md:px-8">
      {/* Desktop page title */}
      <div className="hidden md:block">
        <h2 className="text-xl font-bold tracking-tight">
          {currentPage?.title ?? "CoachAI"}
        </h2>

        <p className="text-xs text-muted-foreground">
          Basketball Academy Workspace
        </p>
      </div>

      {/* Mobile branding */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <CircleDot className="h-5 w-5" />
        </div>

        <h1 className="text-xl font-bold">
          Coach<span className="text-primary">AI</span>
        </h1>
      </div>

      {/* Header controls */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div className="hidden h-8 w-px bg-border sm:block" />

        {/* Coach profile */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
            C
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold">
              Coach
            </p>

            <p className="text-xs text-muted-foreground">
              Academy Workspace
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
