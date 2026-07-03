import { Profile } from "./types";

async function readJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function apiRegister(
  username: string,
  password: string,
  initialProfile?: Profile
): Promise<Profile> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, initialProfile }),
  });
  const data = await readJson(res);
  if (!res.ok) throw new Error(data.error || "Registrierung fehlgeschlagen.");
  return data.profile as Profile;
}

export async function apiLogin(username: string, password: string): Promise<Profile> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await readJson(res);
  if (!res.ok) throw new Error(data.error || "Login fehlgeschlagen.");
  return data.profile as Profile;
}

export async function apiLogout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {
    // Cookie wird beim nächsten Laden ohnehin ignoriert, falls Request fehlschlägt.
  }
}

export async function apiMe(): Promise<string | null> {
  try {
    const res = await fetch("/api/auth/me");
    const data = await readJson(res);
    return data.username ?? null;
  } catch {
    return null;
  }
}

export async function apiFetchProfile(): Promise<Profile | null> {
  try {
    const res = await fetch("/api/profile");
    if (!res.ok) return null;
    const data = await readJson(res);
    return (data.profile as Profile) ?? null;
  } catch {
    return null;
  }
}

let syncTimer: ReturnType<typeof setTimeout> | null = null;

// Debounced Hintergrund-Sync: schickt das aktuelle Profil ans Backend.
// Schlägt still fehl, wenn nicht eingeloggt oder offline – das lokale
// Backup in localStorage bleibt in jedem Fall die sofort verfügbare Quelle.
export function apiSyncProfile(profile: Profile) {
  if (typeof window === "undefined") return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile }),
    }).catch(() => {
      /* offline oder nicht eingeloggt – wird beim nächsten Save erneut versucht */
    });
  }, 500);
}
