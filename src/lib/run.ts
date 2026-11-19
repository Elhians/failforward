// Machine d'états d'un parcours (EF-04 à EF-14). Fonctions pures, testables.
import type { Choice, Mode, Pivot, Reflection, Run, Scenario } from "./types";

export function uuid(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  } catch {
    /* contexte non sécurisé (file://) */
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export const EMPTY_REFLECTION: Reflection = { root_cause: "", impact: "", next_action: "" };
export const NOTE_MAX = 200;
export const REFLECTION_MAX = 300;
export const LESSON_MAX = 140;

/** Plafond du temps de décision mesuré (valeurs aberrantes écrêtées). */
export const DECISION_CAP_MS = 10 * 60 * 1000;

export function createRun(pseudo: string, mode: Mode, scenario: Scenario, redrawUsed: boolean, now = new Date()): Run {
  return {
    run_id: uuid(),
    pseudo,
    mode,
    scenario_id: scenario.id,
    redraw_used: redrawUsed,
    started_at: now.toISOString(),
    step: "situation",
    choice_id: null,
    pivot_id: null,
    pivot_decision_ms: null,
    free_note: "",
    bilan_id: null,
    reflection: { ...EMPTY_REFLECTION },
    own_lesson: "",
    finished_at: null,
    exported: false,
  };
}

export type RunAction =
  | { type: "choose"; choiceId: Choice["id"] }
  | { type: "toPivot" }
  | { type: "pivot"; pivotId: Pivot["id"]; ms: number }
  | { type: "note"; text: string }
  | { type: "toDebrief" }
  | { type: "reflect"; field: keyof Reflection; text: string }
  | { type: "lesson"; text: string }
  | { type: "exported" }
  | { type: "back" };

export function reduceRun(run: Run, action: RunAction, now = new Date()): Run {
  switch (action.type) {
    case "choose":
      if (run.step !== "situation") return run;
      return { ...run, choice_id: action.choiceId, step: "setback" };
    case "toPivot":
      if (run.step !== "setback") return run;
      return { ...run, step: "pivot" };
    case "pivot": {
      if (run.step !== "pivot" || !run.choice_id) return run;
      const ms = Math.max(0, Math.min(DECISION_CAP_MS, Math.round(action.ms)));
      return {
        ...run,
        pivot_id: action.pivotId,
        pivot_decision_ms: ms,
        bilan_id: `${run.scenario_id}_${run.choice_id}_${action.pivotId}`,
        step: "outcome",
      };
    }
    case "note":
      return { ...run, free_note: action.text.slice(0, NOTE_MAX) };
    case "toDebrief":
      if (run.step !== "outcome") return run;
      return { ...run, step: "debrief", finished_at: run.finished_at ?? now.toISOString() };
    case "reflect":
      return { ...run, reflection: { ...run.reflection, [action.field]: action.text.slice(0, REFLECTION_MAX) } };
    case "lesson":
      return { ...run, own_lesson: action.text.slice(0, LESSON_MAX) };
    case "exported":
      return { ...run, exported: true };
    default:
      return run;
  }
}

export const STEP_INDEX: Record<Run["step"], number> = {
  situation: 0,
  setback: 1,
  pivot: 2,
  outcome: 3,
  debrief: 4,
};

/** Formate une durée de façon neutre : « 12 s », « 1 min 05 s ». */
export function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  if (total < 60) return `${total} s`;
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, "0");
  return `${m} min ${s} s`;
}
