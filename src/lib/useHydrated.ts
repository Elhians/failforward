"use client";
import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** false pendant le rendu statique et l'hydratation, true ensuite (lecture sûre de localStorage). */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
