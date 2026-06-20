"use client";

import { useContext } from "react";
import { LanguageContext } from "@/components/LanguageProvider";

export function useLanguage() {
  return useContext(LanguageContext);
}
