"use client";

import { useTransition } from "react";
import { togglePublished } from "@/lib/actions/admin-content";
import { cn } from "@/lib/utils";

export function PublishToggle({
  questionId,
  isPublished,
}: {
  questionId: string;
  isPublished: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => togglePublished(questionId, !isPublished))}
      className={cn(
        "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
        isPublished ? "bg-sage/10 text-sage" : "bg-ink/10 text-ink/50",
      )}
    >
      {isPublished ? "Published" : "Draft"}
    </button>
  );
}
