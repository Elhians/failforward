import { STEPS } from "@/lib/copy";

/** Barre de progression en 4 segments nommés (Situation · Imprévu · Pivot · Résultat). */
export function Stepper({ current }: { current: number }) {
  const idx = Math.min(current, STEPS.length - 1);
  return (
    <nav aria-label="Progression du parcours">
      <p className="mb-2 text-base text-muted">
        <span className="font-bold text-ink">Étape {idx + 1} sur {STEPS.length}</span> · {STEPS[idx]}
      </p>
      <ol className="grid grid-cols-4 gap-1.5">
        {STEPS.map((label, i) => {
          const done = i <= idx;
          const setback = i === 1;
          return (
            <li key={label} aria-current={i === idx ? "step" : undefined} className="min-w-0">
              <span
                className={`block h-2 rounded-full transition-colors duration-200 ${
                  done ? (setback ? "bg-setback" : "bg-primary") : "bg-line"
                }`}
              />
              <span className={`mt-1 block truncate text-[0.8125rem] leading-tight ${i === idx ? "font-bold text-ink" : "text-muted"}`}>
                <span className="sr-only">{done && i !== idx ? "Terminée : " : ""}</span>
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
