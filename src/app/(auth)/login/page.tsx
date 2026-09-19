"use client";

import { useActionState } from "react";
import Link from "next/link";

import { loginAction, type AuthActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";

const initialState: AuthActionState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-4 py-12">
      <div className="w-full max-w-sm rounded-3xl bg-paper p-10 shadow-xl">
        <Link href="/">
          <Logo className="mb-8" />
        </Link>
        <h1 className="font-display text-2xl font-semibold text-indigo">Welcome back</h1>
        <p className="mt-1 text-sm text-ink/60">
          New here?{" "}
          <Link href="/register" className="font-medium text-indigo underline underline-offset-2">
            Start my streak
          </Link>
        </p>

        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink/80">Email</span>
            <input name="email" type="email" autoComplete="email" required className="input" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink/80">Password</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="input"
            />
          </label>

          {state.error && <p className="text-sm text-alert">{state.error}</p>}

          <Button type="submit" size="lg" disabled={pending} className="mt-2">
            {pending ? "Signing in…" : "Log in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
