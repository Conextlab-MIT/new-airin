import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useAuth } from "@/context/use-auth";
import {
  getInitialOwnerSidebarHidden,
  getInitialSidebarCollapsed,
  OWNER_SIDEBAR_HIDDEN_KEY,
  pinnedPluginsStorageKey,
  readPinnedPluginIds,
  SIDEBAR_COLLAPSED_KEY,
  subscribePinnedPlugins,
  togglePinnedPlugin,
} from "@/lib/sidebar";

export function useLocalStorageFlag(key: string, getInitial: () => boolean) {
  const [collapsed, setCollapsed] = useState(getInitial);

  useEffect(() => {
    try {
      localStorage.setItem(key, String(collapsed));
    } catch {
      // Ignore storage failures (private browsing, etc.)
    }
  }, [collapsed, key]);

  const toggle = useCallback(() => setCollapsed((current) => !current), []);

  return { collapsed, toggle };
}

/** With `shortcut`, Ctrl+B / Cmd+B toggles the sidebar. */
export function useSidebarCollapsed({ shortcut = false } = {}) {
  const flag = useLocalStorageFlag(
    SIDEBAR_COLLAPSED_KEY,
    getInitialSidebarCollapsed
  );

  const { toggle } = flag;

  useEffect(() => {
    if (!shortcut) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== "b" ||
        !(event.metaKey || event.ctrlKey) ||
        event.altKey ||
        event.shiftKey
      ) {
        return;
      }

      event.preventDefault();
      toggle();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcut, toggle]);

  return flag;
}

/** Hides the Owner team sidebar below `lg` (tablet and phone). */
export function useOwnerSidebarHidden() {
  return useLocalStorageFlag(
    OWNER_SIDEBAR_HIDDEN_KEY,
    getInitialOwnerSidebarHidden
  );
}

export function usePinnedPlugins() {
  const { user, activeOrg } = useAuth();

  const key =
    user && activeOrg ? pinnedPluginsStorageKey(user.id, activeOrg.id) : null;

  // The snapshot is a string so it stays equal between renders.
  const pinned = useSyncExternalStore(subscribePinnedPlugins, () =>
    readPinnedPluginIds(key).join("\n")
  );

  return {
    pinned: pinned ? pinned.split("\n") : [],
    toggle: (pluginId: string) => {
      if (key) {
        togglePinnedPlugin(key, pluginId);
      }
    },
  };
}
