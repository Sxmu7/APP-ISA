import { Subject, SubjectId } from "./types";

export const subjects: Record<SubjectId, Subject> = {
  soziologie: {
    id: "soziologie",
    name: "Soziologie",
    color: "from-violet-500 to-indigo-600",
    icon: "Users",
  },
  psychologie: {
    id: "psychologie",
    name: "Psychologie",
    color: "from-rose-500 to-orange-500",
    icon: "Brain",
  },
};

export const subjectList: Subject[] = Object.values(subjects);

export function noteFromPercent(percent: number): string {
  if (percent >= 92) return "1 (sehr gut)";
  if (percent >= 81) return "2 (gut)";
  if (percent >= 67) return "3 (befriedigend)";
  if (percent >= 50) return "4 (ausreichend)";
  return "5 (nicht bestanden)";
}
