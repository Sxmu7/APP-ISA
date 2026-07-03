export interface ParsedQuestion {
  topic: string;
  question: string;
  options: string[];
  correctIndices: number[];
}

export interface ParseResult {
  questions: ParsedQuestion[];
  skipped: number;
  warnings: string[];
}

function normalizeHeader(h: string): string {
  return String(h || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // Umlaute/Akzente entfernen
    .replace(/[^a-z0-9]/g, "");
}

const QUESTION_KEYS = ["frage", "fragetext", "question"];
const TOPIC_KEYS = ["thema", "topic", "kategorie", "category"];
const CORRECT_KEYS = [
  "richtigeantwort",
  "richtigeantworten",
  "loesung",
  "losung",
  "korrekt",
  "correct",
  "correctanswer",
  "antwort",
];

// Erkennt Options-Spalten wie "Antwort A", "Option B", "AntwortC" oder einfach "A".."F".
function matchOptionLetter(normalizedHeader: string): string | null {
  const m = normalizedHeader.match(/^(antwort|option)([a-f])$/);
  if (m) return m[2];
  if (/^[a-f]$/.test(normalizedHeader)) return normalizedHeader;
  return null;
}

function letterToIndex(letter: string): number {
  return letter.toUpperCase().charCodeAt(0) - 65; // A -> 0
}

// Parst z.B. "B", "ACD", "b, d" oder "2" (1-basiert) in Options-Indizes.
function parseCorrectAnswer(raw: string, optionCount: number): number[] {
  const cleaned = String(raw || "").trim();
  if (!cleaned) return [];

  // Nur Buchstaben (z.B. "ACD" oder "A, C, D")
  const letters = cleaned
    .toUpperCase()
    .replace(/[^A-F]/g, "")
    .split("");
  if (letters.length > 0 && letters.every((l) => /[A-F]/.test(l))) {
    const indices = Array.from(new Set(letters.map(letterToIndex))).filter(
      (i) => i >= 0 && i < optionCount
    );
    if (indices.length > 0) return indices;
  }

  // Reine Zahl (1-basiert)
  const asNumber = Number(cleaned);
  if (!Number.isNaN(asNumber) && asNumber >= 1 && asNumber <= optionCount) {
    return [asNumber - 1];
  }

  return [];
}

export function parseRowsToQuestions(rows: Record<string, unknown>[]): ParseResult {
  const questions: ParsedQuestion[] = [];
  const warnings: string[] = [];
  let skipped = 0;

  if (rows.length === 0) {
    return { questions, skipped, warnings: ["Die Datei enthält keine Zeilen."] };
  }

  const headers = Object.keys(rows[0]);
  const headerMap = headers.map((h) => ({ raw: h, norm: normalizeHeader(h) }));

  const questionHeader = headerMap.find((h) => QUESTION_KEYS.includes(h.norm))?.raw;
  const topicHeader = headerMap.find((h) => TOPIC_KEYS.includes(h.norm))?.raw;
  const correctHeader = headerMap.find((h) => CORRECT_KEYS.includes(h.norm))?.raw;
  const optionHeaders = headerMap
    .map((h) => ({ ...h, letter: matchOptionLetter(h.norm) }))
    .filter((h): h is { raw: string; norm: string; letter: string } => h.letter !== null)
    .sort((a, b) => a.letter.localeCompare(b.letter));

  if (!questionHeader) {
    return {
      questions: [],
      skipped: rows.length,
      warnings: [
        "Konnte keine Fragen-Spalte finden. Bitte benenne eine Spalte 'Frage' oder 'Question'.",
      ],
    };
  }
  if (optionHeaders.length < 2) {
    return {
      questions: [],
      skipped: rows.length,
      warnings: [
        "Konnte keine Antwort-Spalten finden. Bitte benenne Spalten z.B. 'Antwort A', 'Antwort B', ...",
      ],
    };
  }
  if (!correctHeader) {
    return {
      questions: [],
      skipped: rows.length,
      warnings: [
        "Konnte keine Spalte für die richtige Antwort finden. Bitte benenne eine Spalte 'Richtige Antwort' oder 'Lösung'.",
      ],
    };
  }

  rows.forEach((row, idx) => {
    const questionText = String(row[questionHeader] ?? "").trim();
    if (!questionText) {
      skipped += 1;
      return;
    }
    const options = optionHeaders
      .map((h) => String(row[h.raw] ?? "").trim())
      .filter((v) => v.length > 0);
    if (options.length < 2) {
      skipped += 1;
      warnings.push(`Zeile ${idx + 2}: weniger als 2 Antwortmöglichkeiten, übersprungen.`);
      return;
    }
    const correctIndices = parseCorrectAnswer(String(row[correctHeader] ?? ""), options.length);
    if (correctIndices.length === 0) {
      skipped += 1;
      warnings.push(`Zeile ${idx + 2}: konnte richtige Antwort nicht erkennen, übersprungen.`);
      return;
    }
    const topic = topicHeader ? String(row[topicHeader] ?? "").trim() : "";

    questions.push({
      topic: topic || "Allgemein",
      question: questionText,
      options,
      correctIndices,
    });
  });

  return { questions, skipped, warnings: warnings.slice(0, 10) };
}
