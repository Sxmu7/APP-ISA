"use client";

import { useEffect, useRef, useState } from "react";
import { Question, Profile, LearnMode, AttemptRecord } from "@/lib/types";
import { noteFromPercent } from "@/lib/subjects";
import {
  addAttempt,
  addToWrongPool,
  removeFromWrongPool,
  recordMistake,
  newId,
} from "@/lib/storage";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  ListChecks,
} from "lucide-react";
import ResultAnimation from "./ResultAnimation";

interface QuizRunnerProps {
  title: string;
  questions: Question[];
  mode: LearnMode;
  subjectForRecord: string; // SubjectId, "mix" oder eigene CustomSubject-ID
  examStyle: boolean; // true = Klausursimulation (fester 60-Min-Timer, kein Sofort-Feedback, 50%-Grenze)
  profile: Profile;
  onProfileChange: (p: Profile) => void;
  onExit: () => void;
  onRetryWrong?: (questions: Question[]) => void;
}

// Klausursimulation: immer 30 Fragen, immer 60 Minuten Gesamtzeit (kein Timer pro Frage).
export const EXAM_QUESTION_COUNT = 30;
const EXAM_TOTAL_SECONDS = 60 * 60;

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function sameSet(a: number[] | undefined, b: number[]): boolean {
  const arrA = a || [];
  if (arrA.length !== b.length) return false;
  const as = [...arrA].sort((x, y) => x - y).join(",");
  const bs = [...b].sort((x, y) => x - y).join(",");
  return as === bs;
}

