"use client";

import { Profile, LearnMode, Question, AttemptRecord } from "@/lib/types";
import { subjectList, noteFromPercent } from "@/lib/subjects";
import { questionsBySubject } from "@/lib/questions";
import {
  upcomingExamEvents,
  daysUntil,
  isCardDue,
  parseLocalISODate,
  hideBuiltInSubject,
  restoreBuiltInSubject,
  removeCustomSubject,
} from "@/lib/storage";
import { SubjectIcon } from "@/lib/subjectIcon";
import {
  BookOpen,
  FileCheck2,
  Layers,
  RotateCcw,
  Shuffle,
  CalendarClock,
  TrendingUp,
  FolderPlus,
  FileText,
  EyeOff,
  Eye,
  Trash2,
} from "lucide-react";

interface SubjectCard {
  id: string;
  name: string;
  color: string;
  isBuiltIn: boolean;
  total: number;
  dueCards: number;
  wrongCount: number;
  avgPercent: number | null;
  lastKlausur: AttemptRecord | undefined;
}

export default function Dashboard({
  profile,
  onStart,
  onNavigate,
  onProfileChange,
}: {
  profile: Profile;
  onStart: (subject: string, mode: LearnMode) => void;
  onNavigate: (v: "calendar" | "stats" | "custom") => void;
  onProfileChange: (p: Profile) => void;
}) {
  const nextExams = upcomingExamEvents(profile).slice(0, 3);
  const hidden = profile.hiddenSubjects || [];

  function computeStats(id: string, qs: Question[]) {
    const dueCards = qs.filter((q) => isCardDue(profile, q.id)).length;
    const wrongCount = profile.wrongPool[id]?.length || 0;
    const attempts = profile.attempts.filter((a) => a.subject === id);
    const lastKlausur = [...attempts].reverse().find((a) => a.mode === "klausur");
    const avgPercent =
      attempts.length > 0
        ? Math.round(attempts.reduce((s, a) => s + a.percent, 0) / attempts.length)
        : null;
    return { total: qs.length, dueCards, wrongCount, lastKlausur, avgPercent };
  }

  const builtInCards: SubjectCard[] = subjectList
    .filter((s) => !hidden.includes(s.id))
    .map((s) => ({
      id: s.id,
      name: s.name,
      color: s.color,
      isBuiltIn: true,
      ...computeStats(s.id, questionsBySubject(s.id)),
    }));

  const customCards: SubjectCard[] = (profile.customSubjects || []).map((cs) => ({
    id: cs.id,
    name: cs.name,
    color: "from-amber-500 to-orange-600",
    isBuiltIn: false,
    ...computeStats(cs.id, cs.questions),
  }));

  const hiddenBuiltIn = subjectList.filter((s) => hidden.includes(s.id));
  const allCards = [...builtInCards, ...customCards];

  function handleHide(id: string) {
    hideBuiltInSubject(profile, id);
    onProfileChange({ ...profile });
  }

  function handleRestore(id: string) {
    restoreBuiltInSubject(profile, id);
    onProfileChange({ ...profile });
  }

  function handleDeleteCustom(id: string) {
    if (!confirm("Dieses Fach inkl. aller Fragen wirklich löschen?")) return;
    removeCustomSubject(profile, id);
    onProfileChange({ ...profile });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold">Hallo, {profile.name} 👋</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Bereit für die nächste Lerneinheit? Hier ist dein Überblick.
        </p>
      </div>

      {nextExams.length > 0 && (
        <button
          onClick={() => onNavigate("calendar")}
          className="card mb-8 flex w-full animate-fade-in items-center justify-between gap-3 border-l-4 border-l-indigo-500 p-4 text-left transition hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <CalendarClock className="h-5 w-5 shrink-0 text-indigo-500" />
            <div>
              <p className="text-sm font-medium">
                {nextExams[0].title}
                {nextExams[0].subject !== "sonstiges" && (
                  <span className="text-slate-400"> · {nextExams[0].subject}</span>
                )}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {parseLocalISODate(nextExams[0].date).toLocaleDateString("de-DE", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                })}
              </p>
            </div>
          </div>
          <span className="whitespace-nowrap rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
            {daysUntil(nextExams[0].date) === 0
              ? "Heute!"
              : daysUntil(nextExams[0].date) === 1
              ? "Morgen!"
              : `Noch ${daysUntil(nextExams[0].date)} Tage`}
          </span>
        </button>
      )}

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Meine Fächer
        </h2>
        <button onClick={() => onNavigate("custom")} className="btn-secondary py-1.5 text-xs">
          <FolderPlus className="h-3.5 w-3.5" />
          Fach hinzufügen
        </button>
      </div>

      {allCards.length === 0 ? (
        <button
          onClick={() => onNavigate("custom")}
          className="card flex w-full items-center gap-3 border-dashed p-5 text-left transition hover:shadow-md"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">Erstes Lernmaterial hinzufügen</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Excel/CSV hochladen oder per KI aus Text/PDF Fragen erstellen lassen
            </p>
          </div>
        </button>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {allCards.map((s) => (
            <div key={s.id} className="card animate-fade-in overflow-hidden">
              <div className={`bg-gradient-to-br ${s.color} p-5 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {s.isBuiltIn ? (
                      <SubjectIcon id={s.id} className="h-5 w-5" />
                    ) : (
                      <FileText className="h-5 w-5" />
                    )}
                    <h2 className="text-lg font-semibold">{s.name}</h2>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {s.avgPercent !== null && (
                      <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">
                        Ø {s.avgPercent}%
                      </span>
                    )}
                    <button
                      onClick={() =>
                        s.isBuiltIn ? handleHide(s.id) : handleDeleteCustom(s.id)
                      }
                      title={s.isBuiltIn ? "Fach ausblenden" : "Fach löschen"}
                      className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/20 hover:text-white"
                    >
                      {s.isBuiltIn ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-white/80">{s.total} Fragen verfügbar</p>
              </div>

              <div className="space-y-3 p-4">
                <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">
                    {s.dueCards} Karteikarten fällig
                  </span>
                  {s.wrongCount > 0 && (
                    <span className="rounded-full bg-rose-100 px-2.5 py-1 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                      {s.wrongCount} zum Wiederholen
                    </span>
                  )}
                  {s.lastKlausur && (
                    <span
                      className={`rounded-full px-2.5 py-1 ${
                        s.lastKlausur.passed
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                      }`}
                    >
                      Letzte Klausur: {noteFromPercent(s.lastKlausur.percent)}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onStart(s.id, "uebung")}
                    className="btn-secondary justify-start"
                  >
                    <BookOpen className="h-4 w-4" />
                    Üben
                  </button>
                  <button
                    onClick={() => onStart(s.id, "klausur")}
                    className="btn-secondary justify-start"
                  >
                    <FileCheck2 className="h-4 w-4" />
                    Klausur
                  </button>
                  <button
                    onClick={() => onStart(s.id, "karteikarten")}
                    className="btn-secondary justify-start"
                  >
                    <Layers className="h-4 w-4" />
                    Karteikarten
                  </button>
                  <button
                    onClick={() => onStart(s.id, "wiederholung")}
                    disabled={s.wrongCount === 0}
                    className="btn-secondary justify-start"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Fehler ({s.wrongCount})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {hiddenBuiltIn.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Ausgeblendet:</span>
          {hiddenBuiltIn.map((s) => (
            <button
              key={s.id}
              onClick={() => handleRestore(s.id)}
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 transition hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <Eye className="h-3 w-3" />
              {s.name} wiederherstellen
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => onStart("mix", "mix")}
          disabled={allCards.length === 0}
          className="card flex items-center gap-3 p-5 text-left transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white dark:from-slate-200 dark:to-white dark:text-slate-900">
            <Shuffle className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">Gemischter Test</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              30 Fragen aus allen aktiven Fächern durcheinander
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigate("stats")}
          className="card flex items-center gap-3 p-5 text-left transition hover:shadow-md"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">Fortschritt &amp; Statistik</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {profile.attempts.length} Durchläufe bisher
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
