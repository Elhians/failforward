"use client";
// Racine de l'application : une seule route, machine d'états côté client, tout en local (cahier §8).
import { useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { getScenario } from "@/lib/content";
import { createRun, reduceRun, type RunAction } from "@/lib/run";
import {
  KEYS,
  clearHistory,
  loadCurrentRun,
  loadHistory,
  remove,
  saveCurrentRun,
  storageAvailable,
  upsertHistory,
} from "@/lib/storage";
import type { Mode, Run } from "@/lib/types";
import { usePwa } from "@/lib/usePwa";
import { useHydrated } from "@/lib/useHydrated";
import { Debrief } from "./screens/Debrief";
import { Home } from "./screens/Home";
import { LessonCard } from "./screens/LessonCard";
import { Simulator } from "./screens/Simulator";
import { Icon } from "./ui/Icon";
import { ThemeToggle } from "./ui/ThemeToggle";
import { Toast } from "./ui/Toast";

type View = "home" | "run" | "card" | "history" | "historyCard";

/** Transition d'écran via View Transitions (amélioration progressive, coupée si mouvement réduit). */
function transition(fn: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduce) fn();
  else doc.startViewTransition(() => flushSync(fn));
}

/** Le HTML statique ne contient qu'un squelette : tout l'état vit dans le téléphone (localStorage). */
export default function App() {
  const hydrated = useHydrated();
  if (hydrated) return <AppInner />;
  return (
    <>
      <header className="mx-auto flex w-full max-w-lg items-center justify-between px-4 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <span className="flex min-h-11 items-center gap-2 text-base font-bold tracking-wide text-primary">
          <Logo /> FAIL FORWARD · ESP
        </span>
      </header>
      <main className="mx-auto max-w-lg px-4 pt-6" aria-busy="true">
        <h1 className="text-[1.75rem] font-bold leading-tight">Ici, rater fait partie du jeu.</h1>
        <noscript>
          <p className="mt-4">Cette application a besoin de JavaScript pour fonctionner.</p>
        </noscript>
      </main>
    </>
  );
}

/** Lit le parcours en cours : reprise automatique après rafraîchissement (EF-14). */
function initialRun(): Run | null {
  const current = loadCurrentRun();
  if (current && getScenario(current.scenario_id)) return current;
  if (current) saveCurrentRun(null);
  return null;
}

function AppInner() {
  const pwa = usePwa();
  const [storageOk, setStorageOk] = useState(storageAvailable);
  const [run, setRun] = useState<Run | null>(initialRun);
  const [viewing, setViewing] = useState<Run | null>(null);
  const [history, setHistory] = useState<Run[]>(loadHistory);
  const [view, setView] = useState<View>(() => (run ? "run" : "home"));
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 6000);
  }, []);

  const dispatch = useCallback(
    (a: RunAction) => {
      if (!run) return;
      const next = reduceRun(run, a);
      if (next === run) return;
      const apply = () => {
        setRun(next);
        if (!saveCurrentRun(next)) setStorageOk(false); // sauvegarde à chaque clic (§10.1)
        if (next.step === "debrief") setHistory(upsertHistory(next));
      };
      if (next.step !== run.step) transition(apply);
      else apply();
    },
    [run],
  );

  const dispatchHistory = useCallback(
    (a: RunAction) => {
      if (!viewing) return;
      const next = reduceRun(viewing, a);
      setViewing(next);
      setHistory(upsertHistory(next));
      if (run?.run_id === next.run_id) {
        setRun(next);
        saveCurrentRun(next);
      }
    },
    [viewing, run],
  );

  function start(pseudo: string, mode: Mode, scenarioId: string, redrawUsed: boolean) {
    const s = getScenario(scenarioId);
    if (!s) return;
    const r = createRun(pseudo, mode, s, redrawUsed);
    remove(KEYS.draw); // le prochain parcours aura un nouveau tirage
    transition(() => {
      setRun(r);
      if (!saveCurrentRun(r)) setStorageOk(false);
      setView("run");
    });
  }

  function goHome() {
    transition(() => {
      setViewing(null);
      setView("home");
    });
  }

  function newRun() {
    transition(() => {
      saveCurrentRun(null);
      setRun(null);
      setView("home");
    });
  }

  const scenario = run ? getScenario(run.scenario_id) : undefined;
  const viewingScenario = viewing ? getScenario(viewing.scenario_id) : undefined;
  const printable = !(pwa.ios && pwa.standalone);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-xl focus:bg-surface focus:p-3">
        Aller au contenu
      </a>
      <header className="no-print mx-auto flex w-full max-w-lg items-center justify-between px-4 pt-[max(0.5rem,env(safe-area-inset-top))]">
        {view === "home" ? (
          <span className="flex min-h-11 items-center gap-2 text-base font-bold tracking-wide text-primary">
            <Logo /> FAIL FORWARD · ESP
          </span>
        ) : (
          <button
            type="button"
            onClick={goHome}
            className="ff-press flex min-h-11 items-center gap-2 rounded-xl pr-2 text-base font-bold tracking-wide text-primary"
          >
            <Icon name="arrowLeft" className="size-5" /> <Logo /> FAIL FORWARD
            <span className="sr-only"> : retour à l&apos;accueil, le parcours est sauvegardé</span>
          </button>
        )}
        <ThemeToggle />
      </header>

      <main id="main">
        {view === "run" && run && scenario ? (
          run.step === "debrief" ? (
            <Debrief
              run={run}
              scenario={scenario}
              dispatch={dispatch}
              notify={notify}
              onNew={newRun}
              onCard={() => transition(() => setView("card"))}
              onHome={goHome}
              printable={printable}
            />
          ) : (
            <Simulator run={run} scenario={scenario} dispatch={dispatch} />
          )
        ) : view === "card" && run && scenario ? (
          <LessonCard
            run={run}
            scenario={scenario}
            notify={notify}
            onExported={() => dispatch({ type: "exported" })}
            onClose={() => transition(() => setView("run"))}
          />
        ) : view === "history" && viewing && viewingScenario ? (
          <Debrief
            run={viewing}
            scenario={viewingScenario}
            dispatch={dispatchHistory}
            notify={notify}
            onNew={goHome}
            onCard={() => transition(() => setView("historyCard"))}
            onHome={goHome}
            fromHistory
            printable={printable}
          />
        ) : view === "historyCard" && viewing && viewingScenario ? (
          <LessonCard
            run={viewing}
            scenario={viewingScenario}
            notify={notify}
            onExported={() => dispatchHistory({ type: "exported" })}
            onClose={() => transition(() => setView("history"))}
          />
        ) : (
          <Home
            pwa={pwa}
            resumable={run}
            history={history}
            storageOk={storageOk}
            onStart={start}
            onResume={() => transition(() => setView("run"))}
            onDiscard={() => {
              saveCurrentRun(null);
              setRun(null);
            }}
            onOpenHistory={(r) =>
              transition(() => {
                setViewing(r);
                setView("history");
              })
            }
            onClearHistory={() => {
              clearHistory();
              setHistory([]);
            }}
          />
        )}
      </main>
      <Toast message={toast} onClose={() => setToast(null)} />
    </>
  );
}

function Logo() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect width="24" height="24" rx="6" fill="currentColor" />
      <path d="M5.5 8.5 9 16l7.5-9.5" stroke="var(--app-bg)" strokeWidth="2.4" />
      <path d="M13.5 6.5h3v3" stroke="var(--app-bg)" strokeWidth="2.4" />
      <circle cx="9" cy="16" r="2" fill="#ffb900" />
    </svg>
  );
}
