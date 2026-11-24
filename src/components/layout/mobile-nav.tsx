
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import {
  mobileNavigationItems,
  mobileMoreItems,
} from "@/data/navigation";

import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  function isActive(href: string) {
    return (
      pathname === href ||
      (href !== "/" && pathname.startsWith(`${href}/`))
    );
  }

  const moreActive = mobileMoreItems.some((item) =>
    isActive(item.href)
  );

  return (
    <div className="md:hidden">
      {/* More menu */}
      {moreOpen && (
        <>
          <button
            type="button"
            aria-label="Close more menu"
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setMoreOpen(false)}
          />

          <div
            id="mobile-more-menu"
            className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 rounded-2xl border bg-card p-4 shadow-xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">
                More options
              </h3>

              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {mobileMoreItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  aria-current={
                    isActive(item.href) ? "page" : undefined
                  }
                  className={cn(
                    "flex items-center gap-3 rounded-xl p-3 text-sm font-medium",
                    isActive(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* Bottom navigation */}
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-sidebar-border bg-sidebar px-2 pb-[env(safe-area-inset-bottom)] text-sidebar-foreground"
      >
        <div className="grid h-18 grid-cols-5 items-center">
          {mobileNavigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMoreOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-xl py-2",
                  active
                    ? "text-primary"
                    : "text-slate-400 hover:text-white"
                )}
              >
                <div
                  className={cn(
                    "rounded-xl px-3 py-1",
                    active && "bg-primary/15"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <span className="text-[10px] font-medium">
                  {item.shortTitle}
                </span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMoreOpen(!moreOpen)}
            aria-expanded={moreOpen}
            aria-controls={
              moreOpen ? "mobile-more-menu" : undefined
            }
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-xl py-2",
              moreActive || moreOpen
                ? "text-primary"
                : "text-slate-400"
            )}
          >
            <div className="rounded-xl px-3 py-1">
              <Menu className="h-5 w-5" />
            </div>

            <span className="text-[10px] font-medium">
              More
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
