import { Question, SubjectId } from "../types";
import { soziologieFragen } from "./soziologie";
import { psychologieFragen } from "./psychologie";

export const allQuestions: Question[] = [...soziologieFragen, ...psychologieFragen];

export function questionsBySubject(subject: SubjectId): Question[] {
  return allQuestions.filter((q) => q.subject === subject);
}

export function getQuestionById(id: string): Question | undefined {
  return allQuestions.find((q) => q.id === id);
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
