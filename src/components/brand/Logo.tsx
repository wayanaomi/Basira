import { cn } from "@/lib/utils";

/**
 * PLACEHOLDER LOGO — no official exported asset file exists in the repo (see
 * docs/DECISIONS.md). This SVG reproduces the Brand Guide's documented
 * geometry: a geometric sans wordmark with the spark replacing the dot of the
 * "A". Swap for the official file by replacing this component's internals —
 * the public API (`className`, `tone`) stays the same.
 */
export function Logo({
  className,
  tone = "indigo",
}: {
  className?: string;
  tone?: "indigo" | "light";
}) {
  const fill = tone === "light" ? "#FFFEFC" : "#2E1A5E";

  return (
    <svg
      viewBox="0 0 190 40"
      className={cn("h-7 w-auto", className)}
      role="img"
      aria-label="Basira"
    >
      <text
        x="0"
        y="29"
        fontFamily="var(--font-display), sans-serif"
        fontWeight="700"
        fontSize="30"
        letterSpacing="1"
        fill={fill}
      >
        BASIRA
      </text>
      {/* the spark, replacing the dot of the A */}
      <path
        d="M162 4 L164.5 9.5 L170 12 L164.5 14.5 L162 20 L159.5 14.5 L154 12 L159.5 9.5 Z"
        fill="#E8A93F"
      />
    </svg>
  );
}

/** Monogram / app-icon mark: a stylized "B" with the spark. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("h-8 w-8", className)}
      role="img"
      aria-label="Basira"
    >
      <rect width="64" height="64" rx="16" fill="#2E1A5E" />
      <path
        d="M22 16h13a8 8 0 0 1 3.2 15.3A9 9 0 0 1 34 49H22Zm7 6v9h6a4.5 4.5 0 0 0 0-9Zm0 15v9h7a4.5 4.5 0 0 0 0-9Z"
        fill="#FFFEFC"
      />
      <path
        d="M46 14l1.8 4.2L52 20l-4.2 1.8L46 26l-1.8-4.2L40 20l4.2-1.8Z"
        fill="#E8A93F"
      />
    </svg>
  );
}
