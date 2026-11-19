"use client";
// Écran 3 — Bilan et réflexion (cahier §5.3, EF-09 à EF-12).
import { useEffect, useId, useRef, useState } from "react";
import { getBilan, getChoice, getPivot } from "@/lib/content";
import { FAILURE_TYPES, PIVOT_CATEGORIES, t } from "@/lib/copy";
import { bilanAsText, copyText } from "@/lib/export";
import { frTypo } from "@/lib/nbsp";
import { LESSON_MAX, REFLECTION_MAX, formatDuration, type RunAction } from "@/lib/run";
import type { FailureType, Reflection, Run, Scenario } from "@/lib/types";
import { Button } from "../ui/Button";
import { Icon, type IconName } from "../ui/Icon";
import { Sheet } from "../ui/Sheet";

interface Props {
  run: Run;
  scenario: Scenario;
  dispatch: (a: RunAction) => void;
  notify: (msg: string) => void;
  onNew: () => void;
  onCard: () => void;
  onHome: () => void;
  /** Parcours relu depuis l'historique. */
  fromHistory?: boolean;
  printable: boolean;
}

const TYPE_STYLE: Record<FailureType, { icon: IconName; text: string; bg: string; ring: string }> = {
  basique: { icon: "target", text: "text-setback", bg: "bg-setback-bg", ring: "border-setback" },
  complexe: { icon: "link", text: "text-pivot", bg: "bg-pivot-bg", ring: "border-pivot" },
  intelligent: { icon: "lightbulb", text: "text-intelligent", bg: "bg-intelligent-bg", ring: "border-intelligent" },
};

