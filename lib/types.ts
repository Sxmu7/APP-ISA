export type SubjectId = "soziologie" | "psychologie";

export interface Subject {
  id: SubjectId;
  name: string;
  color: string; // tailwind gradient classes
  icon: string; // lucide icon name key used in IconMap
}

export type Difficulty = "leicht" | "mittel" | "schwer";

export interface Question {
  id: string;
  /** Bei eingebauten Fächern "soziologie"/"psychologie", bei eigenen Fächern die CustomSubject-ID. */
  subject: string;
  topic: string;
  question: string;
  options: string[];
  /** Indizes der richtigen Antwort(en). Länge 1 = Single-Choice, Länge >1 = Multiple-Choice. */
  correctIndices: number[];
  explanation?: string;
  difficulty?: Difficulty;
}

/** Ein vom Nutzer selbst hochgeladenes/erstelltes Lernfach mit eigenen Fragen. */
export interface CustomSubject {
  id: string;
  name: string;
  createdAt: string;
  questions: Question[];
}

export type LearnMode = "uebung" | "klausur" | "karteikarten" | "wiederholung" | "mix";

export type View = "login" | "dashboard" | "quiz" | "flashcards" | "calendar" | "stats" | "custom";

export interface AttemptRecord {
  id: string;
  subject: string; // SubjectId, "mix" oder eine eigene CustomSubject-ID
  mode: LearnMode;
  date: string; // ISO
  correct: number;
  total: number;
  percent: number;
  passed: boolean;
  note: string; // Schulnote 1-5 als String
  wrongQuestionIds: string[];
}

export interface CardProgress {
  questionId: string;
  box: number; // 1-5 (Leitner)
  dueDate: string; // ISO date (yyyy-mm-dd)
  timesCorrect: number;
  timesWrong: number;
}

export interface ExamEvent {
  id: string;
  subject: SubjectId | "sonstiges";
  title: string;
  date: string; // ISO date yyyy-mm-dd
  notes?: string;
}

export interface MistakeEntry {
  questionId: string;
  count: number; // wie oft insgesamt falsch beantwortet
  lastWrongDate: string; // ISO date
}

export interface Profile {
  name: string;
  createdAt: string;
  updatedAt: string;
  attempts: AttemptRecord[];
  wrongPool: Record<string, string[]>; // aktuelle "Problemfragen" je Fach (auch eigene Fächer)
  mistakeStats: Record<string, MistakeEntry>; // Fehlerhistorie je Frage (über alle Modi hinweg)
  cardProgress: Record<string, CardProgress>;
  examEvents: ExamEvent[];
  customSubjects: CustomSubject[]; // eigene, selbst hochgeladene Lernfächer
  hiddenSubjects: string[]; // IDs ausgeblendeter Standardfächer (soziologie/psychologie)
  xp: number;
  streakDays: number;
  lastActiveDate: string; // ISO date
  theme: "light" | "dark";
}
