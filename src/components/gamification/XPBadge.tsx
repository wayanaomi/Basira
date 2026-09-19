import { cn } from "@/lib/utils";

export function XPBadge({
  xp,
  size = "md",
  className,
}: {
  xp: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const textSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1.5 text-gold",
        className,
      )}
    >
      <SparkIcon className={size === "lg" ? "h-6 w-6" : "h-4 w-4"} />
      <span className={cn("font-mono-basira font-semibold", textSize)}>
        {xp.toLocaleString()}
      </span>
      <span className="text-xs font-medium uppercase tracking-wide opacity-70">XP</span>
    </div>
  );
}

export function SparkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8Z" />
    </svg>
  );
}
