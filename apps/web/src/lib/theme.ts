export type Theme = "light" | "dark" | "system";

export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "airin-theme";

function isTheme(value: string | null | undefined): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);

    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    // Business-owner default when there is no window yet.
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === "system") {
    return getSystemTheme();
  }

  return theme;
}

/** Fresh installs open light for business owners. */
export function getInitialTheme(): Theme {
  return getStoredTheme() ?? "light";
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  const resolved = resolveTheme(theme);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
}

/** The app icon is one design in both themes, so the brand mark no longer swaps. */
export function markLogoSrc(_resolvedTheme?: ResolvedTheme): string {
  return "/icons/icon-192-v3.png";
}
