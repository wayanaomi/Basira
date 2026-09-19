import { cn } from "@/lib/utils";
import type { LevelInfo } from "@/lib/gamification";

export function LevelProgress({
  level,
  className,
}: {
  level: LevelInfo;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl bg-paper p-4", className)}>
      <div className="flex items-center justify-between">
        <span className="font-display text-sm font-semibold text-indigo">{level.name}</span>
        {level.nextLevelName && (
          <span className="text-xs text-ink/60">Next: {level.nextLevelName}</span>
        )}
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-violet transition-[width] duration-700 ease-out"
          style={{ width: `${Math.round(level.progressToNext * 100)}%` }}
        />
      </div>
    </div>
  );
}
