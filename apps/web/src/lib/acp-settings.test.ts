import { describe, expect, test } from "bun:test";
import {
  offeredAcpAgentPresets,
  presetIdForAgent,
  RETIRED_ACP_PRESET_IDS,
} from "./acp-settings";

const presets = [
  {
    agent: { args: ["/app/claude.js"], command: "bun" },
    id: "claude",
    label: "Claude",
  },
  {
    agent: { args: ["/app/codex.js"], command: "bun" },
    id: "codex",
    label: "Codex",
  },
  {
    agent: { args: ["acp"], command: "opencode" },
    id: "opencode",
    label: "OpenCode",
  },
];

describe("offeredAcpAgentPresets", () => {
  test("hides the retired chat engines from the picker", () => {
    expect(offeredAcpAgentPresets(presets)).toEqual([]);
  });

  test("keeps an engine that is not retired", () => {
    const gemini = {
      agent: { args: ["--experimental-acp"], command: "gemini" },
      id: "gemini",
      label: "Gemini",
    };

    expect(offeredAcpAgentPresets([...presets, gemini])).toEqual([gemini]);
  });

  test("retires exactly Claude, Codex and OpenCode", () => {
    expect([...RETIRED_ACP_PRESET_IDS].sort()).toEqual([
      "claude",
      "codex",
      "opencode",
    ]);
  });
});

describe("presetIdForAgent", () => {
  test("finds the preset whose command and args match", () => {
    expect(
      presetIdForAgent({ args: ["/app/codex.js"], command: "bun" }, presets)
    ).toBe("codex");
  });

  test("returns null for the built-in chat and for a custom command", () => {
    expect(presetIdForAgent(null, presets)).toBeNull();
    expect(
      presetIdForAgent({ args: ["--other"], command: "my-agent" }, presets)
    ).toBeNull();
  });
});
