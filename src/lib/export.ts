// Export du bilan (EF-11) et carte « Ma leçon » (EF-17), 100 % dans le navigateur.
import { getBilan, getChoice, getPivot } from "./content";
import { FAILURE_TYPES, PIVOT_CATEGORIES } from "./copy";
import type { FailureType, Run, Scenario } from "./types";
import { formatDuration } from "./run";

export function bilanAsText(run: Run, s: Scenario): string {
  const choice = getChoice(s, run.choice_id);
  const pivot = getPivot(s, run.choice_id, run.pivot_id);
  const bilan = getBilan(s, run.choice_id, run.pivot_id);
  const lines = [
    "Fail Forward ESP — Mon bilan",
    `Scénario : ${s.theme}`,
    "",
    `1. Mon choix : ${choice?.label ?? "—"}`,
    `2. L'imprévu : ${choice?.failure_event ?? "—"}`,
    `3. Mon rebond : ${pivot?.label ?? "—"}${pivot?.category ? ` (${PIVOT_CATEGORIES[pivot.category].toLowerCase()})` : ""}`,
    `4. Résultat : ${bilan?.outcome ?? "—"}`,
    "",
    `Le tournant : ${bilan?.turning_point ?? "—"}`,
    `Mon rebond, analysé : ${bilan?.pivot_evaluation ?? "—"}`,
    `Type d'échec : ${bilan ? FAILURE_TYPES[bilan.failure_type].short : "—"}`,
  ];
  if (run.pivot_decision_ms != null) lines.push(`Temps de réflexion au pivot : ${formatDuration(run.pivot_decision_ms)}`);
  if (run.free_note.trim()) lines.push(`Ma justification : ${run.free_note.trim()}`);
  lines.push("");
  if (run.own_lesson.trim()) lines.push(`Ma leçon : ${run.own_lesson.trim()}`);
  lines.push(`Leçon proposée : ${bilan?.key_takeaway ?? "—"}`);
  const r = run.reflection;
  if (r.root_cause.trim() || r.impact.trim() || r.next_action.trim()) {
    lines.push("", "Ma réflexion");
    if (r.root_cause.trim()) lines.push(`- Cause profonde : ${r.root_cause.trim()}`);
    if (r.impact.trim()) lines.push(`- Impact réel : ${r.impact.trim()}`);
    if (r.next_action.trim()) lines.push(`- Prochaine action : ${r.next_action.trim()}`);
  }
  return lines.join("\n").replace(/ /g, " ");
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* repli ci-dessous */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

// ---------- Carte « Ma leçon » en Canvas 2D (0 Ko de bibliothèque) ----------

export const CARD_W = 1080;
export const CARD_H = 1350;
const FONT = '"Atkinson Hyperlegible Next", system-ui, sans-serif';

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export interface CardData {
  lesson: string;
  failureLabel?: string;
  failureType?: FailureType;
  dateLabel: string;
}

// Couleurs de la pastille par type d'échec (texte ≥ 4,5:1 sur son fond).
const BADGE: Record<FailureType, [string, string]> = {
  basique: ["#fef3c6", "#bb4d00"],
  complexe: ["#e0f2fe", "#0069a8"],
  intelligent: ["#ede9fe", "#7008e7"],
};

/** Dessine la carte et renvoie un Blob PNG. À appeler AVANT le tap de partage (contrainte Safari). */
export async function renderLessonCard(data: CardData): Promise<Blob | null> {
  try {
    await Promise.all([
      document.fonts?.load(`700 64px ${FONT}`),
      document.fonts?.load(`400 32px ${FONT}`),
    ]);
  } catch {
    /* police système en repli */
  }
  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Fond chaud + bande d'accent sarcelle.
  ctx.fillStyle = "#fafaf9";
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  ctx.fillStyle = "#00786f";
  ctx.fillRect(0, 0, CARD_W, 24);
  ctx.fillStyle = "#ffedd4";
  ctx.beginPath();
  ctx.arc(CARD_W - 60, CARD_H - 80, 260, 0, Math.PI * 2);
  ctx.fill();

  const pad = 96;
  ctx.textBaseline = "top";
  ctx.fillStyle = "#00786f";
  ctx.font = `700 34px ${FONT}`;
  ctx.fillText("FAIL FORWARD · ESP", pad, 110);

  ctx.fillStyle = "#57534d";
  ctx.font = `700 30px ${FONT}`;
  ctx.fillText("MA LEÇON", pad, 190);

  // Citation : taille adaptée à la longueur.
  const quote = `« ${data.lesson.trim()} »`;
  let size = 76;
  let lines: string[] = [];
  const maxW = CARD_W - pad * 2;
  for (; size >= 44; size -= 4) {
    ctx.font = `700 ${size}px ${FONT}`;
    lines = wrap(ctx, quote, maxW);
    if (lines.length * size * 1.3 <= 720) break;
  }
  ctx.fillStyle = "#1c1917";
  const lh = size * 1.3;
  let y = 280;
  for (const l of lines) {
    ctx.fillText(l, pad, y);
    y += lh;
  }

  // Pastille type d'échec.
  if (data.failureLabel) {
    ctx.font = `700 32px ${FONT}`;
    const w = ctx.measureText(data.failureLabel).width + 64;
    const by = CARD_H - 250;
    const [bg, fg] = BADGE[data.failureType ?? "complexe"];
    ctx.fillStyle = bg;
    roundRect(ctx, pad, by, w, 64, 32);
    ctx.fill();
    ctx.fillStyle = fg;
    ctx.fillText(data.failureLabel, pad + 32, by + 15);
  }

  ctx.fillStyle = "#57534d";
  ctx.font = `400 30px ${FONT}`;
  ctx.fillText(data.dateLabel, pad, CARD_H - 140);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function canShareFile(file: File): boolean {
  try {
    return typeof navigator !== "undefined" && !!navigator.canShare && navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
