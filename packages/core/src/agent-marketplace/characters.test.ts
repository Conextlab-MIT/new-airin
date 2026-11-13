import { describe, expect, test } from "bun:test";
import {
  AGENT_CHARACTER_IDS,
  agentCharacterPublicPath,
  resolveAgentCharacterId,
} from "./characters";

describe("agent characters", () => {
  test("ships twenty-three portrait ids", () => {
    expect(AGENT_CHARACTER_IDS).toHaveLength(23);
  });

  test("maps marketplace agents to fixed portraits", () => {
    expect(resolveAgentCharacterId({ marketplaceId: "chief-of-staff" })).toBe(
      "jovan"
    );
    expect(resolveAgentCharacterId({ name: "Sales" })).toBe("fajar");
    expect(resolveAgentCharacterId({ name: "Fajar" })).toBe("fajar");
    expect(resolveAgentCharacterId({ name: "Kezia" })).toBe("kezia");
    expect(agentCharacterPublicPath("jovan")).toBe("/characters/jovan.png");
  });

  test("picks a stable portrait for other profile ids", () => {
    const first = resolveAgentCharacterId({ profileId: "profile_abc" });
    const second = resolveAgentCharacterId({ profileId: "profile_abc" });

    expect(first).toBe(second);
    expect(AGENT_CHARACTER_IDS).toContain(first);
  });
});
