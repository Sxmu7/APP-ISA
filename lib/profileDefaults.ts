import { Profile } from "./types";

// Reines (keine Browser-APIs nötiges) Erstellen eines leeren Profils.
// Wird sowohl client- als auch serverseitig (API-Routen) verwendet.
export function createEmptyProfile(name: string): Profile {
  const now = new Date().toISOString();
  return {
    name,
    createdAt: now,
    updatedAt: now,
    attempts: [],
    wrongPool: { soziologie: [], psychologie: [] },
    mistakeStats: {},
    cardProgress: {},
    examEvents: [],
    customSubjects: [],
    hiddenSubjects: [],
    xp: 0,
    streakDays: 0,
    lastActiveDate: now.slice(0, 10),
    theme: "dark",
  };
}

// Stellt sicher, dass ein aus der DB oder von einem anderen Gerät geladenes
// Profil alle erwarteten Felder besitzt (Migration älterer Datensätze).
export function normalizeProfile(raw: Partial<Profile>, name: string): Profile {
  const empty = createEmptyProfile(name);
  return {
    ...empty,
    ...raw,
    name,
    wrongPool: raw.wrongPool || empty.wrongPool,
    mistakeStats: raw.mistakeStats || empty.mistakeStats,
    cardProgress: raw.cardProgress || empty.cardProgress,
    examEvents: raw.examEvents || empty.examEvents,
    attempts: raw.attempts || empty.attempts,
    customSubjects: raw.customSubjects || empty.customSubjects,
    hiddenSubjects: raw.hiddenSubjects || empty.hiddenSubjects,
  };
}
