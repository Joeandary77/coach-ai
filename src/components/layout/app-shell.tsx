
"use client";

import { useState } from "react";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileNav } from "./mobile-nav";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({
  children,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-dvh w-full bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 px-4 pt-5 pb-[calc(6rem+env(safe-area-inset-bottom))] md:p-8">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
