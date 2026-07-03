import { Profile, AttemptRecord, ExamEvent, CardProgress, SubjectId, MistakeEntry } from "./types";

const PROFILES_KEY = "studyflow_profiles_v1";
const CURRENT_KEY = "studyflow_current_profile_v1";

// Lokale (nicht UTC-verschobene) Datums-Helfer – wichtig, damit "heute" und
// Kalendertage nicht durch Zeitzonen-Umrechnung auf den falschen Tag fallen.
export function toLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseLocalISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function todayISO(): string {
  return toLocalISODate(new Date());
}

export function isBrowser() {
  return typeof window !== "undefined";
}

function readAll(): Record<string, Profile> {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(PROFILES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Profile>) : {};
  } catch {
    return {};
  }
}

function writeAll(profiles: Record<string, Profile>) {
  if (!isBrowser()) return;
  window.localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function listProfileNames(): string[] {
  return Object.keys(readAll()).sort();
}

export function getCurrentProfileName(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(CURRENT_KEY);
}

export function setCurrentProfileName(name: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(CURRENT_KEY, name);
}

export function logout() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(CURRENT_KEY);
}

function freshProfile(name: string): Profile {
  return {
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attempts: [],
    wrongPool: { soziologie: [], psychologie: [] },
    mistakeStats: {},
    cardProgress: {},
    examEvents: [],
    xp: 0,
    streakDays: 0,
    lastActiveDate: todayISO(),
    theme: "dark",
  };
}

export function createOrLoadProfile(name: string): Profile {
  const clean = name.trim();
  const all = readAll();
  let profile = all[clean];
  if (!profile) {
    profile = freshProfile(clean);
    all[clean] = profile;
    writeAll(all);
  } else {
    // Migrate missing fields for older saved profiles
    if (!profile.wrongPool) profile.wrongPool = { soziologie: [], psychologie: [] };
    if (!profile.mistakeStats) profile.mistakeStats = {};
    if (!profile.cardProgress) profile.cardProgress = {};
    if (!profile.examEvents) profile.examEvents = [];
  }
  setCurrentProfileName(clean);
  return updateStreak(profile);
}

function updateStreak(profile: Profile): Profile {
  const today = todayISO();
  if (profile.lastActiveDate === today) return profile;
  const last = new Date(profile.lastActiveDate);
  const diffDays = Math.round(
    (new Date(today).getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 1) {
    profile.streakDays += 1;
  } else if (diffDays > 1) {
    profile.streakDays = 1;
  } else if (profile.streakDays === 0) {
    profile.streakDays = 1;
  }
  profile.lastActiveDate = today;
  saveProfile(profile);
  return profile;
}

export function saveProfile(profile: Profile) {
  const all = readAll();
  profile.updatedAt = new Date().toISOString();
  all[profile.name] = profile;
  writeAll(all);
}

export function deleteProfile(name: string) {
  const all = readAll();
  delete all[name];
  writeAll(all);
  if (getCurrentProfileName() === name) logout();
}

export function loadCurrentProfile(): Profile | null {
  const name = getCurrentProfileName();
  if (!name) return null;
  const all = readAll();
  const profile = all[name];
  if (!profile) return null;
  if (!profile.wrongPool) profile.wrongPool = { soziologie: [], psychologie: [] };
  if (!profile.mistakeStats) profile.mistakeStats = {};
  if (!profile.cardProgress) profile.cardProgress = {};
  if (!profile.examEvents) profile.examEvents = [];
  return updateStreak(profile);
}

// ---- Attempts ----
export function addAttempt(profile: Profile, attempt: AttemptRecord) {
  profile.attempts.push(attempt);
  profile.xp += Math.round(attempt.correct * 10 + (attempt.passed ? 50 : 0));
  saveProfile(profile);
}

// ---- Wrong-answer pool (Wiederholungsmodus) ----
export function addToWrongPool(profile: Profile, subject: SubjectId, questionId: string) {
  const pool = profile.wrongPool[subject] || [];
  if (!pool.includes(questionId)) pool.push(questionId);
  profile.wrongPool[subject] = pool;
  saveProfile(profile);
}

export function removeFromWrongPool(profile: Profile, subject: SubjectId, questionId: string) {
  const pool = profile.wrongPool[subject] || [];
  profile.wrongPool[subject] = pool.filter((id) => id !== questionId);
  saveProfile(profile);
}

// ---- Fehlerhistorie (wie oft eine Frage insgesamt falsch beantwortet wurde) ----
export function recordMistake(profile: Profile, questionId: string) {
  if (!profile.mistakeStats) profile.mistakeStats = {};
  const existing: MistakeEntry = profile.mistakeStats[questionId] || {
    questionId,
    count: 0,
    lastWrongDate: todayISO(),
  };
  existing.count += 1;
  existing.lastWrongDate = todayISO();
  profile.mistakeStats[questionId] = existing;
  saveProfile(profile);
}

// ---- Leitner Karteikarten ----
const BOX_INTERVAL_DAYS: Record<number, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 7,
  5: 14,
};

function addDays(iso: string, days: number): string {
  const d = parseLocalISODate(iso);
  d.setDate(d.getDate() + days);
  return toLocalISODate(d);
}

export function getCardProgress(profile: Profile, questionId: string): CardProgress {
  return (
    profile.cardProgress[questionId] || {
      questionId,
      box: 1,
      dueDate: todayISO(),
      timesCorrect: 0,
      timesWrong: 0,
    }
  );
}

export function reviewCard(profile: Profile, questionId: string, knewIt: boolean) {
  const current = getCardProgress(profile, questionId);
  let box = current.box;
  if (knewIt) {
    box = Math.min(5, box + 1);
    current.timesCorrect += 1;
  } else {
    box = 1;
    current.timesWrong += 1;
  }
  current.box = box;
  current.dueDate = addDays(todayISO(), BOX_INTERVAL_DAYS[box]);
  profile.cardProgress[questionId] = current;
  saveProfile(profile);
}

export function isCardDue(profile: Profile, questionId: string): boolean {
  const cp = profile.cardProgress[questionId];
  if (!cp) return true;
  return cp.dueDate <= todayISO();
}

// ---- Exam calendar ----
export function addExamEvent(profile: Profile, event: ExamEvent) {
  profile.examEvents.push(event);
  profile.examEvents.sort((a, b) => a.date.localeCompare(b.date));
  saveProfile(profile);
}

export function removeExamEvent(profile: Profile, id: string) {
  profile.examEvents = profile.examEvents.filter((e) => e.id !== id);
  saveProfile(profile);
}

export function upcomingExamEvents(profile: Profile): ExamEvent[] {
  const today = todayISO();
  return profile.examEvents
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function daysUntil(dateISO: string): number {
  const today = parseLocalISODate(todayISO());
  const target = parseLocalISODate(dateISO);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function newId(): string {
  if (isBrowser() && "randomUUID" in window.crypto) {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export { todayISO };
