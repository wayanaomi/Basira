# Basira

The Duolingo of exam mastery — a gamified exam-prep app (JAMB UTME, SSCE, IELTS
and more), built with Next.js, Prisma, and NextAuth.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Prisma + SQLite (dev) — see `docs/DECISIONS.md` for the Postgres upgrade path
- NextAuth.js v5 (Credentials + Prisma adapter)

## Getting started

```bash
npm install
cp .env.example .env   # then set AUTH_SECRET (openssl rand -base64 32)
npx prisma migrate dev
npm run db:seed        # loads exam/subject/topic/lesson/question content only
npm run dev
```

Open http://localhost:3000. Register a new account to go through onboarding —
every learner starts at 0 XP / 0 streak, by design (see `docs/DECISIONS.md`).

To reach `/admin`, promote a user to `ADMIN` directly in the database
(`npm run db:studio` → `User.role`) — there is no self-service admin signup.

## Docs

See `docs/DECISIONS.md` for the notable product/brand/technical decisions
made while building this, including the Sage/Fahim mascot conflict and the
Prisma/Next version choices.
