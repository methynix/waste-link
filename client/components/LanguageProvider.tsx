"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "sw" | "en";

interface LanguageValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const LanguageContext = createContext<LanguageValue>({
  lang: "sw",
  setLang: () => {},
});

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("sw");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("wastelink-lang") as Lang | null;
      if (saved === "sw" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("wastelink-lang", l);
    } catch {}
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <div className={`lang-${lang}`}>{children}</div>
    </LanguageContext.Provider>
  );
}
