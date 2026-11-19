import { beforeEach, describe, expect, it } from "vitest";
import { SCENARIOS, getBilan, getPivots } from "./content";
import { drawScenario } from "./draw";
import { bilanAsText } from "./export";
import { frTypo } from "./nbsp";
import { randomPseudo, validatePseudo } from "./pseudo";
import { DECISION_CAP_MS, createRun, formatDuration, reduceRun } from "./run";
import { KEYS, loadCurrentRun, loadHistory, saveCurrentRun, storageAvailable, upsertHistory } from "./storage";

describe("pseudo", () => {
  it("accepte un pseudo simple avec accents", () => {
    expect(validatePseudo("  Hibou   Curieux ")).toEqual({ ok: true, value: "Hibou Curieux" });
    expect(validatePseudo("Élodie_42").ok).toBe(true);
  });
  it("refuse trop court, trop long, caractères interdits", () => {
    expect(validatePseudo("ab")).toMatchObject({ ok: false, reason: "short" });
    expect(validatePseudo("a".repeat(21))).toMatchObject({ ok: false, reason: "long" });
    expect(validatePseudo("<script>")).toMatchObject({ ok: false, reason: "chars" });
    expect(validatePseudo("Bob<b>")).toMatchObject({ ok: false, reason: "chars" });
  });
  it("filtre les mots interdits, y compris accents et leet", () => {
    expect(validatePseudo("Gros Connard")).toMatchObject({ ok: false, reason: "banned" });
    expect(validatePseudo("C0nnard")).toMatchObject({ ok: false, reason: "banned" });
    expect(validatePseudo("Les Culottes").ok).toBe(true); // « cul » seul est filtré, pas dans un mot
  });
  it("vouvoie en mode équipe", () => {
    const r = validatePseudo("ab", true);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.message).toMatch(/^Choisissez/);
  });
  it("génère toujours des pseudos valides (solo et équipe)", () => {
    for (let i = 0; i < 300; i++) {
      expect(validatePseudo(randomPseudo(false)).ok).toBe(true);
      const team = randomPseudo(true);
      expect(team.startsWith("Les ")).toBe(true);
      expect(validatePseudo(team, true).ok).toBe(true);
    }
  });
});

describe("contenu", () => {
  it("contient 12 scénarios aux ids uniques", () => {
    expect(SCENARIOS).toHaveLength(12);
    expect(new Set(SCENARIOS.map((s) => s.id)).size).toBe(12);
  });
  it("les 108 trajectoires ont un bilan et 3 pivots concrets", () => {
    let n = 0;
    for (const s of SCENARIOS)
      for (const c of s.choices) {
        expect(getPivots(s, c.id)).toHaveLength(3);
        for (const p of getPivots(s, c.id)) {
          expect(getBilan(s, c.id, p.id)).toBeDefined();
          n++;
        }
      }
    expect(n).toBe(108);
  });
});

describe("tirage", () => {
  it("le nouveau tirage exclut le scénario courant", () => {
    const first = SCENARIOS[0];
    for (let i = 0; i < 50; i++) expect(drawScenario(SCENARIOS, first.id).id).not.toBe(first.id);
  });
  it("tous les scénarios peuvent sortir", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 1000; i++) seen.add(drawScenario(SCENARIOS).id);
    expect(seen.size).toBe(SCENARIOS.length);
  });
});

