"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

interface InstallButtonProps {
  className?: string;
  children: ReactNode;
}

export default function InstallButton({ className, children }: InstallButtonProps) {
  const { lang } = useLanguage();
  const { promptInstall } = useInstallPrompt();

  const fallback =
    lang === "sw"
      ? 'Ili kusakinisha: kwenye Android gusa menyu kisha "Ongeza kwenye Skrini ya Mwanzo". Kwenye iPhone gusa Share kisha "Add to Home Screen".'
      : 'To install: on Android tap the menu then "Add to Home screen". On iPhone tap Share then "Add to Home Screen".';

  return (
    <button className={className} onClick={() => promptInstall(fallback)}>
      {children}
    </button>
  );
}
