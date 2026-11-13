import { describe, expect, test } from "bun:test";
import {
  resolveOwnerEffortModel,
  thinkingEffortForOwnerChat,
} from "./owner-chat-effort";

const groups = [
  {
    models: [
      { id: "gpt-4.1", name: "GPT-4.1", providerId: "openai" },
      { id: "deepseek-flash", name: "DeepSeek Flash", providerId: "deepseek" },
      {
        id: "deepseek-v4-pro",
        name: "DeepSeek V4 Pro",
        providerId: "deepseek",
      },
      { id: "glm-5.3", name: "GLM 5.3", providerId: "zhipu" },
      { id: "glm-5.2", name: "GLM 5.2", providerId: "zhipu" },
    ],
    providerId: "mixed",
    providerLabel: "Mixed",
  },
];

describe("resolveOwnerEffortModel", () => {
  test("picks DeepSeek Flash for low and Pro for medium", () => {
    expect(resolveOwnerEffortModel("low", groups)?.id).toBe("deepseek-flash");
    expect(resolveOwnerEffortModel("medium", groups)?.id).toBe(
      "deepseek-v4-pro"
    );
  });

  test("picks GLM 5.3 for ultra", () => {
    expect(resolveOwnerEffortModel("ultra", groups)?.id).toBe("glm-5.3");
  });
});

describe("thinkingEffortForOwnerChat", () => {
  test("low uses the lowest thinking level", () => {
    expect(thinkingEffortForOwnerChat("low")).toBe("low");
  });

  test("medium and ultra use medium thinking", () => {
    expect(thinkingEffortForOwnerChat("medium")).toBe("medium");
    expect(thinkingEffortForOwnerChat("ultra")).toBe("medium");
  });
});
