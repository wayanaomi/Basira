"use client";

import { useActionState } from "react";
import Link from "next/link";

import { registerAction, type AuthActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { Sage } from "@/components/brand/Mascots";

const initialState: AuthActionState = {};

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-4 py-12">
      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl bg-paper shadow-xl md:grid-cols-2">
        <div className="flex flex-col justify-between bg-indigo p-10 text-paper">
          <Link href="/">
            <Logo tone="light" />
          </Link>
          <div className="flex flex-col items-start gap-4">
            <Sage className="h-28 w-28" />
            <p className="font-display text-2xl leading-snug">
              A little insight, every day.
            </p>
            <p className="text-sm text-paper/70">
              Tell us your name, pick a password, and Sage will build your
              first learning path.
            </p>
          </div>
          <p className="text-xs text-paper/50">
            Free to start &middot; No card
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-4 p-10">
          <h1 className="font-display text-2xl font-semibold text-indigo">
            Start my streak
          </h1>
          <p className="text-sm text-ink/60">Already have an account?{" "}
            <Link href="/login" className="font-medium text-indigo underline underline-offset-2">
              Log in
            </Link>
          </p>

          <Field label="What should we call you?" name="name" error={state.fieldErrors?.name}>
            <input
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Ada"
              className="input"
            />
          </Field>

          <Field label="Email" name="email" error={state.fieldErrors?.email}>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="input"
            />
          </Field>

          <Field label="Password" name="password" error={state.fieldErrors?.password}>
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="input"
            />
          </Field>

          {state.error && <p className="text-sm text-alert">{state.error}</p>}

          <Button type="submit" size="lg" disabled={pending} className="mt-2">
            {pending ? "Creating your path…" : "Start my streak"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={name} className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-ink/80">{label}</span>
      {children}
      {error && <span className="text-xs text-alert">{error}</span>}
    </label>
  );
}
