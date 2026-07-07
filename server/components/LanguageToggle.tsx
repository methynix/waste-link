"use client";

import { useLanguage } from "@/hooks/useLanguage";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="langtoggle" role="group" aria-label="Language">
      <button aria-pressed={lang === "sw"} onClick={() => setLang("sw")}>
        SW
      </button>
      <button aria-pressed={lang === "en"} onClick={() => setLang("en")}>
        EN
      </button>
    </div>
  );
}
