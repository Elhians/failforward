import { ALL_SCENARIOS } from "@/content";
import type { Bilan, Choice, Pivot, Scenario } from "./types";

export const SCENARIOS: Scenario[] = ALL_SCENARIOS;

export function getScenario(id: string | null | undefined): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export function getChoice(s: Scenario, id: string | null): Choice | undefined {
  return s.choices.find((c) => c.id === id);
}

/** Pivots concrets du choix s'ils existent, sinon pivots génériques du scénario. */
export function getPivots(s: Scenario, choiceId: string | null): Pivot[] {
  const byChoice = choiceId ? s.pivots_by_choice?.[choiceId as Choice["id"]] : undefined;
  return byChoice && byChoice.length === 3 ? byChoice : s.pivots;
}

export function getPivot(s: Scenario, choiceId: string | null, pivotId: string | null): Pivot | undefined {
  return getPivots(s, choiceId).find((p) => p.id === pivotId);
}

export function getBilan(s: Scenario, choiceId: string | null, pivotId: string | null): Bilan | undefined {
  if (!choiceId || !pivotId) return undefined;
  return s.bilans[`${choiceId}_${pivotId}`];
}
