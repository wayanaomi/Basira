"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(
      document.documentElement.classList.contains("dark")
    );
  }, []);

  function toggleTheme() {
    const next =
      !document.documentElement.classList.contains("dark");

    document.documentElement.classList.toggle("dark", next);

    localStorage.setItem(
      "basira-theme",
      next ? "dark" : "light"
    );

    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        dark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      title={dark ? "Light mode" : "Dark mode"}
      className="
        grid h-10 w-10 place-items-center
        rounded-full
        border border-ink/10
        bg-paper
        text-ink
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-gold/60
        hover:text-indigo
        dark:hover:text-gold
      "
    >
      {dark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}