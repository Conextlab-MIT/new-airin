import { describe, expect, test } from "bun:test";
import { resolveProfileSwitch } from "./profile-switch";

function pick(pathname: string, search = "", activeProfileId = "alpha") {
  return resolveProfileSwitch({
    activeProfileId,
    pathname,
    profileId: "beta",
    search,
  });
}

describe("resolveProfileSwitch", () => {
  test("an open session is replaced by a fresh chat for the picked agent", () => {
    expect(pick("/chat/alpha/session-1")).toEqual({
      kind: "navigate",
      replace: true,
      to: "/chat?new=1&profile=beta",
    });
  });

  test("a draft chat swaps to a fresh chat for the picked agent", () => {
    expect(pick("/chat")).toEqual({
      kind: "navigate",
      replace: true,
      to: "/chat?new=1&profile=beta",
    });
  });

  test("the agent already on screen stays put", () => {
    for (const pathname of ["/chat", "/chat/beta/session-1", "/files"]) {
      expect(pick(pathname, "", "beta")).toEqual({ kind: "stay" });
    }

    expect(pick("/profiles", "?profile=beta", "beta")).toEqual({
      kind: "stay",
    });
  });

  test("on Profiles, a blocked deep link is left for the picked agent", () => {
    expect(pick("/profiles", "?profile=hidden", "beta")).toEqual({
      kind: "navigate",
      replace: true,
      to: "/profiles?profile=beta",
    });
  });

  test("the active agent picked outside chat still opens its chat", () => {
    expect(pick("/settings", "", "beta")).toEqual({
      kind: "navigate",
      replace: false,
      to: "/chat?new=1&profile=beta",
    });
  });

  test("Files still swaps the agent in place", () => {
    expect(pick("/files")).toEqual({ kind: "select" });
  });
});
