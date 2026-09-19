# BASIRA — Decisions Log

This log records meaningful product, brand, and technical decisions made during
autonomous implementation, per the BASIRA build prompt's requirement to document
conflicts and non-trivial choices rather than silently resolving them.

---

## Decision: Mascot identity — Sage vs. Fahim

**Context**
The Brand Identity Guide (v1.0) defines the mascot system as **Sage**, a wise
owl (primary mascot / guide), paired with **Nudge**, a small companion spark
for micro-interactions. The supplied Website Copy document is written entirely
around a different character, **Fahim**, described as "a small, extremely wise
crow." The two documents describe incompatible characters (owl vs. crow,
different names, different personalities framed around "guilt-tripping" vs.
"never mocking").

**Decision Made**
Use **Sage** (owl) as the primary mascot and **Nudge** (spark) as the
micro-interaction companion everywhere in the product's visual system,
per the brand hierarchy rule (Brand Guide is primary for brand identity).
Website copy lines that reference "Fahim" are adapted to Sage's voice and
identity rather than used verbatim — the underlying *personality* and best
copy beats (wise, tracks real recall, follows up daily, plans tomorrow's
session) are preserved and re-attributed to Sage. Lines that lean into
guilt-tripping / mild shaming ("mildly guilts you," "Fahim is judging you")
are softened to match the Brand Guide's explicit "never mocking" /
"never shame the learner" rules (see Brand Guide §08, Master Prompt §54/§47).

**Reason**
The Brand Guide is the authoritative source for visual identity and mascot
system (per source hierarchy rules). The Master Prompt explicitly instructs:
use Sage as the primary mascot, use Nudge as the micro-companion, do not
invent a third character, and document this exact conflict here.

**Alternatives considered**
- Ship both characters (Sage for UI chrome, Fahim for marketing copy) — rejected,
  creates a confusing dual-mascot brand with no basis in either source document.
- Rename Sage to Fahim — rejected, would break the owl/graduation-cap/diamond-eye
  visual system that the Brand Guide precisely specifies, and the two characters
  have incompatible personalities (crow vs. owl, mild guilt vs. "never mocking").

---

## Decision: No PRD document was located

**Context**
The Master Build Prompt references a "Basira Product Requirements Document" as
a primary source for product functionality. No such file could be found in the
workspace, Downloads, or Desktop.

**Decision Made**
Proceed using the Master Build Prompt itself (which contains detailed functional
requirements in §11–§39, §69–§75) as the PRD-equivalent, together with the
Brand Identity Guide and Website Copy. If a PRD is provided later, reconcile
any conflicting functional details against it and update this log.

**Reason**
The Master Prompt explicitly forbids stopping for routine clarification and
instructs making the most defensible decision when a source is missing.

---

## Decision: No official logo/mascot image assets exist — placeholder built in code

**Context**
The Brand Guide describes the logo (geometric wordmark, spark replacing the
dot of the "A"; monogram: a stylized "B" with a speech-bubble tail and diamond
sparkle) and mascot illustrations (Sage the owl, Nudge the spark) in prose and
mockup screenshots, but no exported SVG/PNG asset files exist anywhere on disk.

**Decision Made**
Build faithful **SVG placeholder components** (`Logo`, `LogoMark`, `Sage`,
`Nudge`) in `src/components/brand/` that reproduce the documented geometry
(geometric sans wordmark + diamond spark dot; owl built from ovals + diamond
eyes + graduation cap; spark built from a 4-point star), in the exact brand
colors. These are clearly marked as placeholders in code comments and in
`docs/DESIGN_SYSTEM.md`, ready to be swapped for official asset files without
changing any component's public API.

**Reason**
Per Master Prompt §9: "If official logo assets are unavailable: create a
clearly documented temporary placeholder. Do not pretend a text recreation is
the official logo."

---

## Decision: Tech stack

**Context**
The workspace was empty (no existing code, package.json, or database). The
Master Prompt requires inspecting the existing stack first and using it if
present; otherwise choosing a production-ready stack.

**Decision Made**
- **Next.js 15** (App Router, TypeScript, `src/` dir) + **React 19** + **Tailwind CSS v4**.
  (The `create-next-app` scaffold initially resolved to a bleeding-edge Next.js 16.3,
  released days before this build; pinned back to the Next 15 stable line because
  the NextAuth v5 / `@auth/prisma-adapter` ecosystem this product depends on is
  proven against Next 15, and Next 16 is too new for confident compatibility.)
- **Prisma ORM** with **SQLite** for the dev database (no external Postgres
  instance is available in this environment). The schema avoids SQLite-only
  features so it can be pointed at Postgres later by changing `datasource.provider`
  and `DATABASE_URL` — the only production-readiness gap this defers is enum
  support (modeled as `String` + app-level constants instead of native Prisma
  `enum` in a couple of spots, for portability).
- **NextAuth.js v5 (beta)** with `@auth/prisma-adapter` + Credentials provider
  (bcrypt-hashed passwords). Split into `auth.config.ts` (edge-safe) and
  `auth.ts` (Node-only, full config) per the standard v5 middleware-safe pattern.
- **Zod** for input validation, **bcryptjs** for password hashing.
- **Framer Motion** for the restrained motion system (XP pop, streak flame,
  mastery bar fill, level-up), respecting `prefers-reduced-motion`.
- **lucide-react** for generic UI iconography (chevrons, nav icons) — never for
  brand/mascot marks, which are custom SVG per the Brand Guide.

**Reason**
Production-ready, well-documented, matches the Master Prompt's App Router/
component-architecture expectations, and every piece is free/self-hostable
with zero required external services, so the app runs and is testable
entirely locally.

---

## Decision: Zero demo/fake learner data

**Context**
Master Prompt §56–§68 mandates a completely clean learner state with zero
fabricated users, streaks, XP, mastery, etc.

**Decision Made**
The Prisma seed script (`prisma/seed.ts`) loads **only educational content**:
exams, subjects, topics, lessons, questions, and explanations for a real,
curriculum-accurate JAMB UTME Mathematics slice (Algebra topic). It never
creates a `User`, `Streak`, `XPTransaction`, `QuestionAttempt`, or any other
learner-activity row. Marketing/landing-page mockup numbers (e.g. "14-day
streak", "2,480 XP") live only inside `src/components/marketing/` as isolated
presentational props and are never read from or written to the database.

**Reason**
Directly mandated by the Master Prompt; also verified by the clean-state test
in `docs/TESTING.md`.
