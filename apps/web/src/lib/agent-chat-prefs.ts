/** Per-agent chat prefs for Owner mode (mute notifications). */

const MUTED_KEY = "airin-agent-chat-muted";

function readMutedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(MUTED_KEY);

    if (!raw) {
      return new Set();
    }

    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed)
      ? new Set(parsed.filter((id): id is string => typeof id === "string"))
      : new Set();
  } catch {
    return new Set();
  }
}

function writeMutedIds(ids: Set<string>): void {
  try {
    localStorage.setItem(MUTED_KEY, JSON.stringify([...ids]));
  } catch {
    // Ignore storage failures.
  }
}

export function isAgentChatMuted(profileId: string): boolean {
  return readMutedIds().has(profileId);
}

export function setAgentChatMuted(profileId: string, muted: boolean): void {
  const ids = readMutedIds();

  if (muted) {
    ids.add(profileId);
  } else {
    ids.delete(profileId);
  }

  writeMutedIds(ids);
  void syncMutedAgentsToCache();

  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(new Event("airin:agent-chat-mute-changed"));
    } catch {
      // Happy-dom / older browsers may refuse Event construction in tests.
    }
  }
}

export function listMutedAgentChatIds(): string[] {
  return [...readMutedIds()];
}

/** Service worker cannot read localStorage; keep a Cache mirror for push mute. */
export async function syncMutedAgentsToCache(): Promise<void> {
  if (typeof caches === "undefined") {
    return;
  }

  try {
    const cache = await caches.open("airin-agent-mute-v1");
    await cache.put(
      "/muted-agents",
      new Response(JSON.stringify([...readMutedIds()]), {
        headers: { "Content-Type": "application/json" },
      })
    );
  } catch {
    // Offline / private mode: desktop mute still works via localStorage.
  }
}
