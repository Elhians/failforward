"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Feuille du bas (bottom sheet) modale, fermée par Échap ou le fond. */
export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="presentation">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        tabIndex={-1}
        className="ff-sheet safe-bottom relative w-full max-w-lg rounded-t-3xl bg-surface px-5 pt-5 shadow-2xl outline-none"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-line" aria-hidden />
        <h2 id="sheet-title" className="mb-4 text-xl font-bold">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
