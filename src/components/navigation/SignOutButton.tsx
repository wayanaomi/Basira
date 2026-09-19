"use client";

import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export function SignOutButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ redirectTo: "/" })}
      className={cn("block", className)}
    >
      Log out
    </button>
  );
}
