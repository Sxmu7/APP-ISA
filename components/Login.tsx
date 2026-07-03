"use client";

import { useState } from "react";
import { GraduationCap, Sparkles, User, Lock, LogIn, UserPlus } from "lucide-react";

export default function Login({
  hasLocalProgress,
  onRegister,
  onLogin,
}: {
  hasLocalProgress: boolean;
  onRegister: (username: string, password: string) => Promise<void>;
  onLogin: (username: string, password: string) => Promise<void>;
}) {
  const [mode, setMode] = useState<"login" | "register">(hasLocalProgress ? "register" : "login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const cleanUser = username.trim().toLowerCase();
    if (cleanUser.length < 3) {
      setError("Benutzername muss mindestens 3 Zeichen haben.");
      return;
    }
    if (password.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen haben.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "register") {
        await onRegister(cleanUser, password);
      } else {
        await onLogin(cleanUser, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Etwas ist schiefgelaufen.");
    } finally {
      setLoading(false);
    }
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
            Deine persönliche Lern-App für beliebige Fächer
          </p>
        </div>

        <div className="mb-4 flex rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              mode === "login"
                ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <LogIn className="h-4 w-4" />
            Einloggen
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              mode === "register"
                ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Registrieren
          </button>
        </div>

        <form onSubmit={submit} className="card space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Benutzername
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="z.B. sam"
                className="input pl-10"
                maxLength={20}
                autoComplete="username"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Passwort
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="mindestens 6 Zeichen"
                className="input pl-10"
                maxLength={100}
                autoComplete={mode === "register" ? "new-password" : "current-password"}
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </p>
          )}

          {mode === "register" && hasLocalProgress && (
            <p className="rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
              Dein bisheriger Fortschritt aus diesem Browser wird bei der Registrierung automatisch
              übernommen.
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            <Sparkles className="h-4 w-4" />
            {loading
              ? "Einen Moment…"
              : mode === "register"
                ? "Account erstellen"
                : "Loslegen"}
          </button>
          <p className="text-center text-xs text-slate-400">
            Dein Fortschritt wird sicher gespeichert und mit all deinen Geräten synchronisiert.
          </p>
        </form>
      </div>
    </div>
  );
}