export default function QuizRunner({
  title,
  questions,
  mode,
  subjectForRecord,
  examStyle,
  profile,
  onProfileChange,
  onExit,
  onRetryWrong,
}: QuizRunnerProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [lockedMap, setLockedMap] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(examStyle ? EXAM_TOTAL_SECONDS : 0);
  const finishedRef = useRef(false);

  const current = questions[index];
  const total = questions.length;
  const isLast = index === total - 1;
  const isMulti = current ? current.correctIndices.length > 1 : false;
  const currentSelection = current ? answers[current.id] || [] : [];
  const isLocked = current ? !!lockedMap[current.id] : false;

  useEffect(() => {
    if (!examStyle || finished) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          if (!finishedRef.current) finishQuiz();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examStyle, finished]);

  if (!current) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-slate-500">Keine Fragen verfügbar.</p>
        <button onClick={onExit} className="btn-secondary mt-4">
          Zurück
        </button>
      </div>
    );
  }

  function evaluateAndLock(qId: string, selection: number[], question: Question) {
    const correct = sameSet(selection, question.correctIndices);
    if (correct) {
      removeFromWrongPool(profile, question.subject, question.id);
    } else {
      addToWrongPool(profile, question.subject, question.id);
      recordMistake(profile, question.id);
    }
    setLockedMap((prev) => ({ ...prev, [qId]: true }));
    onProfileChange({ ...profile });
  }

  function selectOption(optIndex: number) {
    if (examStyle) {
      setAnswers((prev) => {
        const existing = prev[current.id] || [];
        if (isMulti) {
          const next = existing.includes(optIndex)
            ? existing.filter((i) => i !== optIndex)
            : [...existing, optIndex];
          return { ...prev, [current.id]: next };
        }
        return { ...prev, [current.id]: [optIndex] };
      });
      return;
    }

    // Übungs-/Wiederholungs-/Mix-Modus
    if (isLocked) return;

    if (isMulti) {
      setAnswers((prev) => {
        const existing = prev[current.id] || [];
        const next = existing.includes(optIndex)
          ? existing.filter((i) => i !== optIndex)
          : [...existing, optIndex];
        return { ...prev, [current.id]: next };
      });
    } else {
      const selection = [optIndex];
      setAnswers((prev) => ({ ...prev, [current.id]: selection }));
      evaluateAndLock(current.id, selection, current);
    }
  }

  function submitMultiAnswer() {
    if (isLocked || currentSelection.length === 0) return;
    evaluateAndLock(current.id, currentSelection, current);
  }

  function goNext() {
    if (isLast) {
      finishQuiz();
      return;
    }
    setIndex((i) => i + 1);
  }

  function goPrev() {
    if (index === 0) return;
    setIndex((i) => i - 1);
  }

  function finishQuiz() {
    finishedRef.current = true;
    let correct = 0;
    const wrongIds: string[] = [];
    for (const q of questions) {
      const sel = answers[q.id];
      const ok = sameSet(sel, q.correctIndices);
      if (ok) {
        correct += 1;
        if (examStyle) removeFromWrongPool(profile, q.subject, q.id);
      } else {
        wrongIds.push(q.id);
        if (examStyle) {
          addToWrongPool(profile, q.subject, q.id);
          recordMistake(profile, q.id);
        }
      }
    }
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = percent >= 50;

    if (examStyle) {
      const record: AttemptRecord = {
        id: newId(),
        subject: subjectForRecord,
        mode,
        date: new Date().toISOString(),
        correct,
        total,
        percent,
        passed,
        note: noteFromPercent(percent),
        wrongQuestionIds: wrongIds,
      };
      addAttempt(profile, record);
    }
    onProfileChange({ ...profile });
    setFinished(true);
  }

  if (finished) {
    let correct = 0;
    const wrongQuestions: Question[] = [];
    for (const q of questions) {
      if (sameSet(answers[q.id], q.correctIndices)) correct += 1;
      else wrongQuestions.push(q);
    }
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = percent >= 50;

    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="card animate-pop p-8 text-center">
          {examStyle ? (
            <ResultAnimation passed={passed} />
          ) : (
            <CheckCircle2 className="mx-auto h-10 w-10 text-indigo-500" />
          )}
          <h2 className="mt-4 text-2xl font-bold">
            {correct} / {total} richtig ({percent}%)
          </h2>
          {examStyle && (
            <p
              className={`mt-2 text-lg font-semibold ${
                passed ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              }`}
            >
              Note {noteFromPercent(percent)} · {passed ? "Bestanden 🎉" : "Nicht bestanden – Grenze liegt bei 50%"}
            </p>
          )}
          {!examStyle && (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Weiter so! Falsch beantwortete Fragen landen automatisch im Wiederholungsmodus.
            </p>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {wrongQuestions.length > 0 && onRetryWrong && (
              <button
                onClick={() => onRetryWrong(wrongQuestions)}
                className="btn-primary"
              >
                <RotateCcw className="h-4 w-4" />
                {wrongQuestions.length} Fehler wiederholen
              </button>
            )}
            <button onClick={onExit} className="btn-secondary">
              Zur Übersicht
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {questions.map((q) => {
            const sel = answers[q.id] || [];
            const correctAns = sameSet(sel, q.correctIndices);
            const correctText = q.correctIndices.map((i) => q.options[i]).join(" · ");
            const selText = sel.map((i) => q.options[i]).join(" · ");
            return (
              <div key={q.id} className="card p-4">
                <div className="flex items-start gap-2">
                  {correctAns ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{q.question}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Richtige Antwort: {correctText}
                    </p>
                    {!correctAns && sel.length > 0 && (
                      <p className="text-xs text-rose-500">Deine Antwort: {selText}</p>
                    )}
                    {q.explanation && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const showResultColors = !examStyle && isLocked;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onExit} className="btn-ghost !px-2 text-xs">
          <ArrowLeft className="h-3.5 w-3.5" />
          Beenden
        </button>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {title} · Frage {index + 1}/{total}
        </p>
        {examStyle ? (
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              timeLeft < 300
                ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            {formatTime(timeLeft)}
          </span>
        ) : (
          <span className="w-14" />
        )}
      </div>

      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full bg-indigo-500 transition-all"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <div className="card animate-fade-in p-6">
        <div className="mb-1 flex items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-500">
            {current.topic}
          </p>
          {isMulti && (
            <span className="flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
              <ListChecks className="h-3 w-3" />
              Mehrere Antworten möglich
            </span>
          )}
        </div>
        <h2 className="text-lg font-semibold leading-snug">{current.question}</h2>

        <div className="mt-5 space-y-2">
          {current.options.map((opt, i) => {
            const isSelected = currentSelection.includes(i);
            const isCorrectOption = current.correctIndices.includes(i);
            let style =
              "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:hover:bg-slate-800";

            if (examStyle && isSelected) {
              style = "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10";
            }
            if (showResultColors) {
              if (isCorrectOption) {
                style = "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10";
              } else if (isSelected) {
                style = "border-rose-500 bg-rose-50 dark:bg-rose-500/10";
              } else {
                style = "border-slate-200 opacity-60 dark:border-slate-700";
              }
            } else if (!examStyle && isSelected) {
              style = "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10";
            }

            return (
              <button
                key={i}
                onClick={() => selectOption(i)}
                disabled={showResultColors}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${style}`}
              >
                <span>{opt}</span>
                {showResultColors && isCorrectOption && (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                )}
                {showResultColors && isSelected && !isCorrectOption && (
                  <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
                )}
              </button>
            );
          })}
        </div>

        {!examStyle && isMulti && !isLocked && (
          <button
            onClick={submitMultiAnswer}
            disabled={currentSelection.length === 0}
            className="btn-primary mt-4 w-full"
          >
            Antwort prüfen
          </button>
        )}

        {showResultColors && current.explanation && (
          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
            {current.explanation}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={goPrev}
            disabled={index === 0}
            className="btn-ghost text-xs disabled:opacity-30"
          >
            Zurück
          </button>
          {examStyle ? (
            <button onClick={goNext} className="btn-primary">
              {isLast ? "Klausur abgeben" : "Weiter"}
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={goNext} disabled={!isLocked} className="btn-primary">
              {isLast ? "Fertig" : "Weiter"}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
