"use client";

import { cn } from "@/lib/utils";

export function QuestionCard({
  prompt,
  options,
  selectedId,
  correctId,
  revealed,
  onSelect,
}: {
  prompt: string;
  options: { id: string; text: string }[];
  selectedId: string | null;
  correctId: string | null;
  revealed: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <p className="font-display text-xl font-semibold text-ink">{prompt}</p>
      <div className="mt-6 flex flex-col gap-3">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          const isCorrectOption = revealed && correctId === option.id;
          const isWrongSelection = revealed && isSelected && correctId !== option.id;

          return (
            <button
              key={option.id}
              type="button"
              disabled={revealed}
              onClick={() => onSelect(option.id)}
              className={cn(
                "rounded-2xl border-2 px-4 py-3.5 text-left text-sm font-medium transition-colors",
                !revealed && !isSelected && "border-ink/10 hover:border-indigo/40",
                !revealed && isSelected && "border-indigo bg-indigo/5",
                isCorrectOption && "border-sage bg-sage/10 text-sage",
                isWrongSelection && "border-alert bg-alert/10 text-alert",
              )}
            >
              {option.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
