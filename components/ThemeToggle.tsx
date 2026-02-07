"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored =
      (typeof window !== "undefined" &&
        localStorage.getItem("theme")) as "light" | "dark" | null;
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const initial = stored ?? preferred;
    document.documentElement.classList.toggle("dark", initial === "dark");
    setTheme(initial);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  if (!mounted) return null;

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="h-10 w-10 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--foreground)] transition-colors hover:bg-[var(--surface)]"
    >
      {theme === "light" ? "◐" : "○"}
    </button>
  );
}
