"use client";

import { useMemo, useRef, useState } from "react";
import { Profile, ExamEvent, SubjectId } from "@/lib/types";
import { subjectList } from "@/lib/subjects";
import {
  addExamEvent,
  removeExamEvent,
  newId,
  daysUntil,
  todayISO,
  toLocalISODate,
  parseLocalISODate,
} from "@/lib/storage";
import { generateIcs, parseIcsToEvents } from "@/lib/ics";
import { SubjectIcon } from "@/lib/subjectIcon";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  CalendarDays,
  Download,
  Upload,
} from "lucide-react";

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

export default function CalendarView({
  profile,
  onProfileChange,
}: {
  profile: Profile;
  onProfileChange: (p: Profile) => void;
}) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<SubjectId | "sonstiges">("soziologie");
  const [notes, setNotes] = useState("");
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const icsInputRef = useRef<HTMLInputElement>(null);

  const eventsByDate = useMemo(() => {
    const map: Record<string, ExamEvent[]> = {};
    for (const e of profile.examEvents) {
      map[e.date] = map[e.date] ? [...map[e.date], e] : [e];
    }
    return map;
  }, [profile.examEvents]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Montag = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  function addEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addExamEvent(profile, {
      id: newId(),
      subject,
      title: title.trim(),
      date: selectedDate,
      notes: notes.trim() || undefined,
    });
    onProfileChange({ ...profile });
    setTitle("");
    setNotes("");
  }

  function deleteEvent(id: string) {
    removeExamEvent(profile, id);
    onProfileChange({ ...profile });
  }

  function exportIcs() {
    const ics = generateIcs(profile);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "studyflow-kalender.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function importIcsFile(file: File) {
    setImportMessage(null);
    try {
      const text = await file.text();
      const parsed = parseIcsToEvents(text);
      const existing = new Set(profile.examEvents.map((e) => `${e.date}__${e.title}`));
      let added = 0;
      for (const ev of parsed) {
        const key = `${ev.date}__${ev.title}`;
        if (existing.has(key)) continue;
        existing.add(key);
        addExamEvent(profile, {
          id: newId(),
          subject: "sonstiges",
          title: ev.title,
          date: ev.date,
          notes: ev.notes,
        });
        added += 1;
      }
      onProfileChange({ ...profile });
      setImportMessage(
        added > 0
          ? `${added} Termin${added === 1 ? "" : "e"} importiert.`
          : parsed.length === 0
          ? "Keine Termine in der Datei gefunden."
          : "Alle Termine waren schon vorhanden."
      );
    } catch {
      setImportMessage("Die Datei konnte nicht gelesen werden. Ist es eine gültige .ics-Datei?");
    }
  }

  const sortedUpcoming = [...profile.examEvents]
    .filter((e) => e.date >= todayISO())
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-indigo-500" />
          <h1 className="text-xl font-bold">Klausurkalender</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={exportIcs} className="btn-secondary py-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            Als .ics exportieren
          </button>
          <input
            ref={icsInputRef}
            type="file"
            accept=".ics,text/calendar"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importIcsFile(f);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => icsInputRef.current?.click()}
            className="btn-secondary py-1.5 text-xs"
          >
            <Upload className="h-3.5 w-3.5" />
            .ics importieren
          </button>
        </div>
      </div>

      {importMessage && (
        <div className="mb-4 rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
          {importMessage}
        </div>
      )}
      <p className="mb-6 text-xs text-slate-400">
        Exportierte Datei kann in Google Calendar, Apple Kalender oder Outlook importiert
        werden. Import funktioniert mit .ics-Exports aus diesen Kalendern.
      </p>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="card p-4">
          <div className="mb-4 flex items-center justify-between">
            <button
              className="btn-ghost !px-2"
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="font-semibold">
              {MONTHS[month]} {year}
            </p>
            <button
              className="btn-ghost !px-2"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-400">
            {WEEKDAYS.map((w) => (
              <div key={w} className="py-1">
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const iso = toLocalISODate(d);
              const dayEvents = eventsByDate[iso] || [];
              const isToday = iso === todayISO();
              const isSelected = iso === selectedDate;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(iso)}
                  className={`relative flex h-12 flex-col items-center justify-center rounded-lg text-sm transition ${
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : isToday
                      ? "bg-indigo-50 font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {d.getDate()}
                  {dayEvents.length > 0 && (
                    <span
                      className={`absolute bottom-1.5 h-1.5 w-1.5 rounded-full ${
                        isSelected ? "bg-white" : "bg-rose-500"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <form onSubmit={addEvent} className="mt-5 space-y-3 border-t border-slate-200 pt-4 dark:border-slate-800">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Neuer Termin am {parseLocalISODate(selectedDate).toLocaleDateString("de-DE")}
            </p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Klausur Soziologie"
              className="input"
            />
            <div className="flex gap-2">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectId | "sonstiges")}
                className="input"
              >
                {subjectList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
                <option value="sonstiges">Sonstiges</option>
              </select>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input"
              />
            </div>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notiz (optional)"
              className="input"
            />
            <button type="submit" className="btn-primary w-full">
              <Plus className="h-4 w-4" />
              Termin hinzufügen
            </button>
          </form>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Kommende Termine
          </p>
          {sortedUpcoming.length === 0 && (
            <div className="card p-4 text-sm text-slate-400">
              Noch keine Klausurtermine eingetragen.
            </div>
          )}
          {sortedUpcoming.map((e) => (
            <div key={e.id} className="card flex items-start justify-between gap-2 p-3">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                  <SubjectIcon id={e.subject} className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {parseLocalISODate(e.date).toLocaleDateString("de-DE", {
                      weekday: "short",
                      day: "2-digit",
                      month: "2-digit",
                    })}{" "}
                    ·{" "}
                    {daysUntil(e.date) === 0
                      ? "heute"
                      : daysUntil(e.date) === 1
                      ? "morgen"
                      : `in ${daysUntil(e.date)} Tagen`}
                  </p>
                  {e.notes && (
                    <p className="mt-0.5 text-xs text-slate-400">{e.notes}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteEvent(e.id)}
                className="btn-ghost !px-1.5 !py-1 text-slate-400 hover:text-rose-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
