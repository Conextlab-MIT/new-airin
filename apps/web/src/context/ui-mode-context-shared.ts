import { createContext } from "react";
import type { UiMode } from "@/lib/ui-mode";

export interface UiModeContextValue {
  setUiMode: (mode: UiMode) => void;
  uiMode: UiMode;
}

export const UiModeContext = createContext<UiModeContextValue | null>(null);
