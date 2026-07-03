"use client";

import { Profile } from "@/lib/types";
import { subjectList, noteFromPercent } from "@/lib/subjects";
import { SubjectIcon } from "@/lib/subjectIcon";
import { Flame, Trophy, BarChart3, CheckCircle2, XCircle } from "lucide-react";

export default function Stats({ profile }: { profile: Profile }) {
  const attempts = [...profile.attempts].sort((a, b) => b.date.localeCompare(a.date));
  const klausuren = attempts.filter((a) => a.mode === "klausur");
  const passRate =
    klausuren.length > 0
      ? Math.round((klausuren.filter((a) => a.passed).length / klausuren.length) * 100)
      : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-indigo-500" />
        <h1 className="text-xl font-bold">Statistik</h1>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={<Flame className="h-4 w-4 text-orange-500" />} label="Streak" value={`${profile.streakDays} Tage`} />
        <StatCard icon={<Trophy className="h-4 w-4 text-amber-500" />} label="XP" value={`${profile.xp}`} />
        <StatCard
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
          label="Klausuren bestanden"
          value={passRate !== null ? `${passRate}%` : "–"}
        />
        <StatCard icon={<BarChart3 className="h-4 w-4 text-indigo-500" />} label="Durchläufe" value={`${attempts.length}`} />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {subjectList.map((s) => {
          const subAttempts = attempts.filter((a) => a.subject === s.id);
          const avg =
            subAttempts.length > 0
              ? Math.round(subAttempts.reduce((sum, a) => sum + a.percent, 0) / subAttempts.length)
              : 0;
          return (
            <div key={s.id} className="card p-4">
              <div className="mb-2 flex items-center gap-2">
                <SubjectIcon id={s.id} className="h-4 w-4 text-indigo-500" />
                <p className="text-sm font-medium">{s.name}</p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full bg-gradient-to-r ${s.color}`}
                  style={{ width: `${avg}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Ø {avg}% · {subAttempts.length} Durchläufe
              </p>
            </div>
          );
        })}
      </div>

      <p className="mb-3 text-sm font-medium text-slate-500 dark:text-slate-400">Verlauf</p>
      <div className="space-y-2">
        {attempts.length === 0 && (
          <div className="card p-4 text-sm text-slate-400">
            Noch keine Lerneinheiten abgeschlossen. Starte jetzt deine erste Übung!
          </div>
        )}
        {attempts.map((a) => (
          <div key={a.id} className="card flex items-center justify-between gap-3 p-3">
            <div className="flex items-center gap-2.5">
              {a.passed || a.mode !== "klausur" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
              )}
              <div>
                <p className="text-sm font-medium capitalize">
                  {a.subject} · {a.mode}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(a.date).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">
                {a.correct}/{a.total}
              </p>
              {a.mode === "klausur" && (
                <p className="text-xs text-slate-400">Note {a.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="card p-3 text-center">
      <div className="mb-1 flex justify-center">{icon}</div>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}
