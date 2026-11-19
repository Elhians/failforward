// Stockage local uniquement (cahier §8.5). Toute erreur est absorbée : mode dégradé.
import type { Run } from "./types";

const PREFIX = "ffesp:v1:";
export const KEYS = {
  run: `${PREFIX}run`,
  history: `${PREFIX}history`,
  theme: `${PREFIX}theme`,
  lastPseudo: `${PREFIX}pseudo`,
  draw: `${PREFIX}draw`,
  lastMode: `${PREFIX}mode`,
  installDismissed: `${PREFIX}install-dismissed`,
} as const;

const HISTORY_MAX = 20;

function ls(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function storageAvailable(): boolean {
  const s = ls();
  if (!s) return false;
  try {
    const k = `${PREFIX}__test`;
    s.setItem(k, "1");
    s.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export function readJSON<T>(key: string): T | null {
  try {
    const raw = ls()?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeJSON(key: string, value: unknown): boolean {
  try {
    const s = ls();
    if (!s) return false;
    s.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function remove(key: string): void {
  try {
    ls()?.removeItem(key);
  } catch {
    /* rien */
  }
}

export function readString(key: string): string | null {
  try {
    return ls()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeString(key: string, value: string): void {
  try {
    ls()?.setItem(key, value);
  } catch {
    /* rien */
  }
}

export function loadCurrentRun(): Run | null {
  const r = readJSON<Run>(KEYS.run);
  return r && typeof r.run_id === "string" && typeof r.step === "string" ? r : null;
}

export function saveCurrentRun(run: Run | null): boolean {
  if (!run) {
    remove(KEYS.run);
    return true;
  }
  return writeJSON(KEYS.run, run);
}

export function loadHistory(): Run[] {
  const h = readJSON<Run[]>(KEYS.history);
  return Array.isArray(h) ? h : [];
}

/** Ajoute ou met à jour un parcours terminé dans l'historique (du plus récent au plus ancien). */
export function upsertHistory(run: Run): Run[] {
  const list = loadHistory().filter((r) => r.run_id !== run.run_id);
  list.unshift(run);
  const trimmed = list.slice(0, HISTORY_MAX);
  writeJSON(KEYS.history, trimmed);
  return trimmed;
}

export function clearHistory(): void {
  remove(KEYS.history);
}
