import { useContext } from "react";
import {
  UiModeContext,
  type UiModeContextValue,
} from "@/context/ui-mode-context-shared";

export function useUiMode(): UiModeContextValue {
  const value = useContext(UiModeContext);

  if (!value) {
    throw new Error("useUiMode must be used within UiModeProvider");
  }

  return value;
}
