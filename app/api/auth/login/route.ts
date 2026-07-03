import { NextRequest, NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/db";
import { verifyPassword, createSessionToken, COOKIE_NAME, SESSION_DAYS } from "@/lib/auth";
import { normalizeProfile } from "@/lib/profileDefaults";

export async function POST(req: NextRequest) {
  try {
    await ensureSchema();
    const body = await req.json();
    const username = String(body.username || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");

    const result = await sql`
      SELECT id, password_hash FROM studyflow_users WHERE username = ${username}
    `;
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Benutzername oder Passwort ist falsch." }, { status: 401 });
    }
    const user = result.rows[0] as { id: number; password_hash: string };
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Benutzername oder Passwort ist falsch." }, { status: 401 });
    }

    const profileResult = await sql`SELECT data FROM studyflow_profiles WHERE user_id = ${user.id}`;
    const profileData = profileResult.rows[0]
      ? normalizeProfile(profileResult.rows[0].data, username)
      : normalizeProfile({}, username);

    const token = await createSessionToken(user.id, username);
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
    const message = err instanceof Error ? err.message : "Login fehlgeschlagen.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
