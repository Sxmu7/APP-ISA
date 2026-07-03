import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth";

export const maxDuration = 60;

// Kostenloses Gemini-Modell (Google AI Studio Free Tier).
const GEMINI_MODEL = "gemini-2.5-flash";

const SYSTEM_PROMPT = `Du bekommst den Inhalt eines Dokuments (Vorlesungsskript, Notizen, Text, o.ä.) und
sollst daraus Multiple-Choice-Quizfragen für eine Lern-App extrahieren bzw. erstellen.

Regeln:
- Wenn das Dokument bereits fertige Prüfungsfragen mit Antwortoptionen enthält, übernimm sie
  möglichst originalgetreu (Frage, Antwortmöglichkeiten, richtige Antwort).
- Wenn das Dokument nur Fließtext/Notizen ohne fertige Fragen enthält, erstelle selbst sinnvolle
  Verständnisfragen zu den wichtigsten Inhalten (mindestens 5, höchstens 60 Fragen).
- Jede Frage braucht 2 bis 6 Antwortoptionen, davon ist mindestens eine korrekt (auch mehrere
  richtige Antworten sind erlaubt, wenn das inhaltlich passt).
- Formuliere Fragen und Antworten auf Deutsch, prägnant und eindeutig.
- Erfinde keine Fakten, die nicht im Dokument stehen oder logisch zwingend daraus folgen.
- Vergib zu jeder Frage ein kurzes Themen-Schlagwort (topic), z.B. den Abschnittstitel.
- Antworte ausschließlich mit dem geforderten JSON-Format, ohne zusätzlichen Text.`;

// Gemini "controlled generation" Schema (OpenAPI-Subset, Typen in Großbuchstaben).
const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    questions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          topic: { type: "STRING", description: "Kurzes Themen-Schlagwort" },
          question: { type: "STRING" },
          options: {
            type: "ARRAY",
            items: { type: "STRING" },
          },
          correctIndices: {
            type: "ARRAY",
            items: { type: "INTEGER" },
            description: "0-basierte Indizes der richtigen Antwort(en) in 'options'",
          },
        },
        required: ["question", "options", "correctIndices"],
      },
    },
  },
  required: ["questions"],
};

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session) {
      return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY fehlt. Bitte einen kostenlosen Key auf aistudio.google.com/apikey erstellen und in den Vercel-Projekteinstellungen unter Environment Variables hinterlegen.",
        },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const text = formData.get("text");
    const file = formData.get("file");

    if (!text && !file) {
      return NextResponse.json(
        { error: "Bitte Text einfügen oder eine PDF-Datei hochladen." },
        { status: 400 }
      );
    }

    const parts: Record<string, unknown>[] = [];

    if (file instanceof File) {
      if (file.type !== "application/pdf") {
        return NextResponse.json(
          { error: "Nur PDF-Dateien werden für den Datei-Upload unterstützt." },
          { status: 400 }
        );
      }
      const buf = Buffer.from(await file.arrayBuffer());
      parts.push({
        inline_data: {
          mime_type: "application/pdf",
          data: buf.toString("base64"),
        },
      });
    }

    if (typeof text === "string" && text.trim()) {
      parts.push({ text: text.trim().slice(0, 100000) });
    }

    parts.push({
      text: "Extrahiere bzw. erstelle jetzt die Quizfragen aus dem obigen Inhalt als JSON gemäß Schema.",
    });

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
            maxOutputTokens: 8000,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return NextResponse.json(
        { error: `KI-Anfrage fehlgeschlagen: ${errText.slice(0, 300)}` },
        { status: 502 }
      );
    }

    const data = await geminiRes.json();
    const rawText: string | undefined =
      data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("");

    let questions: unknown[] = [];
    try {
      const parsedJson = rawText ? JSON.parse(rawText) : null;
      questions = Array.isArray(parsedJson?.questions) ? parsedJson.questions : [];
    } catch {
      questions = [];
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "Die KI konnte keine Fragen aus dem Dokument extrahieren." },
        { status: 422 }
      );
    }

    const cleaned = (questions as Record<string, unknown>[])
      .filter(
        (q) =>
          q &&
          typeof q.question === "string" &&
          Array.isArray(q.options) &&
          q.options.length >= 2 &&
          Array.isArray(q.correctIndices) &&
          q.correctIndices.length > 0
      )
      .map((q) => ({
        topic:
          typeof q.topic === "string" && q.topic.trim() ? q.topic.trim() : "Allgemein",
        question: q.question as string,
        options: (q.options as unknown[]).map((o) => String(o)),
        correctIndices: (q.correctIndices as unknown[])
          .map((i) => Number(i))
          .filter(
            (i) => Number.isInteger(i) && i >= 0 && i < (q.options as unknown[]).length
          ),
      }))
      .filter((q) => q.correctIndices.length > 0);

    return NextResponse.json({ questions: cleaned });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Verarbeitung fehlgeschlagen.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
