import { sql } from "@vercel/postgres";

// Legt die benötigten Tabellen an, falls sie noch nicht existieren.
// Wird lazy vor jedem DB-Zugriff aufgerufen, damit keine separate
// Migrationsschritt-Ausführung (z.B. per CLI) nötig ist.
let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS studyflow_users (
          id SERIAL PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS studyflow_profiles (
          user_id INTEGER PRIMARY KEY REFERENCES studyflow_users(id) ON DELETE CASCADE,
          data JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `;
    })().catch((err) => {
      // Beim nächsten Aufruf erneut versuchen, falls die DB kurzzeitig nicht erreichbar war.
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

export { sql };