describe("parcours", () => {
  const s = SCENARIOS[0];
  it("suit les 4 étapes et pointe vers le bon bilan (9 trajectoires)", () => {
    for (const c of ["A", "B", "C"] as const)
      for (const p of ["1", "2", "3"] as const) {
        let r = createRun("Hibou Curieux", "solo", s, false);
        r = reduceRun(r, { type: "choose", choiceId: c });
        expect(r.step).toBe("setback");
        r = reduceRun(r, { type: "toPivot" });
        r = reduceRun(r, { type: "pivot", pivotId: p, ms: 12345.6 });
        expect(r.step).toBe("outcome");
        expect(r.bilan_id).toBe(`${s.id}_${c}_${p}`);
        expect(r.pivot_decision_ms).toBe(12346);
        r = reduceRun(r, { type: "toDebrief" });
        expect(r.step).toBe("debrief");
        expect(r.finished_at).not.toBeNull();
        expect(getBilan(s, r.choice_id, r.pivot_id)).toBeDefined();
      }
  });
  it("ignore les actions hors séquence et écrête le chrono", () => {
    let r = createRun("Hibou Curieux", "solo", s, false);
    expect(reduceRun(r, { type: "toPivot" })).toBe(r);
    r = reduceRun(reduceRun(r, { type: "choose", choiceId: "A" }), { type: "toPivot" });
    r = reduceRun(r, { type: "pivot", pivotId: "1", ms: DECISION_CAP_MS * 5 });
    expect(r.pivot_decision_ms).toBe(DECISION_CAP_MS);
  });
  it("limite la note libre à 200 caractères", () => {
    const r = reduceRun(createRun("Hibou", "solo", s, false), { type: "note", text: "x".repeat(500) });
    expect(r.free_note).toHaveLength(200);
  });
  it("utilise les pivots propres au choix quand ils existent", () => {
    expect(getPivots(s, "A")[0].label).not.toBe(s.pivots[0].label);
    const generic = { ...SCENARIOS[0], pivots_by_choice: undefined };
    expect(getPivots(generic, "A")).toBe(generic.pivots);
  });
  it("formate la durée sans jugement", () => {
    expect(formatDuration(12000)).toBe("12 s");
    expect(formatDuration(65000)).toBe("1 min 05 s");
  });
  it("produit un bilan texte complet, sans HTML interprété", () => {
    let r = createRun("<b>Hibou</b>", "solo", s, false);
    r = reduceRun(r, { type: "choose", choiceId: "B" });
    r = reduceRun(r, { type: "toPivot" });
    r = reduceRun(r, { type: "pivot", pivotId: "2", ms: 8000 });
    r = reduceRun(r, { type: "toDebrief" });
    r = reduceRun(r, { type: "reflect", field: "next_action", text: "Lister les échéances" });
    const txt = bilanAsText(r, s);
    expect(txt).toContain("Scénario : Crise de lancement");
    expect(txt).toContain("Type d'échec : intelligent");
    expect(txt).toContain("Prochaine action : Lister les échéances");
    expect(txt).not.toContain(" ");
  });
});

describe("typographie", () => {
  it("insère des espaces insécables", () => {
    expect(frTypo("Que fais-tu ?")).toBe("Que fais-tu ?");
    expect(frTypo("« Bonjour »")).toBe("« Bonjour »");
  });
});

describe("stockage local", () => {
  beforeEach(() => {
    const mem = new Map<string, string>();
    (globalThis as unknown as { window: unknown }).window = {
      localStorage: {
        getItem: (k: string) => mem.get(k) ?? null,
        setItem: (k: string, v: string) => void mem.set(k, v),
        removeItem: (k: string) => void mem.delete(k),
      },
    };
  });
  it("sauvegarde et relit le parcours en cours (reprise EF-14)", () => {
    expect(storageAvailable()).toBe(true);
    const r = createRun("Hibou", "team", SCENARIOS[0], true);
    saveCurrentRun(r);
    expect(loadCurrentRun()).toEqual(r);
    saveCurrentRun(null);
    expect(loadCurrentRun()).toBeNull();
  });
  it("l'historique met à jour un parcours sans le dupliquer", () => {
    const r = createRun("Hibou", "solo", SCENARIOS[0], false);
    upsertHistory(r);
    upsertHistory({ ...r, own_lesson: "ok" });
    expect(loadHistory()).toHaveLength(1);
    expect(loadHistory()[0].own_lesson).toBe("ok");
  });
  it("survit à un stockage cassé (mode dégradé)", () => {
    (globalThis as unknown as { window: unknown }).window = {
      localStorage: {
        getItem: () => {
          throw new Error("SecurityError");
        },
        setItem: () => {
          throw new Error("QuotaExceeded");
        },
        removeItem: () => undefined,
      },
    };
    expect(storageAvailable()).toBe(false);
    expect(saveCurrentRun(createRun("Hibou", "solo", SCENARIOS[0], false))).toBe(false);
    expect(loadCurrentRun()).toBeNull();
    expect(KEYS.run).toBe("ffesp:v1:run");
  });
});
