import {
  LayoutDashboard,
  Trophy,
  CalendarDays,
  Dumbbell,
  Timer,
  Sparkles,
  Wand2,
  Calendar,
  ClipboardList,
  UserCircle2,
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
    title: "Basketball Program",
    shortTitle: "Basketball",
    href: "/basketball-program",
    icon: Trophy,
  },
  {
    title: "Fitness Program",
    shortTitle: "Fitness",
    href: "/fitness-program",
    icon: CalendarDays,
  },
  {
    title: "Drill & Exercise Library",
    shortTitle: "Library",
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
    title: "Session Generator",
    shortTitle: "Generator",
    href: "/session-generator",
    icon: Wand2,
  },
  {
    title: "Training Calendar",
    shortTitle: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Session Reports",
    shortTitle: "Reports",
    href: "/reports",
    icon: ClipboardList,
  },
  {
    title: "Coach Profile",
    shortTitle: "Profile",
    href: "/login",
    icon: UserCircle2,
  },
  {
    title: "Settings",
    shortTitle: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export const mobileNavigationItems = navigationItems.filter((item) =>
  ["/", "/basketball-program", "/live-session", "/ai-coach"].includes(item.href)
);

export const mobileMoreItems = navigationItems.filter((item) =>
  [
    "/fitness-program",
    "/exercise-library",
    "/session-generator",
    "/calendar",
    "/reports",
    "/login",
    "/settings",
  ].includes(item.href)
);