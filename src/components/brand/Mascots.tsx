import { cn } from "@/lib/utils";

/**
 * PLACEHOLDER MASCOT — Sage, the wise owl (primary guide). Built from the
 * Brand Guide's documented shapes: soft ovals, a graduation cap, and
 * diamond-sparkle eyes. See docs/DECISIONS.md for the Sage/Fahim naming note.
 */
export function Sage({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("h-24 w-24", className)}
      role="img"
      aria-label="Sage, the Basira owl"
    >
      {/* body */}
      <ellipse cx="100" cy="118" rx="62" ry="58" fill="#2E1A5E" />
      {/* wings */}
      <ellipse cx="45" cy="128" rx="16" ry="30" fill="#2E1A5E" />
      <ellipse cx="155" cy="128" rx="16" ry="30" fill="#2E1A5E" />
      {/* face plate */}
      <ellipse cx="100" cy="108" rx="46" ry="40" fill="#684FA0" />
      {/* eyes */}
      <circle cx="80" cy="102" r="16" fill="#FFFEFC" />
      <circle cx="120" cy="102" r="16" fill="#FFFEFC" />
      <path d="M80 96 L83 102 L80 108 L77 102 Z" fill="#2E1A5E" />
      <path d="M120 96 L123 102 L120 108 L117 102 Z" fill="#2E1A5E" />
      {/* beak */}
      <path d="M100 112 L108 122 L92 122 Z" fill="#E8A93F" />
      {/* graduation cap */}
      <rect x="72" y="58" width="56" height="8" rx="2" fill="#1B1030" />
      <path d="M100 46 L138 60 L100 74 L62 60 Z" fill="#1B1030" />
      <circle cx="138" cy="60" r="3" fill="#E8A93F" />
      {/* feet */}
      <rect x="82" y="172" width="8" height="12" rx="2" fill="#684FA0" />
      <rect x="110" y="172" width="8" height="12" rx="2" fill="#684FA0" />
    </svg>
  );
}

/** Small companion spark for micro-moments (streak reminders, quick tips). */
export function Nudge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={cn("h-8 w-8", className)}
      role="img"
      aria-label="Nudge"
    >
      <path
        d="M40 8 L47 33 L72 40 L47 47 L40 72 L33 47 L8 40 L33 33 Z"
        fill="#E8A93F"
      />
      <circle cx="40" cy="16" r="3" fill="#684FA0" />
      <circle cx="66" cy="40" r="2" fill="#684FA0" />
    </svg>
  );
}
