import { NextRequest, NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/db";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth";
import { normalizeProfile } from "@/lib/profileDefaults";

async function getSession(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function GET(req: NextRequest) {
  await ensureSchema();
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });

  const result = await sql`SELECT data FROM studyflow_profiles WHERE user_id = ${session.userId}`;
  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Kein Profil gefunden." }, { status: 404 });
  }
  return NextResponse.json({ profile: normalizeProfile(result.rows[0].data, session.username) });
}

export async function PUT(req: NextRequest) {
  await ensureSchema();
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });

  const body = await req.json();
  const profile = body.profile;
  if (!profile || typeof profile !== "object") {
    return NextResponse.json({ error: "Ungültiges Profil." }, { status: 400 });
  }
  const normalized = normalizeProfile(profile, session.username);

  await sql`
    INSERT INTO studyflow_profiles (user_id, data, updated_at)
    VALUES (${session.userId}, ${JSON.stringify(normalized)}::jsonb, now())
    ON CONFLICT (user_id)
    DO UPDATE SET data = ${JSON.stringify(normalized)}::jsonb, updated_at = now()
  `;
  return NextResponse.json({ ok: true });
}
