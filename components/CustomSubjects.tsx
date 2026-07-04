"use client";

import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Profile, CustomSubject, Question } from "@/lib/types";
import { addCustomSubject, removeCustomSubject, newId } from "@/lib/storage";
import { parseRowsToQuestions, ParsedQuestion } from "@/lib/spreadsheetParser";
import { extractPdfText } from "@/lib/pdfText";
import {
  ArrowLeft,
  BookPlus,
  FileSpreadsheet,
  Sparkles,
  Trash2,
  Upload,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Layers,
  X,
  FileText,
} from "lucide-react";

const MAX_AI_FILES = 5;
// Text ist um Größenordnungen kleiner als das PDF-Original – trotzdem eine
// großzügige Obergrenze, damit eine Anfrage nicht ausufert.
const MAX_TEXT_CHARS = 300000;

interface PdfDoc {
  name: string;
  text: string;
  pageCount: number;
  looksScanned: boolean;
}

type Step = "list" | "name" | "method" | "excel" | "ai" | "preview";

export default function CustomSubjects({
  profile,
  onProfileChange,
  onExit,
}: {
  profile: Profile;
  onProfileChange: (p: Profile) => void;
  onExit: () => void;
}) {
  const [step, setStep] = useState<Step>("list");
  const [name, setName] = useState("");
  const [aiText, setAiText] = useState("");
  const [pdfDocs, setPdfDocs] = useState<PdfDoc[]>([]);
  const [extracting, setExtracting] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [parsed, setParsed] = useState<ParsedQuestion[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  function resetFlow() {
    setStep("list");
    setName("");
    setAiText("");
    setPdfDocs([]);
    setExtracting(null);
    setError(null);
    setWarnings([]);
    setParsed([]);
    setLoading(false);
  }

  function startNew() {
    setStep("name");
    setError(null);
  }

  function confirmName(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError("Bitte gib deinem Fach einen Namen (mind. 2 Zeichen).");
      return;
    }
    setError(null);
    setStep("method");
  }

  async function handleExcelFile(file: File) {
    setError(null);
    setLoading(true);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
      const result = parseRowsToQuestions(rows);
      if (result.questions.length === 0) {
        setError(
          result.warnings[0] ||
            "Es konnten keine Fragen aus der Datei gelesen werden. Prüfe die Spaltenüberschriften."
        );
        setLoading(false);
        return;
      }
      setParsed(result.questions);
      setWarnings(result.warnings);
      setStep("preview");
    } catch {
      setError("Die Datei konnte nicht gelesen werden. Ist es eine gültige Excel- oder CSV-Datei?");
    } finally {
      setLoading(false);
    }
  }

  async function handlePdfFiles(files: File[]) {
    setError(null);
    const room = MAX_AI_FILES - pdfDocs.length;
    const toProcess = files.slice(0, Math.max(room, 0));
    for (const file of toProcess) {
      setExtracting(file.name);
      try {
        const result = await extractPdfText(file);
        setPdfDocs((prev) => [
          ...prev,
          { name: file.name, text: result.text, pageCount: result.pageCount, looksScanned: result.looksScanned },
        ]);
      } catch {
        setError(
          `Text aus "${file.name}" konnte nicht gelesen werden. Ist die Datei ein gültiges, nicht passwortgeschütztes PDF?`
        );
      }
    }
    setExtracting(null);
  }

  const totalTextChars =
    aiText.trim().length + pdfDocs.reduce((sum, d) => sum + d.text.length, 0);
  const textTooLong = totalTextChars > MAX_TEXT_CHARS;
  const scannedDocs = pdfDocs.filter((d) => d.looksScanned);

  async function handleAiSubmit() {
    if (!aiText.trim() && pdfDocs.length === 0) {
      setError("Bitte füge Text ein oder lade mindestens eine PDF-Datei hoch.");
      return;
    }
    if (textTooLong) {
      setError(
        `Der Text ist zusammen zu lang (${totalTextChars.toLocaleString("de-DE")} von max. ${MAX_TEXT_CHARS.toLocaleString(
          "de-DE"
        )} Zeichen). Bitte weniger Dokumente auf einmal verarbeiten.`
      );
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const combinedParts = [aiText.trim()];
      for (const doc of pdfDocs) {
        combinedParts.push(`--- Dokument: ${doc.name} ---\n${doc.text}`);
      }
      const combinedText = combinedParts.filter(Boolean).join("\n\n");

      const fd = new FormData();
      fd.append("text", combinedText);
      const res = await fetch("/api/parse-questions", { method: "POST", body: fd });

      // Falls der Server ausnahmsweise keine gültige JSON-Antwort liefert
      // (z.B. eine Fehlerseite), würde res.json() sonst mit einem
      // kryptischen Parse-Fehler abstürzen – das fangen wir sauber ab.
      let data: { questions?: ParsedQuestion[]; error?: string };
      try {
        data = await res.json();
      } catch {
        throw new Error(
          `Unerwartete Antwort vom Server (Status ${res.status}). Bitte erneut versuchen.`
        );
      }

      if (!res.ok) throw new Error(data.error || `Verarbeitung fehlgeschlagen (Status ${res.status}).`);
      const questions: ParsedQuestion[] | undefined = data.questions;
      if (!questions || questions.length === 0) {
        setError("Die KI konnte keine Fragen erkennen. Versuch es mit mehr Text oder einem anderen Dokument.");
        return;
      }
      setParsed(questions);
      setWarnings([]);
      setStep("preview");
    } catch (err) {
      const isNetworkError =
        err instanceof TypeError ||
        (err instanceof Error && /load failed|failed to fetch/i.test(err.message));
      setError(
        isNetworkError
          ? "Die Anfrage konnte nicht gesendet werden. Bitte Internetverbindung prüfen und erneut versuchen."
          : err instanceof Error
          ? err.message
          : "Etwas ist schiefgelaufen."
      );
    } finally {
      setLoading(false);
    }
  }

  function saveSubject() {
    const subjectId = `custom-${newId()}`;
    const questions: Question[] = parsed.map((p) => ({
      id: newId(),
      subject: subjectId,
      topic: p.topic,
      question: p.question,
      options: p.options,
      correctIndices: p.correctIndices,
    }));
    const subject: CustomSubject = {
      id: subjectId,
      name: name.trim(),
      createdAt: new Date().toISOString(),
      questions,
    };
    addCustomSubject(profile, subject);
    onProfileChange({ ...profile });
    resetFlow();
  }

  function deleteSubject(id: string) {
    if (!confirm("Dieses Fach inkl. aller Fragen wirklich löschen?")) return;
    removeCustomSubject(profile, id);
    onProfileChange({ ...profile });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <button onClick={onExit} className="btn-ghost mb-4 !px-2 text-xs">
        <ArrowLeft className="h-3.5 w-3.5" />
        Zur Übersicht
      </button>

      <div className="mb-6 flex items-center gap-2">
        <Layers className="h-5 w-5 text-indigo-500" />
        <h1 className="text-xl font-bold">Meine Fächer</h1>
      </div>

      {step === "list" && (
        <div className="space-y-3">
          {(profile.customSubjects || []).length === 0 && (
            <div className="card p-6 text-center text-sm text-slate-400">
              Du hast noch keine eigenen Fächer. Lade eine Excel/CSV-Datei hoch oder lass die KI
              aus einem Text oder PDF Fragen erstellen.
            </div>
          )}
          {(profile.customSubjects || []).map((s) => (
            <div key={s.id} className="card flex items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {s.questions.length} Fragen
                </p>
              </div>
              <button
                onClick={() => deleteSubject(s.id)}
                className="btn-ghost !px-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                title="Fach löschen"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          <button
            onClick={startNew}
            className="card flex w-full items-center justify-center gap-2 border-2 border-dashed p-6 text-sm font-medium text-indigo-600 transition hover:border-indigo-400 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10"
          >
            <BookPlus className="h-5 w-5" />
            Neues Fach hinzufügen
          </button>
        </div>
      )}

      {step === "name" && (
        <form onSubmit={confirmName} className="card space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Wie soll das Fach heißen?
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Statistik I"
              className="input"
              maxLength={40}
            />
          </div>
          {error && <p className="text-xs text-rose-500">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={resetFlow} className="btn-secondary">
              Abbrechen
            </button>
            <button type="submit" className="btn-primary">
              Weiter
            </button>
          </div>
        </form>
      )}

      {step === "method" && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Fach <span className="font-medium text-slate-700 dark:text-slate-300">{name}</span> –
            wie möchtest du die Fragen hinzufügen?
          </p>
          <button
            onClick={() => setStep("excel")}
            className="card flex w-full items-center gap-3 p-5 text-left transition hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Excel oder CSV hochladen</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Spalten: Thema, Frage, Antwort A-F, Richtige Antwort
              </p>
            </div>
          </button>
          <button
            onClick={() => setStep("ai")}
            className="card flex w-full items-center gap-3 p-5 text-left transition hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Mit KI aus Text oder PDF erstellen</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Text einfügen oder ein beliebiges PDF hochladen
              </p>
            </div>
          </button>
          <button onClick={resetFlow} className="btn-ghost text-xs">
            Abbrechen
          </button>
        </div>
      )}

      {step === "excel" && (
        <div className="card space-y-4 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Die Datei sollte Spalten wie <strong>Thema</strong>, <strong>Frage</strong>,{" "}
            <strong>Antwort A</strong> bis <strong>Antwort F</strong> und{" "}
            <strong>Richtige Antwort</strong> (z.B. „B“ oder „ACD“ bei mehreren) enthalten.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleExcelFile(f);
            }}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {loading ? "Wird gelesen…" : "Datei auswählen"}
          </button>
          {error && (
            <p className="flex items-start gap-1.5 text-xs text-rose-500">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {error}
            </p>
          )}
          <button onClick={resetFlow} className="btn-ghost text-xs">
            Abbrechen
          </button>
        </div>
      )}

      {step === "ai" && (
        <div className="card space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Text einfügen (optional)
            </label>
            <textarea
              value={aiText}
              onChange={(e) => setAiText(e.target.value)}
              rows={6}
              placeholder="Vorlesungsnotizen, Zusammenfassung, Fragenkatalog …"
              className="input resize-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Oder ein oder mehrere PDFs hochladen (optional)
            </label>
            <p className="mb-2 text-xs text-slate-400">
              Der Text wird direkt in deinem Browser aus dem PDF gelesen – die Datei selbst wird
              nicht hochgeladen, dadurch funktionieren auch größere Skripte.
            </p>
            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              multiple
              onChange={(e) => {
                const newFiles = Array.from(e.target.files || []);
                handlePdfFiles(newFiles);
                e.target.value = "";
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => pdfInputRef.current?.click()}
              disabled={pdfDocs.length >= MAX_AI_FILES || extracting !== null}
              className="btn-secondary w-full"
            >
              {extracting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {extracting
                ? `Lese Text aus "${extracting}"…`
                : pdfDocs.length === 0
                ? "PDFs auswählen"
                : `Weitere PDF hinzufügen (${pdfDocs.length}/${MAX_AI_FILES})`}
            </button>
            {pdfDocs.length > 0 && (
              <ul className="mt-2 space-y-1">
                {pdfDocs.map((d, i) => (
                  <li
                    key={`${d.name}-${i}`}
                    className="flex items-center justify-between gap-2 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs dark:bg-slate-800"
                  >
                    <span className="flex min-w-0 items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">
                        {d.name}{" "}
                        <span className="text-slate-400">
                          ({d.pageCount} {d.pageCount === 1 ? "Seite" : "Seiten"})
                        </span>
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setPdfDocs((prev) => prev.filter((_, idx) => idx !== i))}
                      className="shrink-0 text-slate-400 hover:text-rose-500"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {scannedDocs.length > 0 && (
              <p className="mt-2 flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {scannedDocs.map((d) => d.name).join(", ")} enthält kaum erkennbaren Text – vermutlich
                ein eingescanntes PDF ohne Textebene. Bitte Text stattdessen oben einfügen oder ein
                Original-PDF verwenden.
              </p>
            )}
            {textTooLong && (
              <p className="mt-2 text-xs text-rose-500">
                Zusammen {totalTextChars.toLocaleString("de-DE")} von max.{" "}
                {MAX_TEXT_CHARS.toLocaleString("de-DE")} Zeichen – bitte ein Dokument entfernen.
              </p>
            )}
          </div>
          {error && (
            <p className="flex items-start gap-1.5 text-xs text-rose-500">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button onClick={resetFlow} className="btn-ghost text-xs">
              Abbrechen
            </button>
            <button
              onClick={handleAiSubmit}
              disabled={loading || textTooLong || extracting !== null}
              className="btn-primary"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? "KI erstellt Fragen…" : "Fragen erstellen"}
            </button>
          </div>
        </div>
      )}

      {step === "preview" && (
        <div className="space-y-4">
          <div className="card p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              {parsed.length} Fragen bereit zur Übernahme
            </p>
            {warnings.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-amber-600 dark:text-amber-400">
                {warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto">
            {parsed.slice(0, 15).map((q, i) => (
              <div key={i} className="card p-3 text-sm">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-indigo-500">
                  {q.topic}
                </p>
                <p className="font-medium">{q.question}</p>
              </div>
            ))}
            {parsed.length > 15 && (
              <p className="text-center text-xs text-slate-400">
                … und {parsed.length - 15} weitere
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={resetFlow} className="btn-secondary">
              Verwerfen
            </button>
            <button onClick={saveSubject} className="btn-primary">
              <BookPlus className="h-4 w-4" />
              Fach speichern
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
