import { type ReactNode, useCallback, useMemo, useState } from "react";
import { UiModeContext } from "@/context/ui-mode-context-shared";
import { getInitialUiMode, persistUiMode, type UiMode } from "@/lib/ui-mode";

export function UiModeProvider({ children }: { children: ReactNode }) {
  const [uiMode, setUiModeState] = useState<UiMode>(getInitialUiMode);

  const setUiMode = useCallback((mode: UiMode) => {
    setUiModeState(mode);
    persistUiMode(mode);
  }, []);

  const value = useMemo(() => ({ setUiMode, uiMode }), [setUiMode, uiMode]);

  return (
    <UiModeContext.Provider value={value}>{children}</UiModeContext.Provider>
  );
}
