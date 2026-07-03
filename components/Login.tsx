"use client";

import { useState } from "react";
import { GraduationCap, Sparkles, User } from "lucide-react";

export default function Login({
  existingNames,
  onLogin,
}: {
  existingNames: string[];
  onLogin: (name: string) => void;
}) {
  const [name, setName] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return;
    onLogin(name.trim());
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-rose-50 px-4 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">StudyFlow</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Deine persönliche Lern-App für Soziologie &amp; Psychologie
          </p>
        </div>

        <form onSubmit={submit} className="card space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Wie heißt du?
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Sam"
                className="input pl-10"
                maxLength={30}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">
            <Sparkles className="h-4 w-4" />
            Loslegen
          </button>
          <p className="text-center text-xs text-slate-400">
            Dein Fortschritt wird nur lokal in diesem Browser gespeichert.
          </p>
        </form>

        {existingNames.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-slate-400">
              Vorhandene Profile
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {existingNames.map((n) => (
                <button
                  key={n}
                  onClick={() => onLogin(n)}
                  className="btn-secondary !rounded-full !px-4 !py-1.5 text-xs"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
