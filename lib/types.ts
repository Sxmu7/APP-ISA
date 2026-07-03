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
  subject: SubjectId;
  topic: string;
  question: string;
  options: string[];
  /** Indizes der richtigen Antwort(en). Länge 1 = Single-Choice, Länge >1 = Multiple-Choice. */
  correctIndices: number[];
  explanation?: string;
  difficulty?: Difficulty;
}

export type LearnMode = "uebung" | "klausur" | "karteikarten" | "wiederholung" | "mix";

export type View = "login" | "dashboard" | "quiz" | "flashcards" | "calendar" | "stats";

export interface AttemptRecord {
  id: string;
  subject: SubjectId | "mix";
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

export interface Profile {
  name: string;
  createdAt: string;
  updatedAt: string;
  attempts: AttemptRecord[];
  wrongPool: Record<SubjectId, string[]>; // aktuelle "Problemfragen" je Fach
  cardProgress: Record<string, CardProgress>;
  examEvents: ExamEvent[];
  xp: number;
  streakDays: number;
  lastActiveDate: string; // ISO date
  theme: "light" | "dark";
}
