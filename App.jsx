import { useState } from "react";
import useTheme from "./useTheme.js";
import LandingPage from "./LandingPage.jsx";
import LoginPage from "./LoginPage.jsx";
import HomePage from "./HomePage.jsx";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState("landing"); // landing | login | home
  const [email, setEmail] = useState(null);

  return (
    <div className="app-shell">
      {view === "landing" && (
        <LandingPage theme={theme} onToggleTheme={toggleTheme} onStart={() => setView("login")} />
      )}
      {view === "login" && (
        <LoginPage
          theme={theme}
          onToggleTheme={toggleTheme}
          onBack={() => setView("landing")}
          onLogin={({ email }) => {
            setEmail(email);
            setView("home");
          }}
        />
      )}
      {view === "home" && (
        <HomePage
          theme={theme}
          onToggleTheme={toggleTheme}
          email={email}
          onLogout={() => {
            setEmail(null);
            setView("landing");
          }}
        />
      )}
    </div>
  );
}
