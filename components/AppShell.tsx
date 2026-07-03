"use client";

import { useEffect, useState } from "react";
import { Profile, LearnMode, Question, View } from "@/lib/types";
import { loadCurrentProfile, hydrateProfile, logout } from "@/lib/storage";
import { apiMe, apiFetchProfile, apiRegister, apiLogin, apiLogout } from "@/lib/apiClient";
import { allQuestions, shuffle, getQuestionById } from "@/lib/questions";
import { subjects } from "@/lib/subjects";
import Login from "./Login";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import QuizRunner, { EXAM_QUESTION_COUNT } from "./QuizRunner";
import Flashcards from "./Flashcards";
import CalendarView from "./Calendar";
import Stats from "./Stats";
import CustomSubjects from "./CustomSubjects";

interface Session {
  id: number;
  title: string;
  subject: string; // SubjectId, "mix" oder eigene CustomSubject-ID
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
  const [pendingLocalProfile, setPendingLocalProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      const username = await apiMe();
      if (username) {
        const serverProfile = await apiFetchProfile();
        if (serverProfile) {
          hydrateProfile(serverProfile);
          setProfile(serverProfile);
          setView("dashboard");
          setReady(true);
          return;
        }
      }
      // Kein gültiger Server-Login: evtl. vorhandenen lokalen Fortschritt für
      // eine spätere Registrierung vormerken (Migration in den Account).
      const local = loadCurrentProfile();
      if (local) setPendingLocalProfile(local);
      setReady(true);
    })();
  }, []);

  async function handleRegister(username: string, password: string) {
    const p = await apiRegister(username, password, pendingLocalProfile ?? undefined);
    hydrateProfile(p);
    setProfile(p);
    setView("dashboard");
  }

  async function handleLoginSubmit(username: string, password: string) {
    const p = await apiLogin(username, password);
    hydrateProfile(p);
    setProfile(p);
    setView("dashboard");
  }

  async function handleLogout() {
    await apiLogout();
    logout();
    setProfile(null);
    setSession(null);
    setView("login");
  }

  function handleProfileChange(p: Profile) {
    setProfile(p);
  }

  function findCustomSubject(subject: string) {
    return profile?.customSubjects?.find((s) => s.id === subject);
  }

  function buildTitle(subject: string, mode: LearnMode) {
    let subjectName = "Gemischt";
    if (subject !== "mix") {
      const builtIn = (subjects as Record<string, { name: string }>)[subject];
      subjectName = builtIn ? builtIn.name : findCustomSubject(subject)?.name || "Eigenes Fach";
    }
    return `${subjectName} · ${MODE_LABELS[mode]}`;
  }

  function getBaseQuestions(subject: string): Question[] {
    if (subject === "mix") return allQuestions;
    const custom = findCustomSubject(subject);
    if (custom) return custom.questions;
    return allQuestions.filter((q) => q.subject === subject);
  }

  function onStart(subject: string, mode: LearnMode) {
    if (!profile) return;
    const base = getBaseQuestions(subject);
    const customPool = (profile.customSubjects || []).flatMap((s) => s.questions);
    let questions: Question[] = [];
    let examStyle = false;
    let nextView: View = "quiz";

    if (mode === "karteikarten") {
      questions = base;
      nextView = "flashcards";
    } else if (mode === "klausur") {
      const count = Math.min(EXAM_QUESTION_COUNT, base.length);
      questions = shuffle(base).slice(0, count);
      examStyle = true;
    } else if (mode === "wiederholung") {
      const ids =
        subject === "mix"
          ? [...(profile.wrongPool.soziologie || []), ...(profile.wrongPool.psychologie || [])]
          : profile.wrongPool[subject] || [];
      questions = ids
        .map((id) => getQuestionById(id, customPool))
        .filter((q): q is Question => Boolean(q));
    } else if (mode === "mix") {
      const count = Math.min(EXAM_QUESTION_COUNT, base.length);
      questions = shuffle(base).slice(0, count);
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
    return (
      <Login
        hasLocalProgress={!!pendingLocalProfile}
        onRegister={handleRegister}
        onLogin={handleLoginSubmit}
      />
    );
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
        onLogout={handleLogout}
      />

      {view === "dashboard" && (
        <Dashboard profile={profile} onStart={onStart} onNavigate={setView} />
      )}

      {view === "custom" && (
        <CustomSubjects
          profile={profile}
          onProfileChange={handleProfileChange}
          onExit={backToDashboard}
        />
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
