"use client";
// Écran 1 — Accueil (cahier §5.1) : pseudo, mode, tirage, reprise, installation.
import { useId, useRef, useState } from "react";
import { SCENARIOS, getScenario } from "@/lib/content";
import { drawScenario } from "@/lib/draw";
import { PSEUDO_MAX, randomPseudo, validatePseudo } from "@/lib/pseudo";
import { KEYS, readJSON, readString, writeJSON, writeString } from "@/lib/storage";
import type { Mode, Run } from "@/lib/types";
import type { PwaState } from "@/lib/usePwa";
import { STEP_INDEX } from "@/lib/run";
import { STEPS } from "@/lib/copy";
import { frTypo } from "@/lib/nbsp";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

interface DrawState {
  scenario_id: string;
  redraw_used: boolean;
}

export interface HomeProps {
  pwa: PwaState;
  resumable: Run | null;
  history: Run[];
  storageOk: boolean;
  onStart: (pseudo: string, mode: Mode, scenarioId: string, redrawUsed: boolean) => void;
  onResume: () => void;
  onDiscard: () => void;
  onOpenHistory: (run: Run) => void;
  onClearHistory: () => void;
}

export function Home(props: HomeProps) {
  const { pwa, resumable, history, storageOk } = props;
  const [mode, setMode] = useState<Mode>(() => (readString(KEYS.lastMode) === "team" ? "team" : "solo"));
  const [pseudo, setPseudo] = useState(() => readString(KEYS.lastPseudo) ?? "");
  const [touched, setTouched] = useState(false);
  const [showReason, setShowReason] = useState(false);
  // Le tirage est relu du stockage : un rafraîchissement ne relance pas le tirage.
  const [draw, setDraw] = useState<DrawState | null>(() => {
    const d = readJSON<DrawState>(KEYS.draw);
    return d && getScenario(d.scenario_id) ? d : null;
  });
  const [flipKey, setFlipKey] = useState(0);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const pseudoRef = useRef<HTMLInputElement>(null);
  const drawBtnRef = useRef<HTMLButtonElement>(null);
  const ids = { pseudo: useId(), hint: useId(), err: useId(), reason: useId() };
  const team = mode === "team";

  const check = validatePseudo(pseudo, team);
  const showError = !check.ok && (touched || pseudo.trim().length >= 3);
  const scenario = draw ? getScenario(draw.scenario_id) : undefined;
  const ready = check.ok && !!scenario;
  const reason = !check.ok
    ? check.message
    : !scenario
      ? team
        ? "Tirez votre scénario pour commencer."
        : "Tire ton scénario pour commencer."
      : "";

  function persistDraw(d: DrawState) {
    setDraw(d);
    writeJSON(KEYS.draw, d);
    setFlipKey((k) => k + 1);
  }

  function doDraw() {
    if (!draw) persistDraw({ scenario_id: drawScenario(SCENARIOS).id, redraw_used: false });
    else if (!draw.redraw_used) persistDraw({ scenario_id: drawScenario(SCENARIOS, draw.scenario_id).id, redraw_used: true });
  }

  function start() {
    if (!ready || !check.ok || !scenario) {
      setTouched(true);
      setShowReason(true);
      if (!check.ok) pseudoRef.current?.focus();
      else drawBtnRef.current?.focus();
      return;
    }
    writeString(KEYS.lastPseudo, check.value);
    writeString(KEYS.lastMode, mode);
    props.onStart(check.value, mode, scenario.id, draw?.redraw_used ?? false);
  }

  return (
    <div className="ff-enter mx-auto flex w-full max-w-lg flex-col gap-6 px-4 pb-44 pt-2">
      <section aria-labelledby="home-title" className="pt-4">
        <h1 id="home-title" className="text-[1.75rem] font-bold leading-tight">
          {frTypo("Ici, rater fait partie du jeu.")}
        </h1>
        <p className="mt-2 text-muted">
          {team
            ? "Une situation, un imprévu, votre rebond. Personne ne voit vos réponses."
            : "Une situation, un imprévu, ton rebond. Personne ne voit tes réponses."}
        </p>
      </section>

      {!storageOk && (
        <p className="flex gap-3 rounded-2xl border-2 border-setback-line bg-setback-bg p-4 text-base">
          <Icon name="info" className="size-5 text-setback" />
          <span>
            {frTypo(
              "Le stockage local est désactivé sur ce navigateur : le parcours fonctionne, mais pense à copier ton bilan avant de quitter.",
            )}
          </span>
        </p>
      )}

      {resumable && (
        <section aria-labelledby="resume-title" className="rounded-3xl border-2 border-primary bg-primary-soft p-4">
          <h2 id="resume-title" className="text-lg font-bold">
            {resumable.step === "debrief" ? "Ton dernier bilan est prêt" : "Reprendre ton parcours ?"}
          </h2>
          <p className="mt-1 text-base text-muted">
            {getScenario(resumable.scenario_id)?.theme ?? "Scénario"} ·{" "}
            {resumable.step === "debrief" ? "bilan" : `étape ${STEP_INDEX[resumable.step] + 1}/4 (${STEPS[STEP_INDEX[resumable.step]]})`}{" "}
            · {resumable.pseudo}
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <Button onClick={props.onResume} iconEnd={<Icon name="arrowRight" className="size-5" />}>
              {resumable.step === "debrief" ? "Revoir le bilan" : "Reprendre"}
            </Button>
            {confirmDiscard ? (
              <div className="flex flex-col gap-2 rounded-2xl bg-surface p-3">
                <p className="text-base">Ce parcours sera remplacé par un nouveau. Continuer ?</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="secondary" onClick={() => setConfirmDiscard(false)}>
                    Annuler
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setConfirmDiscard(false);
                      props.onDiscard();
                    }}
                  >
                    Oui, nouveau
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="ghost" className="self-center" onClick={() => setConfirmDiscard(true)}>
                Commencer un nouveau parcours
              </Button>
            )}
          </div>
        </section>
      )}

      <InstallCard pwa={pwa} />

      {/* Pseudo (EF-01, EF-02) */}
      <section className="flex flex-col gap-2">
        <label htmlFor={ids.pseudo} className="text-lg font-bold">
          {team ? "Votre pseudo d'équipe" : "Ton pseudo"}
        </label>
        <div className="flex gap-2">
          <input
            ref={pseudoRef}
            id={ids.pseudo}
            value={pseudo}
            onChange={(e) => {
              setPseudo(e.target.value.slice(0, PSEUDO_MAX + 5));
              setShowReason(false);
            }}
            onBlur={() => pseudo && setTouched(true)}
            maxLength={PSEUDO_MAX + 5}
            autoComplete="off"
            autoCapitalize="words"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="done"
            aria-invalid={showError || undefined}
            aria-describedby={`${ids.hint} ${showError ? ids.err : ""}`}
            placeholder={team ? "Ex. : Les Colibris" : "Ex. : Hibou Curieux"}
            className="min-h-13 min-w-0 flex-1 rounded-2xl border-2 border-line bg-surface px-4 text-lg placeholder:text-muted/70 focus:border-primary aria-invalid:border-setback"
          />
          <button
            type="button"
            onClick={() => {
              setPseudo(randomPseudo(team));
              setTouched(true);
              setShowReason(false);
            }}
            className="ff-press flex min-h-13 shrink-0 items-center gap-2 rounded-2xl border-2 border-line bg-surface px-3 font-bold hover:border-primary"
          >
            <Icon name="dice" className="size-6 text-primary" />
            <span className="text-base leading-tight">
              Au
              <br />
              hasard
            </span>
          </button>
        </div>
        <div className="flex justify-between gap-3 text-base">
          <p id={ids.hint} className="text-muted">
            <Icon name="lock" className="mr-1 inline size-4 align-[-2px]" />
            {frTypo(
              team
                ? "Pas de compte, rien n'est envoyé. N'écrivez ni vrai nom ni information personnelle."
                : "Pas de compte, rien n'est envoyé. N'écris ni ton vrai nom ni d'information personnelle.",
            )}
          </p>
          <span className="shrink-0 tabular-nums text-muted" aria-hidden>
            {pseudo.trim().length}/{PSEUDO_MAX}
          </span>
        </div>
        {showError && !check.ok && (
          <p id={ids.err} className="text-base font-bold text-setback">
            {frTypo(check.message)}
          </p>
        )}
      </section>

      {/* Mode (EF-03) */}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-lg font-bold">{team ? "Vous jouez…" : "Tu joues…"}</legend>
        {(
          [
            { v: "solo", icon: "user", title: "Solo", sub: "Seul·e sur ton téléphone" },
            { v: "team", icon: "users", title: "En équipe", sub: "2 ou 3 personnes sur un seul téléphone" },
          ] as const
        ).map((o) => (
          <label
            key={o.v}
            className="ff-press flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 border-line bg-surface p-4 has-checked:border-primary has-checked:bg-primary-soft has-focus-visible:outline-3 has-focus-visible:outline-primary"
          >
            <input
              type="radio"
              name="mode"
              value={o.v}
              checked={mode === o.v}
              onChange={() => {
                setMode(o.v);
                writeString(KEYS.lastMode, o.v);
              }}
              className="peer sr-only"
            />
            <Icon name={o.icon} className="size-7 text-primary" />
            <span className="flex-1">
              <span className="block font-bold">{o.title}</span>
              <span className="block text-base text-muted">{o.sub}</span>
            </span>
            <span className="grid size-7 place-items-center rounded-full border-2 border-line peer-checked:border-primary peer-checked:bg-primary peer-checked:text-on-primary">
              {mode === o.v && <Icon name="check" className="size-4" />}
            </span>
          </label>
        ))}
      </fieldset>

      {/* Tirage du scénario (EF-04) */}
      <section aria-labelledby="draw-title" className="flex flex-col gap-2">
        <h2 id="draw-title" className="text-lg font-bold">
          {team ? "Votre scénario" : "Ton scénario"}
        </h2>
        <div aria-live="polite">
          {scenario ? (
            <div key={flipKey} className="ff-flip rounded-3xl bg-ink p-5 text-bg">
              <p className="text-base opacity-80">
                Scénario tiré au sort · {SCENARIOS.findIndex((s) => s.id === scenario.id) + 1}/{SCENARIOS.length}
              </p>
              <p className="mt-1 text-2xl font-bold">{scenario.theme}</p>
            </div>
          ) : (
            <button
              ref={drawBtnRef}
              type="button"
              onClick={doDraw}
              className="ff-press flex w-full items-center gap-4 rounded-3xl border-2 border-dashed border-primary bg-primary-soft p-5 text-left"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-primary text-2xl font-bold text-on-primary" aria-hidden>
                ?
              </span>
              <span>
                <span className="block text-lg font-bold">{team ? "Tirer notre scénario" : "Tirer mon scénario"}</span>
                <span className="block text-base text-muted">Parmi {SCENARIOS.length} situations, au hasard</span>
              </span>
            </button>
          )}
        </div>
        {scenario && (
          <Button
            variant="secondary"
            inactive={draw?.redraw_used}
            onClick={() => (draw?.redraw_used ? undefined : doDraw())}
            icon={<Icon name="rebound" className="size-5" />}
            iconEnd={
              draw?.redraw_used ? undefined : (
                <span className="rounded-full bg-primary-soft px-2 text-base text-primary">
                  1<span className="sr-only"> restant</span>
                </span>
              )
            }
          >
            {draw?.redraw_used ? "Nouveau tirage déjà utilisé" : "Tirer un autre scénario"}
          </Button>
        )}
      </section>

      {history.length > 0 && <HistoryList history={history} onOpen={props.onOpenHistory} onClear={props.onClearHistory} />}

      <footer className="flex flex-col items-center gap-1 text-center text-base text-muted">
        {!pwa.fileMode && (
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/fail-forward-secours.html`}
            download="fail-forward-secours.html"
            className="inline-flex min-h-11 items-center gap-2 font-bold text-primary underline underline-offset-4"
          >
            <Icon name="download" className="size-5" />
            Télécharger la version de secours
          </a>
        )}
        {!pwa.fileMode && <span className="text-sm">Un seul fichier, à partager par WhatsApp, Bluetooth ou clé USB.</span>}
        <span className="text-sm">
          {pwa.fileMode ? "Version de secours (fichier)" : pwa.mirror ? "Version de secours (miroir)" : "Version principale"}
          {" · "}Fail Forward ESP
        </span>
      </footer>

      {/* CTA collant dans la zone du pouce */}
      <div className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 px-4 pt-3">
        <div className="mx-auto max-w-lg">
          <Button inactive={!ready} onClick={start} aria-describedby={!ready ? ids.reason : undefined} iconEnd={<Icon name="arrowRight" className="size-5" />}>
            Commencer
          </Button>
          <p id={ids.reason} className={`mt-1 min-h-6 text-center text-base ${showReason ? "font-bold text-setback" : "text-muted"}`}>
            {!ready && !(showError && !check.ok) ? frTypo(reason) : !ready ? (team ? "Corrigez le pseudo ci-dessus." : "Corrige le pseudo ci-dessus.") : " "}
          </p>
        </div>
      </div>
    </div>
  );
}

function InstallCard({ pwa }: { pwa: PwaState }) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(KEYS.installDismissed) === "1";
    } catch {
      return false;
    }
  });

  if (pwa.fileMode) {
    return (
      <p className="flex gap-3 rounded-2xl border-2 border-setback-line bg-setback-bg p-4 text-base">
        <Icon name="info" className="size-5 shrink-0 text-setback" />
        <span>{frTypo("Version de secours : rien n'est gardé après fermeture. Copie ton bilan avant de quitter.")}</span>
      </p>
    );
  }

  const ready = (
    <p className="flex items-center gap-2 self-start rounded-full bg-primary-soft px-3 py-1.5 text-base font-bold text-primary">
      <Icon name="check" className="size-5" />
      Prête à jouer, même sans réseau
    </p>
  );

  if (pwa.standalone || dismissed) return pwa.offlineReady ? ready : null;

  return (
    <section aria-labelledby="install-title" className="flex flex-col gap-3 rounded-3xl border-2 border-line bg-surface p-4">
      <div className="flex items-start gap-3">
        <Icon name="phone" className="mt-0.5 size-7 text-primary" />
        <div className="flex-1">
          <h2 id="install-title" className="text-lg font-bold">
            Prépare ton téléphone
          </h2>
          <p className="text-base text-muted">
            {frTypo("Installe l'app maintenant (moins de 0,5 Mo) : le jour J, elle marchera même sans Wi-Fi.")}
          </p>
        </div>
      </div>
      {pwa.canInstall ? (
        <Button onClick={pwa.install} icon={<Icon name="download" className="size-5" />}>
          Installer l&apos;app
        </Button>
      ) : pwa.ios ? (
        <ol className="flex flex-col gap-2 text-base">
          <li className="flex items-center gap-2">
            <Step n={1} /> Touche <Icon name="share" className="size-5 text-primary" label="Partager" /> (Partager)
          </li>
          <li className="flex items-center gap-2">
            <Step n={2} /> {frTypo("Choisis « Sur l'écran d'accueil »")}
            <Icon name="squarePlus" className="size-5 text-primary" />
          </li>
          <li className="flex items-center gap-2">
            <Step n={3} /> {frTypo("Laisse « Ouvrir comme app web » activé, puis « Ajouter »")}
          </li>
        </ol>
      ) : (
        <p className="text-base">{frTypo("Dans le menu du navigateur (⋮), choisis « Installer l'application » ou « Ajouter à l'écran d'accueil ».")}</p>
      )}
      {pwa.offlineReady && ready}
      <Button
        variant="ghost"
        className="self-center"
        onClick={() => {
          setDismissed(true);
          try {
            sessionStorage.setItem(KEYS.installDismissed, "1");
          } catch {
            /* rien */
          }
        }}
      >
        Plus tard
      </Button>
    </section>
  );
}

function Step({ n }: { n: number }) {
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-base font-bold text-on-primary" aria-hidden>
      {n}
    </span>
  );
}

function HistoryList({ history, onOpen, onClear }: { history: Run[]; onOpen: (r: Run) => void; onClear: () => void }) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const fmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  return (
    <section aria-labelledby="hist-title" className="rounded-3xl border-2 border-line bg-surface">
      <h2 id="hist-title">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex min-h-14 w-full items-center gap-3 px-4 text-left text-lg font-bold"
        >
          <Icon name="clock" className="size-6 text-primary" />
          <span className="flex-1">Mes parcours sur ce téléphone ({history.length})</span>
          <Icon name="chevronDown" className={`size-5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </h2>
      {open && (
        <div className="px-4 pb-4">
          <ul className="flex flex-col gap-2">
            {history.map((r) => (
              <li key={r.run_id}>
                <button
                  type="button"
                  onClick={() => onOpen(r)}
                  className="ff-press flex min-h-14 w-full flex-col rounded-2xl bg-surface-2 px-4 py-2 text-left"
                >
                  <span className="font-bold">{getScenario(r.scenario_id)?.theme ?? r.scenario_id}</span>
                  <span className="text-base text-muted">
                    {fmt.format(new Date(r.finished_at ?? r.started_at))} · {r.pseudo} · {r.mode === "team" ? "Équipe" : "Solo"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {confirm ? (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => setConfirm(false)}>
                Annuler
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setConfirm(false);
                  onClear();
                }}
              >
                Oui, effacer
              </Button>
            </div>
          ) : (
            <Button variant="ghost" className="mt-2" icon={<Icon name="trash" className="size-5" />} onClick={() => setConfirm(true)}>
              Effacer mon historique
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
