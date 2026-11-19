import type { Scenario } from "./types";

/** Tire un scénario au hasard, en excluant éventuellement un identifiant (nouveau tirage). */
export function drawScenario(list: Scenario[], excludeId?: string, rand: () => number = Math.random): Scenario {
  const pool = excludeId && list.length > 1 ? list.filter((s) => s.id !== excludeId) : list;
  return pool[Math.floor(rand() * pool.length) % pool.length];
}
