export type UiMode = "owner" | "advanced";

export const UI_MODE_STORAGE_KEY = "airin-ui-mode";

function isUiMode(value: string | null | undefined): value is UiMode {
  return value === "owner" || value === "advanced";
}

function getStoredUiMode(): UiMode | null {
  try {
    const stored = localStorage.getItem(UI_MODE_STORAGE_KEY);

    return isUiMode(stored) ? stored : null;
  } catch {
    return null;
  }
}

/** Fresh installs open Owner mode for business owners. */
export function getInitialUiMode(): UiMode {
  return getStoredUiMode() ?? "owner";
}

export function persistUiMode(mode: UiMode): void {
  try {
    localStorage.setItem(UI_MODE_STORAGE_KEY, mode);
  } catch {
    // Ignore storage failures (private browsing, etc.)
  }
}
