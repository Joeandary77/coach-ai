
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleDot,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { navigationItems } from "@/data/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({
  collapsed,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-dvh shrink-0 flex-col",
        "bg-sidebar text-sidebar-foreground",
        "border-r border-sidebar-border",
        "transition-[width] duration-300 md:flex",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Branding */}
      <div
        className={cn(
          "flex h-20 items-center gap-3 px-5",
          collapsed && "justify-center px-0"
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <CircleDot className="h-6 w-6" />
        </div>

        {!collapsed && (
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Coach<span className="text-primary">AI</span>
            </h1>

            <p className="text-xs text-slate-400">
              Basketball Academy
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-2 overflow-y-auto px-3 py-6"
      >
        {!collapsed && (
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Workspace
          </p>
        )}

        {navigationItems.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            (item.href !== "/" &&
              pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.title : undefined}
              aria-label={item.title}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3",
                "text-sm font-medium transition-colors",
                collapsed && "justify-center",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-slate-300 hover:bg-sidebar-accent hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />

              {!collapsed && (
                <span>{item.title}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar footer */}
      <div className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="mb-3 rounded-xl bg-sidebar-accent p-4">
            <p className="text-sm font-semibold">
              CoachAI Workspace
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Plan. Coach. Improve.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            collapsed ? "Expand sidebar" : "Collapse sidebar"
          }
          aria-expanded={!collapsed}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl p-3",
            "text-sm text-slate-300 transition-colors",
            "hover:bg-sidebar-accent hover:text-white",
            collapsed && "justify-center"
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <>
              <PanelLeftClose className="h-5 w-5" />
              <span>Collapse sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
