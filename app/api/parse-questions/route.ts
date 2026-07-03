import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth";

export const maxDuration = 60;

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
- Vergib zu jeder Frage ein kurzes Themen-Schlagwort (topic), z.B. den Abschnittstitel.`;

const EXTRACT_TOOL = {
  name: "extract_questions",
  description: "Speichert die aus dem Dokument extrahierten bzw. erstellten Quizfragen.",
  input_schema: {
    type: "object" as const,
    properties: {
      questions: {
        type: "array" as const,
        items: {
          type: "object" as const,
          properties: {
            topic: { type: "string" as const, description: "Kurzes Themen-Schlagwort" },
            question: { type: "string" as const },
            options: {
              type: "array" as const,
              items: { type: "string" as const },
              minItems: 2,
              maxItems: 6,
            },
            correctIndices: {
              type: "array" as const,
              items: { type: "integer" as const },
              minItems: 1,
              description: "0-basierte Indizes der richtigen Antwort(en) in 'options'",
            },
          },
          required: ["question", "options", "correctIndices"],
        },
      },
    },
    required: ["questions"],
  },
};

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session) {
      return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "ANTHROPIC_API_KEY fehlt. Bitte in den Vercel-Projekteinstellungen unter Environment Variables hinterlegen.",
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

    const content: Record<string, unknown>[] = [];

    if (file instanceof File) {
      if (file.type !== "application/pdf") {
        return NextResponse.json(
          { error: "Nur PDF-Dateien werden für den Datei-Upload unterstützt." },
          { status: 400 }
        );
      }
      const buf = Buffer.from(await file.arrayBuffer());
      content.push({
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: buf.toString("base64"),
        },
      });
    }

    if (typeof text === "string" && text.trim()) {
      content.push({ type: "text", text: text.trim().slice(0, 100000) });
    }

    content.push({
      type: "text",
      text: "Extrahiere bzw. erstelle jetzt die Quizfragen aus dem obigen Inhalt und rufe das Tool 'extract_questions' auf.",
    });

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        tools: [EXTRACT_TOOL],
        tool_choice: { type: "tool", name: "extract_questions" },
        messages: [{ role: "user", content }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return NextResponse.json(
        { error: `KI-Anfrage fehlgeschlagen: ${errText.slice(0, 300)}` },
        { status: 502 }
      );
    }

    const data = await anthropicRes.json();
    const toolUse = (data.content || []).find(
      (block: { type: string }) => block.type === "tool_use"
    );
    const questions = toolUse?.input?.questions;

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "Die KI konnte keine Fragen aus dem Dokument extrahieren." },
        { status: 422 }
      );
    }

    const cleaned = questions
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
        topic: typeof q.topic === "string" && q.topic.trim() ? q.topic.trim() : "Allgemein",
        question: q.question,
        options: q.options.map((o: unknown) => String(o)),
        correctIndices: q.correctIndices
          .map((i: unknown) => Number(i))
          .filter((i: number) => Number.isInteger(i) && i >= 0 && i < q.options.length),
      }))
      .filter((q) => q.correctIndices.length > 0);

    return NextResponse.json({ questions: cleaned });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Verarbeitung fehlgeschlagen.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
