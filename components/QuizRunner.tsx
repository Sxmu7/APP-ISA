"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Question, Profile, LearnMode, SubjectId, AttemptRecord } from "@/lib/types";
import { noteFromPercent } from "@/lib/subjects";
import {
  addAttempt,
  addToWrongPool,
  removeFromWrongPool,
  newId,
} from "@/lib/storage";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
  PartyPopper,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

interface QuizRunnerProps {
  title: string;
  questions: Question[];
  mode: LearnMode;
  subjectForRecord: SubjectId | "mix";
  examStyle: boolean; // true = Klausursimulation (Timer, kein Sofort-Feedback, 50%-Grenze)
  profile: Profile;
  onProfileChange: (p: Profile) => void;
  onExit: () => void;
  onRetryWrong?: (questions: Question[]) => void;
}

const SECONDS_PER_QUESTION = 40;

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
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
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [locked, setLocked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    examStyle ? questions.length * SECONDS_PER_QUESTION : 0
  );
  const finishedRef = useRef(false);

  const current = questions[index];
  const total = questions.length;
  const isLast = index === total - 1;

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

  function selectOption(optIndex: number) {
    if (locked && !examStyle) return;
    if (examStyle) {
      setAnswers((prev) => ({ ...prev, [current.id]: optIndex }));
      return;
    }
    if (answers[current.id] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [current.id]: optIndex }));
    setLocked(true);

    const correct = optIndex === current.correctIndex;
    if (correct) {
      removeFromWrongPool(profile, current.subject, current.id);
    } else {
      addToWrongPool(profile, current.subject, current.id);
    }
    onProfileChange({ ...profile });
  }

  function goNext() {
    if (isLast) {
      finishQuiz();
      return;
    }
    setIndex((i) => i + 1);
    setLocked(false);
  }

  function goPrev() {
    if (index === 0) return;
    setIndex((i) => i - 1);
    setLocked(false);
  }

  function finishQuiz() {
    finishedRef.current = true;
    let correct = 0;
    const wrongIds: string[] = [];
    for (const q of questions) {
      const sel = answers[q.id];
      if (sel === q.correctIndex) {
        correct += 1;
        if (examStyle) removeFromWrongPool(profile, q.subject, q.id);
      } else {
        wrongIds.push(q.id);
        if (examStyle) addToWrongPool(profile, q.subject, q.id);
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
      if (answers[q.id] === q.correctIndex) correct += 1;
      else wrongQuestions.push(q);
    }
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = percent >= 50;

    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="card animate-pop p-8 text-center">
          {examStyle ? (
            passed ? (
              <PartyPopper className="mx-auto h-10 w-10 text-emerald-500" />
            ) : (
              <AlertTriangle className="mx-auto h-10 w-10 text-rose-500" />
            )
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
            const sel = answers[q.id];
            const correctAns = sel === q.correctIndex;
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
                      Richtige Antwort: {q.options[q.correctIndex]}
                    </p>
                    {sel !== undefined && sel !== q.correctIndex && (
                      <p className="text-xs text-rose-500">Deine Antwort: {q.options[sel]}</p>
                    )}
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const selected = answers[current.id];
  const showResultColors = !examStyle && selected !== undefined;

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
              timeLeft < 60
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
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-indigo-500">
          {current.topic}
        </p>
        <h2 className="text-lg font-semibold leading-snug">{current.question}</h2>

        <div className="mt-5 space-y-2">
          {current.options.map((opt, i) => {
            let style =
              "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:hover:bg-slate-800";
            if (examStyle && selected === i) {
              style = "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10";
            }
            if (showResultColors) {
              if (i === current.correctIndex) {
                style = "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10";
              } else if (i === selected) {
                style = "border-rose-500 bg-rose-50 dark:bg-rose-500/10";
              } else {
                style = "border-slate-200 opacity-60 dark:border-slate-700";
              }
            }
            return (
              <button
                key={i}
                onClick={() => selectOption(i)}
                disabled={showResultColors}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${style}`}
              >
                <span>{opt}</span>
                {showResultColors && i === current.correctIndex && (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                )}
                {showResultColors && i === selected && i !== current.correctIndex && (
                  <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
                )}
              </button>
            );
          })}
        </div>

        {showResultColors && (
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
            <button
              onClick={goNext}
              disabled={selected === undefined}
              className="btn-primary"
            >
              {isLast ? "Fertig" : "Weiter"}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