export function Debrief({ run, scenario, dispatch, notify, onNew, onCard, onHome, fromHistory, printable }: Props) {
  const copy = t(run.mode);
  const choice = getChoice(scenario, run.choice_id);
  const pivot = getPivot(scenario, run.choice_id, run.pivot_id);
  const bilan = getBilan(scenario, run.choice_id, run.pivot_id);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [showLesson, setShowLesson] = useState(!!run.own_lesson);
  const [askBeforeNew, setAskBeforeNew] = useState(false);
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lessonId = useId();

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, []);

  function edit(a: RunAction) {
    dispatch(a);
    setSaved(false);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(true), 500);
  }

  async function copy_() {
    const ok = await copyText(bilanAsText(run, scenario));
    if (ok) {
      dispatch({ type: "exported" });
      notify(copy.copied);
    } else {
      notify("La copie n'a pas fonctionné sur ce navigateur. Essaie « Imprimer / PDF » ou une capture d'écran.");
    }
  }

  if (!bilan || !choice || !pivot) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-6">
        <p>Ce bilan n&apos;est plus disponible sur cet appareil.</p>
        <Button className="mt-4" onClick={onHome}>
          Retour à l&apos;accueil
        </Button>
      </div>
    );
  }

  const type = TYPE_STYLE[bilan.failure_type];
  const questions = copy.questions;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 pb-16 pt-4">
      <header className="flex flex-col gap-3">
        {fromHistory && (
          <Button variant="ghost" className="self-start no-print" icon={<Icon name="arrowLeft" className="size-5" />} onClick={onHome}>
            Accueil
          </Button>
        )}
        <h1 ref={headingRef} tabIndex={-1} className="text-[1.75rem] font-bold leading-tight outline-none">
          {copy.debriefTitle}
        </h1>
        <p className="text-muted">
          {scenario.theme} · {run.pseudo}
        </p>
        <ul className="flex flex-wrap gap-2 text-base" aria-label="En bref">
          {["2 décisions", "1 imprévu", "1 rebond"].map((c) => (
            <li key={c} className="rounded-full bg-surface-2 px-3 py-1 font-bold">
              {c}
            </li>
          ))}
        </ul>
      </header>

      <div className="ff-reveal flex flex-col gap-5">
        {/* Bloc 1 — résumé chronologique, assemblé localement */}
        <Block n={1} title={copy.journey}>
          <ol className="relative flex flex-col gap-4 border-l-2 border-line pl-5">
            <Timeline icon="flag" label="Choix" text={choice.label} />
            <Timeline icon="zap" label="Imprévu" text={choice.failure_event} tone="setback" />
            <Timeline
              icon="rebound"
              label={`Rebond${pivot.category ? ` · ${PIVOT_CATEGORIES[pivot.category].toLowerCase()}` : ""}`}
              text={pivot.label}
            />
            <Timeline icon="check" label="Résultat" text={bilan.outcome} />
          </ol>
          {run.free_note.trim() && (
            <p className="mt-4 rounded-2xl bg-surface-2 p-3 text-base">
              <span className="font-bold">{run.mode === "team" ? "Votre justification : " : "Ta justification : "}</span>
              {run.free_note}
            </p>
          )}
        </Block>

        {/* Bloc 2 — point de bascule */}
        <Block n={2} title="Le tournant">
          <p className="border-l-4 border-primary pl-4">{frTypo(bilan.turning_point)}</p>
        </Block>

        {/* Bloc 3 — analyse du rebond + type d'échec */}
        <Block n={3} title={copy.rebound}>
          <p>{frTypo(bilan.pivot_evaluation)}</p>
          <div className="mt-4">
            <p className="mb-2 text-base font-bold text-muted" id="ftype">
              Type d&apos;échec (typologie d&apos;Amy Edmondson)
            </p>
            <ul className="grid grid-cols-3 gap-1.5" aria-labelledby="ftype">
              {(Object.keys(FAILURE_TYPES) as FailureType[]).map((k) => {
                const on = k === bilan.failure_type;
                const st = TYPE_STYLE[k];
                return (
                  <li
                    key={k}
                    aria-current={on ? "true" : undefined}
                    className={`flex min-h-12 flex-col items-center justify-center rounded-xl border-2 px-1 py-1.5 text-center text-base ${
                      on ? `${st.ring} ${st.bg} font-bold ${st.text}` : "border-transparent bg-surface-2 text-muted"
                    }`}
                  >
                    <Icon name={st.icon} className="size-5" />
                    <span className={on ? "" : "text-ink/70"}>{FAILURE_TYPES[k].short}</span>
                    {on && <span className="sr-only"> (type de ce parcours)</span>}
                  </li>
                );
              })}
            </ul>
            <p className={`mt-3 flex gap-3 rounded-2xl p-3 text-base ${type.bg}`}>
              <Icon name={type.icon} className={`mt-0.5 size-5 ${type.text}`} />
              <span>
                <span className="font-bold">{FAILURE_TYPES[bilan.failure_type].label} : </span>
                {frTypo(FAILURE_TYPES[bilan.failure_type].text)}
              </span>
            </p>
          </div>
          {run.pivot_decision_ms != null && (
            <p className="mt-3 flex gap-3 text-base text-muted">
              <Icon name="clock" className="mt-0.5 size-5" />
              <span>
                {copy.pivotTime} : <span className="font-bold text-ink">{formatDuration(run.pivot_decision_ms)}</span> — un repère, pas une note.
              </span>
            </p>
          )}
        </Block>

        {/* Bloc 4 — leçon : d'abord celle du participant (rituel Failure:Lab), puis la leçon proposée */}
        <Block n={4} title={copy.lesson}>
          <label htmlFor={lessonId} className="font-bold">
            {copy.lessonPrompt}
          </label>
          <p className="text-base text-muted">{copy.lessonHint}</p>
          <textarea
            id={lessonId}
            rows={2}
            maxLength={LESSON_MAX}
            value={run.own_lesson}
            onChange={(e) => edit({ type: "lesson", text: e.target.value })}
            placeholder="Ex. : Montrer quelque chose tôt, même imparfait."
            className="mt-2 w-full rounded-2xl border-2 border-line bg-surface p-3 focus:border-primary"
          />
          {showLesson ? (
            <figure className="mt-4 rounded-3xl bg-primary-soft p-5">
              <figcaption className="mb-2 text-base font-bold text-primary">Leçon proposée</figcaption>
              <blockquote className="text-[1.375rem] font-bold leading-snug">« {frTypo(bilan.key_takeaway)} »</blockquote>
            </figure>
          ) : (
            <Button variant="secondary" className="mt-3" icon={<Icon name="lightbulb" className="size-5" />} onClick={() => setShowLesson(true)}>
              Voir la leçon proposée
            </Button>
          )}
        </Block>
      </div>

      {/* Failure Reflection (EF-10) */}
      <section aria-labelledby="reflect-title" className="flex flex-col gap-4">
        <div>
          <h2 id="reflect-title" className="text-[1.375rem] font-bold">
            {copy.dig}
          </h2>
          <p className="text-base text-muted">{frTypo("Inspiré des post-mortems sans reproche et des « 5 pourquoi ». Tout est facultatif et enregistré automatiquement sur ce téléphone.")}</p>
        </div>
        {(Object.keys(questions) as (keyof Reflection)[]).map((k, i) => (
          <ReflectionField
            key={k}
            n={i + 1}
            label={questions[k].label}
            help={questions[k].help}
            placeholder={questions[k].ph}
            value={run.reflection[k]}
            onChange={(v) => edit({ type: "reflect", field: k, text: v })}
          />
        ))}
        <p className="flex min-h-6 items-center gap-2 text-base text-primary" aria-hidden="true">
          {saved && (
            <>
              <Icon name="check" className="size-5" /> Enregistré sur cet appareil
            </>
          )}
        </p>
      </section>

      {/* Export (EF-11) et nouveau parcours (EF-12) */}
      <section aria-labelledby="export-title" className="no-print flex flex-col gap-3 rounded-3xl border-2 border-line bg-surface p-4">
        <h2 id="export-title" className="sr-only">
          Exporter
        </h2>
        <p className="flex gap-3 text-base">
          <Icon name="info" className="mt-0.5 size-5 text-primary" />
          {frTypo(copy.keepCopy)}
        </p>
        <Button onClick={copy_} icon={<Icon name="copy" className="size-5" />}>
          {copy.copy}
        </Button>
        <Button variant="secondary" onClick={onCard} icon={<Icon name="sparkles" className="size-5" />}>
          {frTypo("Créer ma carte « Ma leçon »")}
        </Button>
        {printable && (
          <Button
            variant="secondary"
            onClick={() => {
              dispatch({ type: "exported" });
              window.print();
            }}
            icon={<Icon name="printer" className="size-5" />}
          >
            Imprimer / PDF
          </Button>
        )}
      </section>

      <div className="no-print flex flex-col gap-2">
        {fromHistory ? (
          <Button variant="secondary" onClick={onHome} icon={<Icon name="arrowLeft" className="size-5" />}>
            Retour à l&apos;accueil
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={() => (run.exported ? onNew() : setAskBeforeNew(true))}
            icon={<Icon name="rebound" className="size-5" />}
          >
            Nouveau parcours
          </Button>
        )}
      </div>

      {askBeforeNew && (
        <Sheet title="Garder une copie avant de recommencer ?" onClose={() => setAskBeforeNew(false)}>
          <p className="mb-4 text-base text-muted">
            {run.mode === "team"
              ? "Votre bilan reste dans l'historique de ce téléphone, mais une copie est plus sûre."
              : "Ton bilan reste dans l'historique de ce téléphone, mais une copie est plus sûre."}
          </p>
          <div className="grid grid-cols-2 gap-2 pb-2">
            <Button
              onClick={async () => {
                await copy_();
                setAskBeforeNew(false);
              }}
            >
              Copier d&apos;abord
            </Button>
            <Button variant="secondary" onClick={onNew}>
              Continuer
            </Button>
          </div>
        </Sheet>
      )}
    </div>
  );
}

