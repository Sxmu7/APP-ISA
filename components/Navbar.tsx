"use client";

import {
  GraduationCap,
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  Sun,
  Moon,
  LogOut,
  Flame,
  Trophy,
} from "lucide-react";
import { Profile, View } from "@/lib/types";

export default function Navbar({
  profile,
  view,
  onNavigate,
  onToggleTheme,
  onLogout,
}: {
  profile: Profile;
  view: View;
  onNavigate: (v: View) => void;
  onToggleTheme: () => void;
  onLogout: () => void;
}) {
  const isDark = profile.theme === "dark";

  const navItems: { key: View; label: string; icon: React.ReactNode }[] = [
    { key: "dashboard", label: "Übersicht", icon: <LayoutDashboard className="h-4 w-4" /> },
    { key: "calendar", label: "Kalender", icon: <CalendarDays className="h-4 w-4" /> },
    { key: "stats", label: "Statistik", icon: <BarChart3 className="h-4 w-4" /> },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <button
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-2 font-semibold"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <span className="hidden sm:inline">StudyFlow</span>
        </button>

        <nav className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
                view === item.key
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <div className="mr-1 hidden items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400 md:flex">
            <span className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              {profile.streakDays}
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5 text-amber-500" />
              {profile.xp} XP
            </span>
          </div>
          <button onClick={onToggleTheme} className="btn-ghost !px-2.5">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button onClick={onLogout} className="btn-ghost !px-2.5" title="Profil wechseln">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
