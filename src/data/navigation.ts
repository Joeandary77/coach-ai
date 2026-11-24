
import {
  LayoutDashboard,
  CalendarDays,
  Dumbbell,
  Timer,
  Sparkles,
  ClipboardList,
  Settings,
} from "lucide-react";

export const navigationItems = [
  {
    title: "Dashboard",
    shortTitle: "Home",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Fitness Program",
    shortTitle: "Program",
    href: "/fitness-program",
    icon: CalendarDays,
  },
  {
    title: "Exercise Library",
    shortTitle: "Exercises",
    href: "/exercise-library",
    icon: Dumbbell,
  },
  {
    title: "Live Session",
    shortTitle: "Live",
    href: "/live-session",
    icon: Timer,
  },
  {
    title: "AI Coach",
    shortTitle: "AI Coach",
    href: "/ai-coach",
    icon: Sparkles,
  },
  {
    title: "Session Reports",
    shortTitle: "Reports",
    href: "/reports",
    icon: ClipboardList,
  },
  {
    title: "Settings",
    shortTitle: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export const mobileNavigationItems = navigationItems.filter(
  (item) =>
    ["/", "/fitness-program", "/live-session", "/ai-coach"].includes(
      item.href
    )
);

export const mobileMoreItems = navigationItems.filter(
  (item) =>
    ["/exercise-library", "/reports", "/settings"].includes(
      item.href
    )
);
