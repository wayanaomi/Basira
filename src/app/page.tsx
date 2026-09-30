import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
} from "lucide-react";
import { Sage } from "@/components/brand/Mascots";
import { ThemeToggle } from "@/components/marketing/ThemeToggle";


const questions = [
  {
    number: "01",
    subject: "MATHEMATICS",
    question: "If 3x + 7 = 22, what is the value of x?",
    options: ["3", "5", "7", "9"],
    answer: "5",
  },
  {
    number: "02",
    subject: "USE OF ENGLISH",
    question:
      "Choose the option that best completes the sentence: She has ___ her assignment.",
    options: ["finish", "finishes", "finished", "finishing"],
    answer: "finished",
  },
];

const faqs = [
  {
    question: "What is Basira?",
    answer:
      "Basira is an exam-preparation platform built around short lessons, deliberate practice, revision and mock exams. It helps you turn preparation into a daily study habit.",
  },
  {
    question: "Which exams does Basira support?",
    answer:
      "Basira is being built around JAMB/UTME, IELTS and other major certification exams. Exam coverage grows as the learning content is built and verified.",
  },
  {
    question: "Do I have to study for hours every day?",
    answer:
      "No. Basira is designed around focused study sessions. The goal is consistent progress rather than forcing long study sessions when a shorter session can move you forward.",
  },
  {
    question: "Does Basira use AI?",
    answer:
      "Technology can support parts of the experience, but Basira is designed around learning itself: useful content, practice, feedback, revision and measurable progress.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-ink text-paper">
      {/* ─────────────────────────────────────────────────────────────
          HEADER
      ───────────────────────────────────────────────────────────── */}

      <header className="border-b border-paper/10">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-6 lg:px-10">
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label="Basira home"
          >
            <div className="flex h-9 w-9 items-center justify-center border border-gold/60 text-gold">
              <span className="font-display text-sm font-bold">B</span>
            </div>

            <span className="font-display text-xl font-bold tracking-[-0.04em]">
              BASIRA
            </span>
          </Link>

          <nav className="hidden items-center gap-9 text-sm text-paper/60 md:flex">
            <a
              href="#method"
              className="transition-colors hover:text-paper"
            >
              How it works
            </a>
            <a
              href="#practice"
              className="transition-colors hover:text-paper"
            >
              Practice
            </a>
            <a
              href="#exams"
              className="transition-colors hover:text-paper"
            >
              Exams
            </a>
            <a
              href="#faq"
              className="transition-colors hover:text-paper"
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/login"
              className="hidden text-sm font-medium text-paper/70 transition-colors hover:text-paper sm:block"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="group flex items-center gap-2 bg-gold px-5 py-3 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5"
            >
              Start learning
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          HERO
      ───────────────────────────────────────────────────────────── */}

      <section className="relative border-b border-paper/10">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left */}
          <div className="border-r border-paper/10 px-6 pb-20 pt-20 lg:px-10 lg:pb-28 lg:pt-28">
            <div className="max-w-[760px]">
              <div className="mb-10 flex items-center gap-4">

                <span className="h-px w-16 bg-gold/50" />
              </div>

              <h1 className="font-display text-[clamp(4rem,8vw,8rem)] font-bold leading-[0.86] tracking-[-0.075em]">
                Study
                <br />
                <span className="text-violet">smarter.</span>
                <br />
                Sit ready.
              </h1>

              <div className="mt-10 grid max-w-2xl grid-cols-[1fr_auto] gap-8">
                <p className="max-w-xl text-lg leading-8 text-paper/60">
                  Basira turns exam preparation into something you can
                  actually return to every day: one useful lesson, a few
                  questions, immediate feedback, then the next step.
                </p>

                <div className="hidden border-l border-paper/15 pl-5 sm:block">
                  <p className="font-mono-basira text-[10px] uppercase tracking-[0.2em] text-paper/35">
                    Promise
                  </p>
                  <p className="mt-2 max-w-[110px] text-sm font-semibold leading-5 text-paper/80">
                    A little insight, every day.
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-3 bg-gold px-7 py-4 font-bold text-ink"
                >
                  Start your journey
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href="#method"
                  className="inline-flex items-center gap-3 border border-paper/20 px-7 py-4 font-semibold text-paper/80 transition-colors hover:border-paper/40 hover:text-paper"
                >
                  See the method
                  <ArrowDown className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right — editorial study desk */}
          <div className="relative min-h-[620px] overflow-hidden bg-[#171027]">
            <div className="absolute inset-x-0 top-0 h-px bg-gold/30" />

            {/* vertical index */}
            <div className="absolute left-6 top-8 font-mono-basira text-[10px] uppercase tracking-[0.25em] text-paper/25">
              BASIRA / 001
            </div>

            {/* notebook sheet */}
            <div className="absolute left-[10%] right-[7%] top-[12%] rotate-[1.2deg] bg-paper p-6 text-ink shadow-2xl sm:p-8">
              <div className="flex items-start justify-between border-b border-ink/15 pb-5">
                <div>
                  <p className="font-mono-basira text-[9px] font-bold uppercase tracking-[0.2em] text-ink/40">
                    TODAY&apos;S STUDY
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">
                    One question at a time.
                  </h2>
                </div>

                <div className="text-right">
                  <p className="font-mono-basira text-[9px] uppercase tracking-[0.2em] text-ink/40">
                    SESSION
                  </p>
                  <p className="mt-1 font-mono-basira text-sm font-bold">
                    08:42
                  </p>
                </div>
              </div>

              <div className="py-7">
                <p className="font-mono-basira text-[10px] font-bold uppercase tracking-[0.18em] text-violet">
                  {questions[0].subject}
                </p>

                <p className="mt-5 max-w-xl font-display text-xl font-bold leading-8 sm:text-2xl">
                  {questions[0].question}
                </p>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  {questions[0].options.map((option, index) => (
                    <div
                      key={option}
                      className={`flex items-center gap-3 border px-4 py-3 text-sm font-medium ${
                        option === questions[0].answer
                          ? "border-sage bg-sage/10"
                          : "border-ink/10"
                      }`}
                    >
                      <span className="font-mono-basira text-[10px] text-ink/35">
                        {String.fromCharCode(65 + index)}
                      </span>

                      <span>{option}</span>

                      {option === questions[0].answer && (
                        <Check className="ml-auto h-4 w-4 text-sage" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-ink/10 pt-5">
                <span className="font-mono-basira text-[9px] uppercase tracking-[0.18em] text-ink/35">
                  Question 01 / 20
                </span>

                <span className="flex items-center gap-2 font-mono-basira text-[10px] font-bold text-ink/50">
                  <Clock3 className="h-3.5 w-3.5" />
                  FOCUSED SESSION
                </span>
              </div>
            </div>

            {/* Sage */}
            <div className="absolute bottom-8 left-7 flex items-end gap-3 sm:bottom-10 sm:left-10">
              <div className="grid h-20 w-20 place-items-center border border-gold/30 bg-indigo">
                <Sage className="h-16 w-16" />
              </div>

              <div className="max-w-[190px] border border-paper/10 bg-ink px-4 py-3">
                <p className="text-sm font-semibold leading-5 text-paper">
                  Don&apos;t rush it. Understand it.
                </p>
              </div>
            </div>

            {/* little handwritten-style note */}
            <div className="absolute bottom-10 right-8 hidden rotate-[-4deg] border-l-2 border-gold pl-4 text-gold/80 sm:block">
              <p className="font-mono-basira text-[9px] uppercase tracking-[0.15em]">
                small session
              </p>
              <p className="mt-1 text-sm font-semibold">
                still counts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          METHOD
      ───────────────────────────────────────────────────────────── */}

      <section id="method" className="border-b border-ink/10 bg-paper text-ink">
        <div className="mx-auto max-w-[1440px] px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="font-mono-basira text-[10px] font-bold uppercase tracking-[0.22em] text-violet">
                02 / THE METHOD
              </p>

              <h2 className="mt-6 max-w-md font-display text-5xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl">
                Preparation should have a rhythm.
              </h2>

              <p className="mt-7 max-w-md leading-7 text-ink/55">
                You do not need another folder full of PDFs. You need to know
                what to study, practice it, find the gaps and come back to
                them.
              </p>
            </div>

            <div className="border-t border-ink/15">
              {[
                {
                  number: "01",
                  title: "Choose your path",
                  text: "Tell Basira your exam, subjects and target. Your study path starts from there.",
                },
                {
                  number: "02",
                  title: "Learn in small pieces",
                  text: "Lessons break large syllabuses into focused pieces that are easier to return to.",
                },
                {
                  number: "03",
                  title: "Practice immediately",
                  text: "Move from explanation to questions while the idea is still fresh.",
                },
                {
                  number: "04",
                  title: "See what needs work",
                  text: "Your activity builds a clearer picture of the topics you understand and the ones you need to revisit.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="grid gap-5 border-b border-ink/15 py-7 sm:grid-cols-[80px_1fr_1.2fr] sm:items-start"
                >
                  <span className="font-mono-basira text-xs text-violet">
                    {item.number}
                  </span>

                  <h3 className="font-display text-xl font-bold">
                    {item.title}
                  </h3>

                  <p className="max-w-lg leading-7 text-ink/55">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          PRACTICE
      ───────────────────────────────────────────────────────────── */}

      <section
        id="practice"
        className="border-b border-paper/10 bg-ink text-paper"
      >
        <div className="mx-auto max-w-[1440px] px-6 py-24 lg:px-10 lg:py-32">
          <div className="flex flex-col justify-between gap-8 border-b border-paper/10 pb-10 lg:flex-row lg:items-end">
            <div>
              <p className="font-mono-basira text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
                03 / PRACTICE
              </p>

              <h2 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl">
                The point is not to answer more questions.
                <span className="text-violet"> It is to understand why.</span>
              </h2>
            </div>

            <p className="max-w-xs leading-7 text-paper/50">
              Practice is where preparation becomes measurable. Answer,
              review, understand, return.
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_0.72fr]">
            {/* question stack */}
            <div className="border border-paper/10 bg-[#171027]">
              <div className="flex items-center justify-between border-b border-paper/10 px-6 py-4">
                <span className="font-mono-basira text-[10px] uppercase tracking-[0.18em] text-paper/35">
                  PRACTICE / USE OF ENGLISH
                </span>

                <span className="font-mono-basira text-[10px] text-paper/35">
                  07 / 20
                </span>
              </div>

              <div className="p-6 sm:p-10">
                <p className="font-mono-basira text-[10px] uppercase tracking-[0.18em] text-gold">
                  Question
                </p>

                <h3 className="mt-5 max-w-2xl font-display text-2xl font-bold leading-9">
                  {questions[1].question}
                </h3>

                <div className="mt-8 space-y-3">
                  {questions[1].options.map((option, index) => (
                    <div
                      key={option}
                      className="flex items-center gap-4 border border-paper/10 px-5 py-4 transition-colors hover:border-paper/25"
                    >
                      <span className="font-mono-basira text-xs text-paper/30">
                        {String.fromCharCode(65 + index)}
                      </span>

                      <span className="text-sm text-paper/80">
                        {option}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-l-2 border-sage bg-sage/5 px-5 py-4">
                  <p className="font-mono-basira text-[9px] font-bold uppercase tracking-[0.18em] text-sage">
                    After your answer
                  </p>

                  <p className="mt-2 text-sm leading-6 text-paper/60">
                    Basira explains the answer so the question becomes part
                    of what you know, not just another number on a scorecard.
                  </p>
                </div>
              </div>
            </div>

            {/* principle */}
            <div className="flex flex-col justify-between border-l border-paper/10 pl-7 lg:pl-10">
              <div>
                <div className="mb-8 flex h-14 w-14 items-center justify-center border border-gold/40 text-gold">
                  <span className="font-mono-basira text-xs font-bold">
                    WHY
                  </span>
                </div>

                <h3 className="max-w-sm font-display text-4xl font-bold leading-tight tracking-[-0.04em]">
                  A wrong answer is useful when you learn from it.
                </h3>

                <p className="mt-6 max-w-sm leading-7 text-paper/50">
                  Basira is built around the gap between “I saw this before”
                  and “I can actually answer this under pressure.”
                </p>
              </div>

              <div className="mt-12 border-t border-paper/10 pt-7">
                <p className="font-mono-basira text-[9px] uppercase tracking-[0.18em] text-paper/30">
                  THE LOOP
                </p>

                <p className="mt-3 font-display text-lg font-semibold">
                  Learn → Practice → Understand → Return
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          EXAMS
      ───────────────────────────────────────────────────────────── */}

      <section id="exams" className="bg-gold text-ink">
        <div className="mx-auto max-w-[1440px] px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="font-mono-basira text-[10px] font-bold uppercase tracking-[0.22em] text-ink/50">
                04 / EXAM COVERAGE
              </p>

              <h2 className="mt-6 max-w-md font-display text-5xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl">
                Different exams.
                <br />
                Same discipline.
              </h2>

              <p className="mt-7 max-w-md leading-7 text-ink/60">
                Start with the exam you are preparing for and build your path
                around the subjects that actually matter to you.
              </p>
            </div>

            <div className="border-t border-ink/20">
              {[
                ["JAMB / UTME", "Subjects, lessons, practice and timed mocks."],
                ["IELTS", "Preparation built around the skills the exam demands."],
                ["CERTIFICATIONS", "Structured preparation for major professional exams."],
              ].map(([name, description], index) => (
                <div
                  key={name}
                  className="grid gap-5 border-b border-ink/20 py-8 sm:grid-cols-[90px_0.8fr_1.2fr] sm:items-center"
                >
                  <span className="font-mono-basira text-xs text-ink/45">
                    0{index + 1}
                  </span>

                  <h3 className="font-display text-2xl font-bold">
                    {name}
                  </h3>

                  <p className="leading-7 text-ink/55">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SAGE
      ───────────────────────────────────────────────────────────── */}

      <section className="border-b border-paper/10 bg-[#171027]">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.7fr_1.3fr]">
          <div className="flex min-h-[460px] items-center justify-center border-r border-paper/10 p-10">
            <div className="relative">
              <div className="absolute inset-0 -m-12 border border-gold/15" />
              <div className="absolute inset-0 -m-7 border border-paper/10" />

              <div className="relative grid h-64 w-64 place-items-center border border-gold/30 bg-indigo">
                <Sage className="h-52 w-52" />
              </div>
            </div>
          </div>

          <div className="flex items-center px-6 py-20 lg:px-16">
            <div className="max-w-2xl">
              <p className="font-mono-basira text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
                THE GUIDE
              </p>

              <h2 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl">
                Meet Sage.
                <br />
                <span className="text-violet">Keep going.</span>
              </h2>

              <p className="mt-7 max-w-xl text-lg leading-8 text-paper/55">
                Sage is Basira&apos;s study companion — calm when you are
                stuck, direct when you need direction, and never louder than
                the work itself.
              </p>

              <div className="mt-10 border-l-2 border-gold px-5 py-1">
                <p className="font-display text-xl font-semibold">
                  “You don&apos;t have to finish everything today.”
                </p>
                <p className="mt-2 text-sm text-paper/40">
                  Just know what to do next.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FAQ
      ───────────────────────────────────────────────────────────── */}

      <section id="faq" className="bg-paper text-ink">
        <div className="mx-auto max-w-[1440px] px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="font-mono-basira text-[10px] font-bold uppercase tracking-[0.22em] text-violet">
                05 / FAQ
              </p>

              <h2 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl">
                Questions,
                <br />
                answered.
              </h2>
            </div>

            <div className="border-t border-ink/15">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group border-b border-ink/15"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 font-display text-xl font-bold">
                    {faq.question}

                    <ChevronDown className="h-5 w-5 shrink-0 text-ink/40 transition-transform group-open:rotate-180" />
                  </summary>

                  <p className="max-w-2xl pb-7 pr-10 leading-7 text-ink/55">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FINAL CTA
      ───────────────────────────────────────────────────────────── */}

      <section className="border-t border-paper/10 bg-ink">
        <div className="mx-auto max-w-[1440px] px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="font-mono-basira text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
                START HERE
              </p>

              <h2 className="mt-6 max-w-4xl font-display text-6xl font-bold leading-[0.9] tracking-[-0.065em] sm:text-7xl lg:text-8xl">
                One lesson.
                <br />
                Then another.
              </h2>
            </div>

            <Link
              href="/register"
              className="group inline-flex h-fit items-center gap-3 bg-gold px-7 py-4 font-bold text-ink"
            >
              Start learning
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-16 flex flex-col justify-between gap-5 border-t border-paper/10 pt-6 text-xs text-paper/35 sm:flex-row">
            <p>
              BASIRA — A little insight, every day.
            </p>

            <div className="flex gap-6">
              <Link href="/login" className="hover:text-paper">
                Log in
              </Link>
              <Link href="/register" className="hover:text-paper">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}