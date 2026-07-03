import { Users, Brain, HelpCircle } from "lucide-react";
import { SubjectId } from "./types";

export function SubjectIcon({
  id,
  className,
}: {
  id: SubjectId | string;
  className?: string;
}) {
  switch (id) {
    case "soziologie":
      return <Users className={className} />;
    case "psychologie":
      return <Brain className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
}
