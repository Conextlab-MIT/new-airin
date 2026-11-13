import { describe, expect, test } from "bun:test";
import type { ToolContext } from "@airin/core";
import {
  MAX_SEND_TO_BOT_DEPTH,
  runSendToBotTool,
  SEND_TO_BOT_TOOL_NAME,
} from "./send-to-bot-tool";

function context(partial: Partial<ToolContext> = {}): ToolContext {
  return {
    agentDepth: 0,
    orgId: "org_1",
    profileId: "profile_from",
    ...partial,
  } as ToolContext;
}

describe("send_to_bot", () => {
  test("exports a stable tool name", () => {
    expect(SEND_TO_BOT_TOOL_NAME).toBe("send_to_bot");
  });

  test("refuses when depth limit is reached", async () => {
    const result = await runSendToBotTool(
      { bot_name: "Sales", message: "Hi" },
      context({ agentDepth: MAX_SEND_TO_BOT_DEPTH }),
      {
        listProfiles: async () => ({ profiles: [] }),
        runSendToBotPrompt: async () => {
          throw new Error("should not run");
        },
      } as never
    );

    expect(result.error).toContain("depth limit");
  });

  test("refuses an unknown bot name", async () => {
    const result = await runSendToBotTool(
      { bot_name: "Missing", message: "Hi" },
      context(),
      {
        listProfiles: async () => ({
          profiles: [{ id: "profile_from", name: "Chief of Staff" }],
        }),
        runSendToBotPrompt: async () => {
          throw new Error("should not run");
        },
      } as never
    );

    expect(result.error).toContain("No agent named");
  });

  test("calls the target profile and returns from", async () => {
    const result = await runSendToBotTool(
      { bot_name: "Sales", message: "Draft a follow-up" },
      context(),
      {
        listProfiles: async () => ({
          profiles: [
            { id: "profile_from", name: "Chief of Staff" },
            { id: "profile_sales", name: "Sales" },
          ],
        }),
        runSendToBotPrompt: async (input: { profileId: string }) => {
          expect(input.profileId).toBe("profile_sales");

          return {
            output: "Here is a draft.",
            status: "success",
            summary: "Draft ready",
          };
        },
      } as never
    );

    expect(result).toMatchObject({
      from: "Sales",
      output: "Here is a draft.",
      status: "ok",
    });
  });
});
