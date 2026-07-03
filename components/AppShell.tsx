"use client";

import { useEffect, useState } from "react";
import { Profile, SubjectId, LearnMode, Question, View } from "@/lib/types";
import {
  loadCurrentProfile,
  createOrLoadProfile,
  logout,
  listProfileNames,
  saveProfile,
} from "@/lib/storage";
import { allQuestions, questionsBySubject, shuffle, getQuestionById } from "@/lib/questions";
import { subjects } from "@/lib/subjects";
import Login from "./Login";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import QuizRunner from "./QuizRunner";
import Flashcards from "./Flashcards";
import CalendarView from "./Calendar";
import Stats from "./Stats";

interface Session {
  id: number;
  title: string;
  subject: SubjectId | "mix";
  mode: LearnMode;
  questions: Question[];
  examStyle: boolean;
}

const MODE_LABELS: Record<LearnMode, string> = {
  uebung: "Übung",
  klausur: "Klausursimulation",
  karteikarten: "Karteikarten",
  wiederholung: "Wiederholung",
  mix: "Gemischter Test",
};

export default function AppShell() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [view, setView] = useState<View>("login");
  const [session, setSession] = useState<Session | null>(null);
  const [sessionCounter, setSessionCounter] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const existing = loadCurrentProfile();
    if (existing) {
      setProfile(existing);
      setView("dashboard");
      applyTheme(existing.theme);
    }
    setReady(true);
  }, []);

  function applyTheme(theme: "light" | "dark") {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }

  function handleLogin(name: string) {
    const p = createOrLoadProfile(name);
    setProfile(p);
    setView("dashboard");
    applyTheme(p.theme);
  }

  function handleLogout() {
    logout();
    setProfile(null);
    setSession(null);
    setView("login");
  }

  function handleProfileChange(p: Profile) {
    setProfile(p);
  }

  function toggleTheme() {
    if (!profile) return;
    const next = profile.theme === "dark" ? "light" : "dark";
    const updated = { ...profile, theme: next as "light" | "dark" };
    saveProfile(updated);
    setProfile(updated);
    applyTheme(next);
  }

  function buildTitle(subject: SubjectId | "mix", mode: LearnMode) {
    const subjectName = subject === "mix" ? "Gemischt" : subjects[subject].name;
    return `${subjectName} · ${MODE_LABELS[mode]}`;
  }

  function onStart(subject: SubjectId | "mix", mode: LearnMode) {
    if (!profile) return;
    const base = subject === "mix" ? allQuestions : questionsBySubject(subject);
    let questions: Question[] = [];
    let examStyle = false;
    let nextView: View = "quiz";

    if (mode === "karteikarten") {
      questions = base;
      nextView = "flashcards";
    } else if (mode === "klausur") {
      const count = Math.min(15, base.length);
      questions = shuffle(base).slice(0, count);
      examStyle = true;
    } else if (mode === "wiederholung") {
      const ids =
        subject === "mix"
          ? [...profile.wrongPool.soziologie, ...profile.wrongPool.psychologie]
          : profile.wrongPool[subject] || [];
      questions = ids
        .map((id) => getQuestionById(id))
        .filter((q): q is Question => Boolean(q));
    } else {
      questions = shuffle(base);
    }

    setSessionCounter((c) => c + 1);
    setSession({
      id: sessionCounter + 1,
      title: buildTitle(subject, mode),
      subject,
      mode,
      questions,
      examStyle,
    });
    setView(nextView);
  }

  function onRetryWrong(questions: Question[]) {
    if (!session) return;
    setSessionCounter((c) => c + 1);
    setSession({
      ...session,
      id: sessionCounter + 1,
      mode: "wiederholung",
      examStyle: false,
      questions,
      title: buildTitle(session.subject, "wiederholung"),
    });
  }

  function backToDashboard() {
    setSession(null);
    setView("dashboard");
  }

  if (!ready) return null;

  if (!profile || view === "login") {
    return <Login existingNames={listProfileNames()} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen">
      <Navbar
        profile={profile}
        view={view}
        onNavigate={(v) => {
          if (v === "dashboard") setSession(null);
          setView(v);
        }}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
      />

      {view === "dashboard" && (
        <Dashboard profile={profile} onStart={onStart} onNavigate={setView} />
      )}

      {view === "quiz" && session && (
        <QuizRunner
          key={session.id}
          title={session.title}
          questions={session.questions}
          mode={session.mode}
          subjectForRecord={session.subject}
          examStyle={session.examStyle}
          profile={profile}
          onProfileChange={handleProfileChange}
          onExit={backToDashboard}
          onRetryWrong={onRetryWrong}
        />
      )}

      {view === "flashcards" && session && (
        <Flashcards
          title={session.title}
          questions={session.questions}
          profile={profile}
          onProfileChange={handleProfileChange}
          onExit={backToDashboard}
        />
      )}

      {view === "calendar" && (
        <CalendarView profile={profile} onProfileChange={handleProfileChange} />
      )}

      {view === "stats" && <Stats profile={profile} />}
    </div>
  );
}
