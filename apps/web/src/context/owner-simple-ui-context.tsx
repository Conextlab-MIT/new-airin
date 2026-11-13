import { createContext, type ReactNode, useContext, useMemo } from "react";
import { useUiMode } from "@/context/use-ui-mode";

const OwnerSimpleUiContext = createContext(false);

export function OwnerSimpleUiProvider({ children }: { children: ReactNode }) {
  const { uiMode } = useUiMode();
  const value = useMemo(() => uiMode === "owner", [uiMode]);

  return (
    <OwnerSimpleUiContext.Provider value={value}>
      {children}
    </OwnerSimpleUiContext.Provider>
  );
}

export function useOwnerSimpleUi(): boolean {
  return useContext(OwnerSimpleUiContext);
}
