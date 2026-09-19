"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ExamTimer({
  durationMinutes,
  onExpire,
}: {
  durationMinutes: number;
  onExpire: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, onExpire]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const low = secondsLeft < 60;

  return (
    <span
      className={cn(
        "font-mono-basira text-lg font-semibold",
        low ? "text-alert" : "text-indigo",
      )}
    >
      {minutes}:{seconds.toString().padStart(2, "0")}
    </span>
  );
}
