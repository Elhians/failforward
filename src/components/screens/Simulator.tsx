"use client";
// Écran 2 — Simulateur Failure Lab en 4 étapes (cahier §5.2).
import { useEffect, useId, useRef, useState } from "react";
import { getBilan, getChoice, getPivots } from "@/lib/content";
import { PIVOT_CATEGORIES, t } from "@/lib/copy";
import { frTypo } from "@/lib/nbsp";
import { NOTE_MAX, STEP_INDEX, type RunAction } from "@/lib/run";
import type { Choice, Pivot, Run, Scenario } from "@/lib/types";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { Stepper } from "../ui/Stepper";

interface Props {
  run: Run;
  scenario: Scenario;
  dispatch: (a: RunAction) => void;
}

export function Simulator({ run, scenario, dispatch }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // À chaque changement d'étape, le focus va sur le titre (annonce fiable pour les lecteurs d'écran).
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [run.step]);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-5 px-4 pb-44 pt-2">
      <h1 className="sr-only">Parcours : {scenario.theme}</h1>
      <Stepper current={STEP_INDEX[run.step]} />
      {run.step === "situation" && <Situation run={run} scenario={scenario} dispatch={dispatch} headingRef={headingRef} />}
      {run.step === "setback" && <Setback run={run} scenario={scenario} dispatch={dispatch} headingRef={headingRef} />}
      {run.step === "pivot" && <PivotStep run={run} scenario={scenario} dispatch={dispatch} headingRef={headingRef} />}
      {run.step === "outcome" && <Outcome run={run} scenario={scenario} dispatch={dispatch} headingRef={headingRef} />}
    </div>
  );
}

type StepProps = Props & { headingRef: React.RefObject<HTMLHeadingElement | null> };

function Paragraphs({ text }: { text: string }) {
  return (
    <div className="prose-fr">
      {text.split(/\n{2,}/).map((p, i) => (
        <p key={i}>{frTypo(p)}</p>
      ))}
    </div>
  );
}

function TeamNudge({ run }: { run: Run }) {
  if (run.mode !== "team") return null;
  return (
    <p className="flex items-center gap-3 rounded-2xl bg-pivot-bg px-4 py-3 text-base">
      <Icon name="users" className="size-5 text-pivot" />
      {t(run.mode).debate}
    </p>
  );
}

function StickyBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 px-4 pt-3">
      <div className="mx-auto max-w-lg">{children}</div>
    </div>
  );
}

