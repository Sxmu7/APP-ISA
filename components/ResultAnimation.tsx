"use client";

import { Check, X } from "lucide-react";

const CONFETTI_COLORS = [
  "bg-emerald-400",
  "bg-indigo-400",
  "bg-amber-400",
  "bg-rose-400",
  "bg-sky-400",
  "bg-violet-400",
];

export default function ResultAnimation({ passed }: { passed: boolean }) {
  return (
    <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
      {passed && (
        <>
          {/* Pulsierender Ring */}
          <span className="absolute inline-flex h-24 w-24 animate-ring-pop rounded-full bg-emerald-400/40" />

          {/* Konfetti */}
          {Array.from({ length: 10 }).map((_, i) => {
            const angle = (i / 10) * 360;
            const delay = `${(i % 5) * 0.06}s`;
            return (
              <span
                key={i}
                className={`absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-sm ${CONFETTI_COLORS[i % CONFETTI_COLORS.length]} animate-confetti-fall`}
                style={{
                  transform: `rotate(${angle}deg) translateX(28px)`,
                  animationDelay: delay,
                }}
              />
            );
          })}
        </>
      )}

      <div
        className={`flex h-20 w-20 items-center justify-center rounded-full ${
          passed
            ? "animate-result-pop bg-emerald-500/15"
            : "animate-result-shake bg-rose-500/15"
        }`}
      >
        {passed ? (
          <Check className="h-10 w-10 text-emerald-500" strokeWidth={3} />
        ) : (
          <X className="h-10 w-10 text-rose-500" strokeWidth={3} />
        )}
      </div>
    </div>
  );
}
