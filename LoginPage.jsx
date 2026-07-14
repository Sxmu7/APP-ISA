import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Logo from "./Logo.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import AnimatedHeadline from "./AnimatedHeadline.jsx";

export default function LoginPage({ theme, onToggleTheme, onBack, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);

  const emailValid = /^\S+@\S+\.\S+$/.test(email);
  const canSubmit = emailValid && password.length >= 4;

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (canSubmit) onLogin({ email });
  }

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
        <button
          className="btn-ghost"
          onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px" }}
        >
          <ArrowLeft size={15} />
          Zurück
        </button>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 26,
          maxWidth: 360,
          width: "100%",
          margin: "0 auto",
          paddingBottom: 60,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14 }}>
          <Logo size={36} />
          <AnimatedHeadline text="Willkommen zurück" style={{ fontSize: 32, lineHeight: 1.12 }} />
          <p
            className="ah-word"
            style={{ animationDelay: "0.3s", color: "var(--text-secondary)", fontSize: 14, margin: 0 }}
          >
            Melde dich an, um mit dem Lernen loszulegen.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            className="field"
            type="email"
            placeholder="name@beispiel.de"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className="field"
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {touched && !canSubmit && (
            <span style={{ color: "var(--accent)", fontSize: 12 }}>
              Bitte gültige E-Mail und Passwort (min. 4 Zeichen) eingeben.
            </span>
          )}
          <button type="submit" className="btn-primary" style={{ marginTop: 6 }}>
            Anmelden
          </button>
        </form>

        <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
          Noch kein Konto? Registrierung folgt in Kürze.
        </p>
      </main>
    </div>
  );
}
