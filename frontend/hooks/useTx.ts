"use client";

import { useLanguage } from "./useLanguage";

export function useTx() {
  const { lang } = useLanguage();
  return (sw: string, en: string) => (lang === "sw" ? sw : en);
}
