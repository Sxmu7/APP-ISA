"use client";

import { useMemo, useState } from "react";
import { Question, Profile } from "@/lib/types";
import { shuffle } from "@/lib/questions";
import { isCardDue, reviewCard, getCardProgress } from "@/lib/storage";
import { ArrowLeft, Check, X, Layers, RotateCw } from "lucide-react";

export default function Flashcards({
  title,
  questions,
  profile,
  onProfileChange,
  onExit,
}: {
  title: string;
  questions: Question[];
  profile: Profile;
  onProfileChange: (p: Profile) => void;
  onExit: () => void;
}) {
  const dueQuestions = useMemo(
    () => shuffle(questions.filter((q) => isCardDue(profile, q.id))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [studyAll, setStudyAll] = useState(false);
  const [queue] = useState<Question[]>(
    dueQuestions.length > 0 ? dueQuestions : []
  );
  const allShuffled = useMemo(() => shuffle(questions), [questions]);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knewCount, setKnewCount] = useState(0);
  const [notKnewCount, setNotKnewCount] = useState(0);
  const [done, setDone] = useState(false);

  const activeQueue = studyAll ? allShuffled : queue;
  const current = activeQueue[idx];

  function answer(knewIt: boolean) {
    reviewCard(profile, current.id, knewIt);
    onProfileChange({ ...profile });
    if (knewIt) setKnewCount((c) => c + 1);
    else setNotKnewCount((c) => c + 1);

    if (idx + 1 >= activeQueue.length) {
      setDone(true);
    } else {
      setFlipped(false);
      setTimeout(() => setIdx((i) => i + 1), 120);
    }
  }

  if (!studyAll && queue.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <button onClick={onExit} className="btn-ghost mb-6 text-xs">
          <ArrowLeft className="h-3.5 w-3.5" />
          Zurück
        </button>
        <Layers className="mx-auto h-10 w-10 text-indigo-400" />
        <h2 className="mt-4 text-xl font-semibold">Alles erledigt für heute! 🎉</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Für {title} sind aktuell keine Karteikarten fällig. Komm morgen wieder oder
          übe freiwillig weiter.
        </p>
        <button onClick={() => setStudyAll(true)} className="btn-primary mt-6">
          <RotateCw className="h-4 w-4" />
          Trotzdem alle Karten üben
        </button>
      </div>
    );
  }

  if (done || !current) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h2 className="text-xl font-semibold">Session abgeschlossen</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {knewCount} gewusst · {notKnewCount} nochmal üben
        </p>
        <button onClick={onExit} className="btn-primary mt-6">
          Zur Übersicht
        </button>
      </div>
    );
  }

  const progress = getCardProgress(profile, current.id);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onExit} className="btn-ghost !px-2 text-xs">
          <ArrowLeft className="h-3.5 w-3.5" />
          Beenden
        </button>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {title} · Karte {idx + 1}/{activeQueue.length}
        </p>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          Box {progress.box}/5
        </span>
      </div>

      <div
        className={`flip-card h-72 cursor-pointer ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped((f) => !f)}
      >
        <div className="flip-card-inner h-full">
          <div className="flip-card-front card flex h-full flex-col items-center justify-center p-6 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-indigo-500">
              {current.topic}
            </p>
            <p className="text-lg font-semibold leading-snug">{current.question}</p>
            <p className="mt-6 text-xs text-slate-400">Tippen zum Umdrehen</p>
          </div>
          <div className="flip-card-back card flex h-full flex-col items-center justify-center bg-indigo-50 p-6 text-center dark:bg-indigo-500/10">
            <p className="text-base font-semibold text-indigo-700 dark:text-indigo-300">
              {current.options[current.correctIndex]}
            </p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              {current.explanation}
            </p>
          </div>
        </div>
      </div>

      {flipped ? (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => answer(false)}
            className="btn bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-500/15 dark:text-rose-300"
          >
            <X className="h-4 w-4" />
            Nicht gewusst
          </button>
          <button
            onClick={() => answer(true)}
            className="btn bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300"
          >
            <Check className="h-4 w-4" />
            Gewusst
          </button>
        </div>
      ) : (
        <p className="mt-5 text-center text-xs text-slate-400">
          Karte antippen, um die Antwort zu sehen
        </p>
      )}
    </div>
  );
}
