"use client";
import { Icon } from "./Icon";

/** Message de statut non bloquant, annoncé poliment aux lecteurs d'écran. */
export function Toast({ message, onClose }: { message: string | null; onClose: () => void }) {
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-28 z-40 flex justify-center px-4">
      {message && (
        <div className="ff-enter pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl bg-ink px-4 py-3 text-base text-bg shadow-lg">
          <span className="pt-0.5">{message}</span>
          <button type="button" onClick={onClose} className="-m-2 grid size-11 shrink-0 place-items-center" aria-label="Fermer le message">
            <Icon name="x" className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}
