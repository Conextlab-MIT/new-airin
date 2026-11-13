export type AppLocale = "id" | "en";

export const APP_LOCALES = ["id", "en"] as const satisfies readonly AppLocale[];

export const DEFAULT_LOCALE: AppLocale = "id";

export const LOCALE_STORAGE_KEY = "airin-locale";

export function isAppLocale(
  value: string | null | undefined
): value is AppLocale {
  return value === "id" || value === "en";
}

function getStoredLocale(): AppLocale | null {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);

    return isAppLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

/** Prefer a saved choice; otherwise Indonesian for this product. */
export function getInitialLocale(): AppLocale {
  return getStoredLocale() ?? DEFAULT_LOCALE;
}

export function persistLocale(locale: AppLocale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Ignore storage failures (private browsing, etc.)
  }
}

export function applyDocumentLocale(locale: AppLocale): void {
  document.documentElement.lang = locale;
}