function Block({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`block-${n}`} className="rounded-3xl border-2 border-line bg-surface p-5">
      <h2 id={`block-${n}`} className="mb-3 flex items-center gap-3 text-lg font-bold uppercase tracking-wide">
        <span className="grid size-8 place-items-center rounded-full bg-ink text-base text-bg" aria-hidden>
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Timeline({ icon, label, text, tone }: { icon: IconName; label: string; text: string; tone?: "setback" }) {
  return (
    <li className="relative">
      <span
        className={`absolute -left-[2.15rem] top-0 grid size-8 place-items-center rounded-full border-2 bg-surface ${
          tone === "setback" ? "border-setback text-setback" : "border-primary text-primary"
        }`}
        aria-hidden
      >
        <Icon name={icon} className="size-4" />
      </span>
      <span className={`block text-base font-bold ${tone === "setback" ? "text-setback" : "text-muted"}`}>{label}</span>
      <span className="block">{frTypo(text)}</span>
    </li>
  );
}

function ReflectionField({
  n,
  label,
  help,
  placeholder,
  value,
  onChange,
}: {
  n: number;
  label: string;
  help: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = useId();
  const helpId = useId();
  const near = value.length >= REFLECTION_MAX * 0.8;
  return (
    <div className="rounded-3xl border-2 border-line bg-surface p-4">
      <label htmlFor={id} className="block font-bold">
        {n}. {frTypo(label)}
      </label>
      <p id={helpId} className="mb-2 text-base text-muted">
        {frTypo(help)}
      </p>
      <textarea
        id={id}
        rows={3}
        maxLength={REFLECTION_MAX}
        value={value}
        placeholder={placeholder}
        aria-describedby={helpId}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border-2 border-line bg-bg p-3 [field-sizing:content] min-h-24 focus:border-primary"
      />
      <p className="mt-1 text-right text-base tabular-nums text-muted">{near ? `${value.length}/${REFLECTION_MAX}` : "~2 phrases suffisent"}</p>
    </div>
  );
}
