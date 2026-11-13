import { describe, expect, test } from "bun:test";
import type { ToolContext } from "@airin/core";
import type { AgentService } from "../services/agent-service";
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
  } satisfies ToolContext;
}

function agentServiceStub(
  stub: Pick<AgentService, "listProfiles" | "runSendToBotPrompt">
): AgentService {
  // SAFETY: These tests call only listProfiles and runSendToBotPrompt on the stub.
  return stub as AgentService;
}

describe("send_to_bot", () => {
  test("exports a stable tool name", () => {
    expect(SEND_TO_BOT_TOOL_NAME).toBe("send_to_bot");
  });

  test("refuses when depth limit is reached", async () => {
    const result = await runSendToBotTool(
      { bot_name: "Sales", message: "Hi" },
      context({ agentDepth: MAX_SEND_TO_BOT_DEPTH }),
      agentServiceStub({
        listProfiles: async () => ({ profiles: [] }),
        runSendToBotPrompt: async () => {
          throw new Error("should not run");
        },
      })
    );

    expect(result.status).toBe("fail");
  });

  test("refuses an unknown bot name", async () => {
    const result = await runSendToBotTool(
      { bot_name: "Missing", message: "Hi" },
      context(),
      agentServiceStub({
        listProfiles: async () => ({
          profiles: [{ id: "profile_from", name: "Chief of Staff" }],
        }),
        runSendToBotPrompt: async () => {
          throw new Error("should not run");
        },
      })
    );

    expect(result.status).toBe("fail");
  });

  test("calls the target profile and returns from", async () => {
    const result = await runSendToBotTool(
      { bot_name: "Sales", message: "Draft a follow-up" },
      context(),
      agentServiceStub({
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
      })
    );

    expect(result).toMatchObject({
      from: "Sales",
      output: "Here is a draft.",
      status: "ok",
    });
  });
});
