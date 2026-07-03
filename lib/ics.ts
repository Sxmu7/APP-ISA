import { Profile } from "./types";

// Minimaler iCalendar (RFC 5545) Export/Import – bewusst ohne externe
// Bibliothek gehalten, damit kein zusätzliches npm-Paket ungetestet in den
// Build muss. Deckt den Alltagsfall ab: einfache, ganztägige Termine.

function foldLine(line: string): string {
  // RFC 5545 empfiehlt Zeilen auf 75 Oktette zu falten (Fortsetzung mit
  // führendem Leerzeichen). Die meisten Kalender-Apps tolerieren auch
  // längere Zeilen, aber wir machen es korrekt.
  if (line.length <= 74) return line;
  let result = line.slice(0, 74);
  let rest = line.slice(74);
  while (rest.length > 0) {
    result += "\r\n " + rest.slice(0, 73);
    rest = rest.slice(73);
  }
  return result;
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function unescapeIcsText(text: string): string {
  return text
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

function dateToIcsDate(iso: string): string {
  // "2026-07-15" -> "20260715"
  return iso.replace(/-/g, "");
}

function addOneDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, (m || 1) - 1, (d || 1) + 1);
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}${mm}${dd}`;
}

function nowUtcStamp(): string {
  return new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

/** Baut aus den Klausurterminen eines Profils eine .ics-Datei (als Text). */
export function generateIcs(profile: Profile): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//StudyFlow//Klausurkalender//DE",
    "CALSCALE:GREGORIAN",
    `X-WR-CALNAME:${escapeIcsText(`StudyFlow – ${profile.name}`)}`,
  ];

  for (const e of profile.examEvents) {
    const summary =
      e.subject !== "sonstiges" ? `${e.title} (${e.subject})` : e.title;
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${e.id}@studyflow.app`);
    lines.push(`DTSTAMP:${nowUtcStamp()}`);
    lines.push(`DTSTART;VALUE=DATE:${dateToIcsDate(e.date)}`);
    lines.push(`DTEND;VALUE=DATE:${addOneDay(e.date)}`);
    lines.push(`SUMMARY:${escapeIcsText(summary)}`);
    if (e.notes) lines.push(`DESCRIPTION:${escapeIcsText(e.notes)}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.map(foldLine).join("\r\n");
}

export interface ImportedIcsEvent {
  title: string;
  date: string; // YYYY-MM-DD
  notes?: string;
}

/** Parst den Inhalt einer beliebigen .ics-Datei (Google/Apple/Outlook-Export) in einfache Termine. */
export function parseIcsToEvents(icsText: string): ImportedIcsEvent[] {
  // Zeilen entfalten (fortgesetzte Zeilen beginnen mit Leerzeichen/Tab).
  const unfolded = icsText.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "");
  const rawLines = unfolded.split(/\r\n|\n|\r/);

  const events: ImportedIcsEvent[] = [];
  let inEvent = false;
  let current: { summary?: string; date?: string; notes?: string } = {};

  function propValue(line: string): { name: string; value: string } {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) return { name: line, value: "" };
    const rawName = line.slice(0, colonIdx);
    const name = rawName.split(";")[0].toUpperCase();
    const value = line.slice(colonIdx + 1);
    return { name, value };
  }

  for (const line of rawLines) {
    if (!line.trim()) continue;
    if (line.startsWith("BEGIN:VEVENT")) {
      inEvent = true;
      current = {};
      continue;
    }
    if (line.startsWith("END:VEVENT")) {
      if (current.summary && current.date) {
        events.push({
          title: current.summary,
          date: current.date,
          notes: current.notes,
        });
      }
      inEvent = false;
      continue;
    }
    if (!inEvent) continue;

    const { name, value } = propValue(line);
    if (name === "SUMMARY") {
      current.summary = unescapeIcsText(value).trim();
    } else if (name === "DTSTART") {
      const digits = value.replace(/[^0-9]/g, "");
      if (digits.length >= 8) {
        const y = digits.slice(0, 4);
        const m = digits.slice(4, 6);
        const d = digits.slice(6, 8);
        current.date = `${y}-${m}-${d}`;
      }
    } else if (name === "DESCRIPTION") {
      current.notes = unescapeIcsText(value).trim() || undefined;
    }
  }

  return events.slice(0, 500);
}
