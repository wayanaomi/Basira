"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function FeedbackPanel({
  isCorrect,
  explanation,
  onContinue,
}: {
  isCorrect: boolean;
  explanation: string;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t-2 p-6",
        isCorrect ? "border-sage bg-sage/10" : "border-alert bg-alert/10",
      )}
    >
      <div className="mx-auto flex max-w-xl flex-col gap-3">
        <p className={cn("font-display text-lg font-semibold", isCorrect ? "text-sage" : "text-alert")}>
          {isCorrect ? "That's it." : "That one's tricky."}
        </p>
        <p className="text-sm text-ink/70">{explanation}</p>
        <button
          type="button"
          onClick={onContinue}
          className={cn(
            "self-start rounded-full px-6 py-2.5 text-sm font-semibold text-paper",
            isCorrect ? "bg-sage" : "bg-alert",
          )}
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
