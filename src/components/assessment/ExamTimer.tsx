"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ExamTimer({
  initialSeconds,
  onExpire,
}: {
  initialSeconds: number;
  onExpire: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(
    Math.max(0, initialSeconds),
  );

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire();
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [secondsLeft, onExpire]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const low = secondsLeft <= 60;

  return (
    <span
      className={cn(
        "font-mono-basira text-lg font-semibold",
        low ? "text-alert" : "text-indigo",
      )}
      aria-live="polite"
    >
      {minutes}:{seconds.toString().padStart(2, "0")}
    </span>
  );
}
