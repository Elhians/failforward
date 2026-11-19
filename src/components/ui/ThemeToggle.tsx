"use client";
import { useState } from "react";
import { KEYS, writeString } from "@/lib/storage";
import { useHydrated } from "@/lib/useHydrated";
import { Icon } from "./Icon";

export function ThemeToggle() {
  return useHydrated() ? <ThemeButton /> : <span className="size-11" aria-hidden />;
}

function ThemeButton() {
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => {
        document.documentElement.dataset.theme = next;
        writeString(KEYS.theme, next);
        setTheme(next);
      }}
      className="ff-press grid size-11 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
      aria-label={next === "dark" ? "Passer en mode sombre" : "Passer en mode clair"}
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} className="size-5" />
    </button>
  );
}
