import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button className="theme-toggle" onClick={onToggle} aria-label="Theme wechseln">
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
