import { LogOut } from "lucide-react";
import Logo from "./Logo.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import AnimatedHeadline from "./AnimatedHeadline.jsx";
import ActionCards from "./ActionCards.jsx";

export default function HomePage({ theme, onToggleTheme, onLogout, email }) {
  return (
    <div
      className="fade-in"
      style={{
        minHeight: "100%",
        maxWidth: 720,
        margin: "0 auto",
        width: "100%",
        padding: "0 28px",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "28px 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={30} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>LernAPP</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            className="theme-toggle"
            onClick={onLogout}
            aria-label="Abmelden"
            title="Abmelden"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main style={{ paddingBottom: 60 }}>
        <div style={{ marginBottom: 28 }}>
          <AnimatedHeadline text="Bereit zu lernen?" style={{ fontSize: 34, lineHeight: 1.15 }} />
          <p
            className="ah-word"
            style={{
              animationDelay: "0.3s",
              color: "var(--text-secondary)",
              fontSize: 14,
              margin: "10px 0 0",
            }}
          >
            Angemeldet als {email || "Gast"}. Lege los — tippe Fragen ein oder lade Unterlagen hoch.
          </p>
        </div>

        <ActionCards />

        <p style={{ marginTop: 28, fontSize: 12, color: "var(--text-muted)" }}>
          Themen-Bibliothek und automatischer Import folgen in einer der nächsten Versionen.
        </p>
      </main>
    </div>
  );
}
