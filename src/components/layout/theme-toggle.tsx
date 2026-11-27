"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark =
    mounted &&
    (resolvedTheme === "dark" ||
      document.documentElement.classList.contains("dark"));

  function toggleTheme() {
    const next = isDark ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background text-foreground transition-colors hover:bg-accent"
      aria-label="Toggle color theme"
      title="Toggle color theme"
    >
      {isDark ? (
        <Moon className="h-5 w-5 text-orange-400" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
}