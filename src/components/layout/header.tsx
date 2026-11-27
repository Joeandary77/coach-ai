"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleDot, LogIn } from "lucide-react";

import { navigationItems } from "@/data/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const pathname = usePathname();
  const { coach } = useAuth();

  const currentPage = navigationItems.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(`${item.href}/`))
  );

  const initials = coach
    ? coach.full_name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "C";

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
        {coach ? (
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-muted"
            title="Manage Coach Profile"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
              {initials}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-tight">
                {coach.full_name}
              </p>

              <p className="text-xs text-muted-foreground">
                {coach.role}
                {coach.assigned_age_groups?.length
                  ? ` · ${coach.assigned_age_groups.join(", ")}`
                  : ""}
              </p>
            </div>
          </Link>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-orange-400"
          >
            <LogIn className="h-4 w-4" />
            <span>Coach Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
}