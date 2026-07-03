import { NextRequest, NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/db";
import {
  hashPassword,
  createSessionToken,
  COOKIE_NAME,
  SESSION_DAYS,
  validateUsername,
  validatePassword,
} from "@/lib/auth";
import { createEmptyProfile, normalizeProfile } from "@/lib/profileDefaults";

export async function POST(req: NextRequest) {
  try {
    await ensureSchema();
    const body = await req.json();
    const username = String(body.username || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");
    const initialProfile = body.initialProfile;

    if (!validateUsername(username)) {
      return NextResponse.json(
        { error: "Benutzername muss 3–20 Zeichen lang sein (Buchstaben, Zahlen, _ oder -)." },
        { status: 400 }
      );
    }
    if (!validatePassword(password)) {
      return NextResponse.json(
        { error: "Passwort muss mindestens 6 Zeichen lang sein." },
        { status: 400 }
      );
    }

    const existing = await sql`SELECT id FROM studyflow_users WHERE username = ${username}`;
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "Dieser Benutzername ist bereits vergeben." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const inserted = await sql`
      INSERT INTO studyflow_users (username, password_hash)
      VALUES (${username}, ${passwordHash})
      RETURNING id
    `;
    const userId = inserted.rows[0].id as number;

    const profileData =
      initialProfile && typeof initialProfile === "object"
        ? normalizeProfile(initialProfile, username)
        : createEmptyProfile(username);

    await sql`
      INSERT INTO studyflow_profiles (user_id, data)
      VALUES (${userId}, ${JSON.stringify(profileData)}::jsonb)
    `;

    const token = await createSessionToken(userId, username);
    const res = NextResponse.json({ profile: profileData });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DAYS * 24 * 60 * 60,
    });
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registrierung fehlgeschlagen.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
