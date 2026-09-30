import { cn } from "@/lib/utils";

/**
 * Sage — Basira's primary guide.
 *
 * Sage is designed as a calm, wise owl rather than a decorative AI symbol.
 * The visual language uses simple geometric shapes and the Basira palette.
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

      {/* pupils */}
      <circle cx="80" cy="102" r="6" fill="#1B1030" />
      <circle cx="120" cy="102" r="6" fill="#1B1030" />

      {/* beak */}
      <path d="M100 112 L108 122 L92 122 Z" fill="#E8A93F" />

      {/* graduation cap */}
      <rect
        x="72"
        y="58"
        width="56"
        height="8"
        rx="2"
        fill="#1B1030"
      />
      <path
        d="M100 46 L138 60 L100 74 L62 60 Z"
        fill="#1B1030"
      />
      <circle cx="138" cy="60" r="3" fill="#E8A93F" />

      {/* feet */}
      <rect
        x="82"
        y="172"
        width="8"
        height="12"
        rx="2"
        fill="#684FA0"
      />
      <rect
        x="110"
        y="172"
        width="8"
        height="12"
        rx="2"
        fill="#684FA0"
      />
    </svg>
  );
}
