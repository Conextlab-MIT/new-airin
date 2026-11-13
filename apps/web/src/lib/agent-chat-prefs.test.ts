import { afterEach, describe, expect, test } from "bun:test";
import {
  isAgentChatMuted,
  listMutedAgentChatIds,
  setAgentChatMuted,
} from "./agent-chat-prefs";

function installMemoryStorage() {
  const store = new Map<string, string>();

  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      removeItem: (key: string) => {
        store.delete(key);
      },
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    },
  });

  return () => {
    Reflect.deleteProperty(globalThis, "localStorage");
  };
}

afterEach(() => {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("airin-agent-chat-muted");
  }
});

describe("agent chat mute prefs", () => {
  test("mutes and unmutes a profile", () => {
    const restore = installMemoryStorage();

    try {
      expect(isAgentChatMuted("a1")).toBe(false);
      setAgentChatMuted("a1", true);
      expect(isAgentChatMuted("a1")).toBe(true);
      expect(listMutedAgentChatIds()).toEqual(["a1"]);
      setAgentChatMuted("a1", false);
      expect(isAgentChatMuted("a1")).toBe(false);
    } finally {
      restore();
    }
  });
});
