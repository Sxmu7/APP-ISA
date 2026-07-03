import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

export const COOKIE_NAME = "studyflow_session";
export const SESSION_DAYS = 90;

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET fehlt. Bitte in den Vercel-Projekteinstellungen unter Environment Variables einen zufälligen, langen String als AUTH_SECRET hinterlegen und neu deployen."
    );
  }
  return new TextEncoder().encode(secret);
}

export function validateUsername(username: string): boolean {
  return /^[a-zA-Z0-9_-]{3,20}$/.test(username);
}

export function validatePassword(password: string): boolean {
  return typeof password === "string" && password.length >= 6 && password.length <= 100;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface SessionPayload {
  userId: number;
  username: string;
}

export async function createSessionToken(userId: number, username: string): Promise<string> {
  return new SignJWT({ userId, username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.userId !== "number" || typeof payload.username !== "string") return null;
    return { userId: payload.userId, username: payload.username };
  } catch {
    return null;
  }
}
