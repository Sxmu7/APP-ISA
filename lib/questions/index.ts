import { Question, SubjectId } from "../types";
import { soziologieFragen } from "./soziologie";
import { psychologieFragen } from "./psychologie";

export const allQuestions: Question[] = [...soziologieFragen, ...psychologieFragen];

export function questionsBySubject(subject: SubjectId): Question[] {
  return allQuestions.filter((q) => q.subject === subject);
}

// "extra" erlaubt die Suche auch in Fragen eigener, selbst hochgeladener
// Fächer (die nicht Teil des fest eingebauten allQuestions-Pools sind).
export function getQuestionById(id: string, extra: Question[] = []): Question | undefined {
  return allQuestions.find((q) => q.id === id) || extra.find((q) => q.id === id);
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
