"use client";

import { useCallback, useEffect, useState } from "react";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as InstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const promptInstall = useCallback(
    async (fallbackMessage?: string) => {
      if (deferred) {
        await deferred.prompt();
        await deferred.userChoice;
        setDeferred(null);
        return;
      }
      if (fallbackMessage) window.alert(fallbackMessage);
    },
    [deferred]
  );

  return { canInstall: Boolean(deferred), promptInstall };
}