/** Carte de choix : radio natif stylé (flèches, espace, tabulation gérés par le navigateur). */
function OptionCard({
  name,
  value,
  checked,
  onSelect,
  letter,
  title,
  sub,
  tag,
}: {
  name: string;
  value: string;
  checked: boolean;
  onSelect: () => void;
  letter?: string;
  title: string;
  sub?: string;
  tag?: string;
}) {
  return (
    <label
      className={`ff-press relative flex min-h-16 cursor-pointer items-start gap-3 rounded-2xl border-2 bg-surface p-4 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary ${
        checked ? "border-primary bg-primary-soft" : "border-line hover:border-muted"
      }`}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onSelect} className="sr-only" />
      {letter && (
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-xl text-lg font-bold ${
            checked ? "bg-primary text-on-primary" : "bg-surface-2 text-ink"
          }`}
          aria-hidden
        >
          {letter}
        </span>
      )}
      <span className="flex-1">
        {tag && <span className="mb-1 block text-base font-bold uppercase tracking-wide text-muted">{tag}</span>}
        <span className="block font-bold leading-snug">{frTypo(title)}</span>
        {sub && <span className="mt-0.5 block text-base text-muted">{frTypo(sub)}</span>}
      </span>
      <span
        className={`grid size-7 shrink-0 place-items-center rounded-full border-2 ${checked ? "border-primary bg-primary text-on-primary" : "border-line"}`}
        aria-hidden
      >
        {checked && <Icon name="check" className="size-4" />}
      </span>
    </label>
  );
}

function Situation({ run, scenario, dispatch, headingRef }: StepProps) {
  const [sel, setSel] = useState<Choice["id"] | null>(null);
  const copy = t(run.mode);
  return (
    <>
      <section className="ff-enter flex flex-col gap-4" aria-labelledby="step-title">
        <p className="flex items-center gap-2 text-base font-bold uppercase tracking-wide text-primary">
          <Icon name="flag" className="size-5" /> {scenario.theme}
        </p>
        <h2 id="step-title" ref={headingRef} tabIndex={-1} className="text-xl font-bold leading-snug outline-none">
          {frTypo(scenario.stake ?? "La situation")}
        </h2>
        <Paragraphs text={scenario.situation} />
      </section>
      <TeamNudge run={run} />
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-xl font-bold">{copy.whatDo}</legend>
        {scenario.choices.map((c) => (
          <OptionCard
            key={c.id}
            name="choice"
            value={c.id}
            checked={sel === c.id}
            onSelect={() => setSel(c.id)}
            letter={c.id}
            title={c.label}
            sub={c.hint}
          />
        ))}
      </fieldset>
      <StickyBar>
        <Button
          inactive={!sel}
          onClick={() => sel && dispatch({ type: "choose", choiceId: sel })}
          iconEnd={<Icon name="arrowRight" className="size-5" />}
        >
          {copy.validateChoice}
        </Button>
        <p className="mt-1 min-h-6 text-center text-base text-muted">{sel ? " " : run.mode === "team" ? "Choisissez une option ci-dessus." : "Choisis une option ci-dessus."}</p>
      </StickyBar>
    </>
  );
}

function Setback({ run, scenario, dispatch, headingRef }: StepProps) {
  const choice = getChoice(scenario, run.choice_id);
  const copy = t(run.mode);
  return (
    <>
      <section aria-labelledby="step-title" className="ff-nudge rounded-3xl border-2 border-setback-line bg-setback-bg p-5">
        <p className="flex items-center gap-2 text-base font-bold uppercase tracking-wide text-setback">
          <Icon name="zap" className="size-5" /> Rebondissement
        </p>
        <h2 id="step-title" ref={headingRef} tabIndex={-1} className="mt-3 text-xl font-bold leading-snug outline-none">
          {frTypo(choice?.failure_event ?? "")}
        </h2>
        {choice && (
          <p className="mt-4 border-t border-setback-line pt-3 text-base text-muted">
            {copy.linkedTo} {choice.id} : {frTypo(choice.label.toLowerCase())}.
          </p>
        )}
      </section>
      <p className="flex gap-3 text-base text-muted">
        <Icon name="info" className="mt-0.5 size-5 text-primary" />
        {frTypo(copy.reassure)}
      </p>
      <StickyBar>
        <Button onClick={() => dispatch({ type: "toPivot" })} iconEnd={<Icon name="arrowRight" className="size-5" />}>
          {copy.continueSetback}
        </Button>
        <p className="mt-1 min-h-6">{" "}</p>
      </StickyBar>
    </>
  );
}

function PivotStep({ run, scenario, dispatch, headingRef }: StepProps) {
  const pivots = getPivots(scenario, run.choice_id);
  const choice = getChoice(scenario, run.choice_id);
  const copy = t(run.mode);
  const [sel, setSel] = useState<Pivot["id"] | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const noteId = useId();

  // Chronomètre silencieux (EF-07) : démarre à l'affichage des options, s'arrête au premier tap,
  // en pause quand l'app passe en arrière-plan. Aucun indicateur visible.
  const timer = useRef<DecisionTimer>({ start: 0, elapsed: 0, stopped: false });
  useEffect(() => {
    const tm = timer.current;
    const raf = requestAnimationFrame(() => {
      tm.start = performance.now();
    });
    const onVis = () => {
      if (tm.stopped) return;
      if (document.hidden) {
        if (tm.start) tm.elapsed += performance.now() - tm.start;
        tm.start = 0;
      } else {
        tm.start = performance.now();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  function select(id: Pivot["id"]) {
    stopTimer(timer.current);
    setSel(id);
  }

  return (
    <>
      <section aria-labelledby="step-title" className="ff-enter flex flex-col gap-2">
        <h2 id="step-title" ref={headingRef} tabIndex={-1} className="text-[1.375rem] font-bold outline-none">
          {copy.nowWhat}
        </h2>
        {choice && (
          <p className="flex gap-2 rounded-2xl bg-setback-bg px-4 py-3 text-base">
            <Icon name="zap" className="mt-0.5 size-5 text-setback" />
            <span>{frTypo(choice.failure_event)}</span>
          </p>
        )}
      </section>
      <TeamNudge run={run} />
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-xl font-bold">{run.mode === "team" ? "Comment rebondissez-vous ?" : "Comment rebondis-tu ?"}</legend>
        {pivots.map((p) => (
          <OptionCard
            key={p.id}
            name="pivot"
            value={p.id}
            checked={sel === p.id}
            onSelect={() => select(p.id)}
            title={p.label}
            tag={p.category ? PIVOT_CATEGORIES[p.category] : undefined}
          />
        ))}
      </fieldset>

      {/* Justification libre (EF-08) : proposée seulement après le choix, pour ne pas fausser le chrono. */}
      {sel && (
        <div className="ff-enter">
          {!noteOpen && !run.free_note ? (
            <Button variant="ghost" icon={<Icon name="plus" className="size-5" />} onClick={() => setNoteOpen(true)}>
              Ajouter une justification (facultatif)
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <label htmlFor={noteId} className="font-bold">
                Pourquoi ce rebond ? <span className="font-normal text-muted">(facultatif, reste sur ce téléphone)</span>
              </label>
              <textarea
                id={noteId}
                rows={3}
                maxLength={NOTE_MAX}
                value={run.free_note}
                onChange={(e) => dispatch({ type: "note", text: e.target.value })}
                className="rounded-2xl border-2 border-line bg-surface p-3 focus:border-primary"
              />
              <p className="text-right text-base tabular-nums text-muted" aria-live="polite">
                {run.free_note.length >= NOTE_MAX * 0.8 ? `${run.free_note.length}/${NOTE_MAX}` : ""}
              </p>
            </div>
          )}
        </div>
      )}

      <StickyBar>
        <Button
          inactive={!sel}
          onClick={() => sel && dispatch({ type: "pivot", pivotId: sel, ms: timer.current.elapsed })}
          iconEnd={<Icon name="arrowRight" className="size-5" />}
        >
          {copy.validatePivot}
        </Button>
        <p className="mt-1 min-h-6 text-center text-base text-muted">{sel ? " " : run.mode === "team" ? "Choisissez une option ci-dessus." : "Choisis une option ci-dessus."}</p>
      </StickyBar>
    </>
  );
}

interface DecisionTimer {
  start: number;
  elapsed: number;
  stopped: boolean;
}

/** Arrête le chronomètre au premier tap (les changements d'avis ultérieurs ne comptent pas). */
function stopTimer(tm: DecisionTimer) {
  if (tm.stopped) return;
  if (tm.start) tm.elapsed += performance.now() - tm.start;
  tm.stopped = true;
}

function Outcome({ run, scenario, dispatch, headingRef }: StepProps) {
  const bilan = getBilan(scenario, run.choice_id, run.pivot_id);
  const copy = t(run.mode);
  return (
    <>
      <section aria-labelledby="step-title" className="ff-enter flex flex-col gap-4">
        <p className="flex items-center gap-2 text-base font-bold uppercase tracking-wide text-primary">
          <Icon name="flag" className="size-5" /> Résultat
        </p>
        <h2 id="step-title" ref={headingRef} tabIndex={-1} className="text-[1.375rem] font-bold outline-none">
          Voici ce qui se passe ensuite
        </h2>
        <p className="rounded-3xl border-2 border-line bg-surface p-5">{frTypo(bilan?.outcome ?? "")}</p>
        <p className="text-base text-muted">
          {run.mode === "team"
            ? "Pas de note, pas de classement : le bilan vous aide à comprendre ce qui s'est joué."
            : "Pas de note, pas de classement : le bilan t'aide à comprendre ce qui s'est joué."}
        </p>
      </section>
      <StickyBar>
        <Button onClick={() => dispatch({ type: "toDebrief" })} iconEnd={<Icon name="arrowRight" className="size-5" />}>
          {copy.seeDebrief}
        </Button>
        <p className="mt-1 min-h-6">{" "}</p>
      </StickyBar>
    </>
  );
}
