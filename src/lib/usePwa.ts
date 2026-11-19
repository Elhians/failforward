"use client";
// État PWA : installation (Android/iOS), mode autonome, « prête hors-ligne », version de secours.
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export interface PwaState {
  standalone: boolean;
  ios: boolean;
  fileMode: boolean;
  mirror: boolean;
  offlineReady: boolean;
  canInstall: boolean;
  install: () => Promise<void>;
}

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function usePwa(): PwaState {
  // usePwa n'est appelé qu'après l'hydratation (AppInner) : lecture directe du navigateur.
  const [standalone, setStandalone] = useState(() => {
    const nav = navigator as Navigator & { standalone?: boolean };
    return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
  });
  const [ios] = useState(() => {
    const ua = navigator.userAgent;
    return /iPad|iPhone|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  });
  const [fileMode] = useState(() => location.protocol === "file:");
  const [mirror] = useState(() => location.hostname.endsWith("github.io"));
  const [offlineReady, setOfflineReady] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      setStandalone(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    // Service worker : production uniquement, jamais en file://.
    if ("serviceWorker" in navigator && location.protocol !== "file:" && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register(`${base}/sw.js`, { scope: `${base}/` })
        .catch(() => undefined);
      navigator.serviceWorker.ready
        .then(() => setOfflineReady(true))
        .catch(() => undefined);
      navigator.serviceWorker.addEventListener("message", (e) => {
        if (e.data?.type === "FFESP_PRECACHED") setOfflineReady(true);
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  return {
    standalone,
    ios,
    fileMode,
    mirror,
    offlineReady,
    canInstall: !!deferred,
    install: async () => {
      if (!deferred) return;
      await deferred.prompt();
      await deferred.userChoice.catch(() => undefined);
      setDeferred(null); // prompt() n'est utilisable qu'une fois
    },
  };
}
