// Modèle de données — cahier des charges §8.6.

export type FailureType = "basique" | "complexe" | "intelligent";
export type PivotCategory = "maintenir" | "ajuster" | "changer";
export type Mode = "solo" | "team";

export interface Choice {
  id: "A" | "B" | "C";
  label: string;
  /** Précision courte affichée sous le libellé (facultative). */
  hint?: string;
  failure_event: string;
}

export interface Pivot {
  id: "1" | "2" | "3";
  label: string;
  /** Catégorie affichée en étiquette secondaire (amendement P0 n°2). */
  category?: PivotCategory;
}

export interface Bilan {
  turning_point: string;
  pivot_evaluation: string;
  failure_type: FailureType;
  outcome: string;
  key_takeaway: string;
}

export interface Scenario {
  id: string;
  theme: string;
  /** Phrase d'enjeu affichée en gras au-dessus de la situation (facultative). */
  stake?: string;
  situation: string;
  choices: Choice[];
  /** Pivots génériques (schéma §8.6). */
  pivots: Pivot[];
  /** Pivots concrets propres à chaque choix (facultatif, prioritaire sur `pivots`). */
  pivots_by_choice?: Partial<Record<Choice["id"], Pivot[]>>;
  /** Clé « choix_pivot », ex. « A_1 ». */
  bilans: Record<string, Bilan>;
}

export interface Reflection {
  root_cause: string;
  impact: string;
  next_action: string;
}

export type Step = "situation" | "setback" | "pivot" | "outcome" | "debrief";

export interface Run {
  run_id: string;
  pseudo: string;
  mode: Mode;
  scenario_id: string;
  redraw_used: boolean;
  started_at: string;
  step: Step;
  choice_id: Choice["id"] | null;
  pivot_id: Pivot["id"] | null;
  pivot_decision_ms: number | null;
  free_note: string;
  bilan_id: string | null;
  reflection: Reflection;
  /** Leçon écrite par le participant (amendement P0 n°5). */
  own_lesson: string;
  finished_at: string | null;
  exported: boolean;
}
