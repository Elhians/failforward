"use client";
// Écran 4 — Carte « Ma leçon » (cahier §5.4, EF-17) : sans pseudo, générée dans le navigateur.
import { useEffect, useRef, useState } from "react";
import { getBilan } from "@/lib/content";
import { FAILURE_TYPES } from "@/lib/copy";
import { canShareFile, downloadBlob, renderLessonCard } from "@/lib/export";
import { frTypo } from "@/lib/nbsp";
import type { Run, Scenario } from "@/lib/types";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

interface Props {
  run: Run;
  scenario: Scenario;
  onClose: () => void;
  onExported: () => void;
  notify: (msg: string) => void;
}

export function LessonCard({ run, scenario, onClose, onExported, notify }: Props) {
  const bilan = getBilan(scenario, run.choice_id, run.pivot_id);
  const lesson = (run.own_lesson.trim() || bilan?.key_takeaway || "").trim();
  const failureLabel = bilan ? FAILURE_TYPES[bilan.failure_type].label : undefined;
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [big, setBig] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // L'image est générée dès l'ouverture : Safari refuse navigator.share après une attente asynchrone.
  useEffect(() => {
    let revoke: string | null = null;
    const date = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(new Date(run.finished_at ?? Date.now()));
    renderLessonCard({ lesson: frTypo(lesson), failureLabel, failureType: bilan?.failure_type, dateLabel: `Journée Fail Forward · ESP · ${date}` }).then((b) => {
      if (!b) return;
      setBlob(b);
      revoke = URL.createObjectURL(b);
      setUrl(revoke);
    });
    headingRef.current?.focus({ preventScroll: true });
    return () => {
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [lesson, failureLabel, bilan?.failure_type, run.finished_at]);

  const file = blob ? new File([blob], "ma-lecon-fail-forward.png", { type: "image/png" }) : null;
  const shareable = !!file && canShareFile(file);

  async function share() {
    if (!file) return;
    try {
      await navigator.share({ files: [file], title: "Ma leçon — Fail Forward ESP" });
      onExported();
    } catch (e) {
      if ((e as DOMException)?.name !== "AbortError") save();
    }
  }

  function save() {
    if (!blob) return;
    downloadBlob(blob, "ma-lecon-fail-forward.png");
    onExported();
    notify("Image enregistrée dans tes téléchargements.");
  }

  if (big) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col justify-center bg-ink p-6 text-bg"
        role="dialog"
        aria-modal="true"
        aria-label="Ma leçon en grand"
      >
        <p className="mb-4 text-lg font-bold uppercase tracking-wide opacity-80">Ma leçon</p>
        <p className="text-[clamp(1.75rem,8vw,3rem)] font-bold leading-tight">« {frTypo(lesson)} »</p>
        <Button variant="secondary" className="mt-10 border-bg/40 bg-transparent text-bg" onClick={() => setBig(false)} icon={<Icon name="x" className="size-5" />}>
          Fermer
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-5 px-4 pb-16 pt-4">
      <Button variant="ghost" className="self-start" icon={<Icon name="arrowLeft" className="size-5" />} onClick={onClose}>
        Retour au bilan
      </Button>
      <h1 ref={headingRef} tabIndex={-1} className="text-[1.75rem] font-bold outline-none">
        Ta carte « Ma leçon »
      </h1>
      <div className="overflow-hidden rounded-3xl border-2 border-line bg-surface-2" style={{ aspectRatio: "4 / 5" }}>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={`Carte : « ${lesson} »${failureLabel ? `, ${failureLabel}` : ""}`} className="size-full object-contain" />
        ) : (
          <p className="grid size-full place-items-center text-muted">Préparation de la carte…</p>
        )}
      </div>
      <p className="text-base text-muted">
        {run.own_lesson.trim() ? "La carte reprend ta phrase." : "Tu n'as pas écrit ta leçon : la carte reprend la leçon proposée."} Aucun pseudo
        sur la carte, rien n&apos;est envoyé.
      </p>
      <div className="flex flex-col gap-3">
        {shareable && (
          <Button onClick={share} icon={<Icon name="share" className="size-5" />}>
            Partager l&apos;image
          </Button>
        )}
        <Button variant={shareable ? "secondary" : "primary"} inactive={!blob} onClick={save} icon={<Icon name="download" className="size-5" />}>
          Enregistrer l&apos;image
        </Button>
        <Button variant="secondary" onClick={() => setBig(true)} icon={<Icon name="maximize" className="size-5" />}>
          Montrer en grand
        </Button>
      </div>
    </div>
  );
}
