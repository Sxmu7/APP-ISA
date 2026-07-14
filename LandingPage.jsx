import { ArrowRight } from "lucide-react";
import Logo from "./Logo.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import AnimatedHeadline from "./AnimatedHeadline.jsx";

export default function LandingPage({ theme, onToggleTheme, onStart }) {
  return (
    <div
      className="fade-in"
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        maxWidth: 640,
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
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 22,
          paddingBottom: 80,
        }}
      >
        <AnimatedHeadline
          text="Lerne. Fokussiert. Klar."
          style={{ fontSize: "clamp(38px, 7vw, 60px)", lineHeight: 1.08 }}
        />
        <p
          className="ah-word"
          style={{
            animationDelay: "0.4s",
            color: "var(--text-secondary)",
            fontSize: 17,
            lineHeight: 1.6,
            maxWidth: 440,
            margin: 0,
          }}
        >
          Tippe deine Fragen selbst ein oder lade Unterlagen hoch. LernAPP macht daraus
          deine persönlichen Lernkarten.
        </p>

        <div className="ah-word" style={{ animationDelay: "0.52s", display: "flex", gap: 12, marginTop: 8 }}>
          <button className="btn-primary" onClick={onStart} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            Jetzt starten
            <ArrowRight size={16} />
          </button>
        </div>
      </main>

      <footer style={{ paddingBottom: 28, color: "var(--text-muted)", fontSize: 12 }}>
        Themen-Bibliothek folgt in Kürze.
      </footer>
    </div>
  );
}
