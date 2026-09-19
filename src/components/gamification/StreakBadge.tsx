import { cn } from "@/lib/utils";

export function StreakBadge({
  streak,
  size = "md",
  className,
}: {
  streak: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const textSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-ember/10 px-3 py-1.5 text-ember",
        className,
      )}
    >
      <FlameIcon className={size === "lg" ? "h-6 w-6" : "h-4 w-4"} />
      <span className={cn("font-mono-basira font-semibold", textSize)}>{streak}</span>
    </div>
  );
}

function FlameIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2c1 3-2 4-2 7a4 4 0 0 0 8 0c0-1-.3-2-.7-2.7C18.6 7.8 20 10 20 13a8 8 0 1 1-16 0c0-4 2-6 4-8 1-1 1.7-2 2-3.3.6.6 1.5 1.5 2 3.3Z" />
    </svg>
  );
}
