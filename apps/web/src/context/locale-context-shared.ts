import { createContext } from "react";
import type { AppLocale } from "@/lib/locale";

export interface LocaleContextValue {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  t: (
    key: import("@/lib/i18n").MessageKey,
    vars?: Record<string, string | number>
  ) => string;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);
