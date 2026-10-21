"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const EVENT_NAME = "basira-theme-change";

function getTheme(): boolean {
  return document.documentElement.classList.contains("dark");
}

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem("basira-theme", dark ? "dark" : "light");
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: dark }));
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const sync = (event: Event) => {
      const custom = event as CustomEvent<boolean>;
      setDark(typeof custom.detail === "boolean" ? custom.detail : getTheme());
    };

    setDark(getTheme());
    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(EVENT_NAME, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  function toggleTheme() {
    applyTheme(!getTheme());
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-paper text-ink shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/60 hover:text-indigo dark:hover:text-gold"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
