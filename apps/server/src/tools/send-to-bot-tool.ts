import type { ToolContext, ToolDefinition } from "@airin/core";
import { z } from "zod";
import type { AgentService } from "../services/agent-service";
import {
  DEFAULT_SUB_AGENT_TIMEOUT_MS,
  failSubAgentResult,
  MAX_SUB_AGENT_TIMEOUT_MS,
  type SubAgentRunResult,
} from "./sub-agent-shared";

export type SendToBotToolResult =
  | SubAgentRunResult
  | {
      error?: string;
      from: string;
      output: string;
      status: "error" | "ok";
      summary: string;
    };

export const SEND_TO_BOT_TOOL_NAME = "send_to_bot";

/** Bot HQ-style ping-pong cap across agent-to-agent hops. */
export const MAX_SEND_TO_BOT_DEPTH = 3;

const SendToBotInputSchema = z.object({
  bot_name: z.string().optional().catch(undefined),
  message: z.string().optional().catch(undefined),
  timeoutMs: z.number().optional().catch(undefined),
});

export function createSendToBotTool(
  agentService: AgentService
): ToolDefinition {
  return {
    description:
      "Send a message to another agent in this organization by name and wait for their reply. Use when another teammate should handle the work. Depth is capped to stop agent ping-pong.",
    name: SEND_TO_BOT_TOOL_NAME,
    parallelSafe: false,
    parameters: {
      additionalProperties: false,
      properties: {
        bot_name: {
          description: "Exact or case-insensitive name of the target agent.",
          type: "string",
        },
        message: {
          description: "What the other agent should do or answer.",
          type: "string",
        },
        timeoutMs: {
          description:
            "Timeout in milliseconds. Defaults to 300000 (5 minutes).",
          type: "number",
        },
      },
      required: ["bot_name", "message"],
      type: "object",
    },
    async run(input, context) {
      return runSendToBotTool(
        SendToBotInputSchema.parse(input),
        context,
        agentService
      );
    },
  };
}

export async function runSendToBotTool(
  input: z.infer<typeof SendToBotInputSchema>,
  context: ToolContext,
  agentService: AgentService
): Promise<SendToBotToolResult> {
  const depth = context.agentDepth ?? 0;

  if (!Number.isInteger(depth) || depth < 0) {
    return failSubAgentResult("agentDepth must be a non-negative integer.");
  }

  if (depth >= MAX_SEND_TO_BOT_DEPTH) {
    return failSubAgentResult(
      `send_to_bot depth limit (${MAX_SEND_TO_BOT_DEPTH}) reached.`
    );
  }

  const orgId = context.orgId?.trim();
  const fromProfileId = context.profileId?.trim();

  if (!(orgId && fromProfileId)) {
    return failSubAgentResult("orgId and profileId are required.");
  }

  const botName = input.bot_name?.trim();
  const message = input.message?.trim();

  if (!(botName && message)) {
    return failSubAgentResult("bot_name and message are required.");
  }

  const { profiles } = await agentService.listProfiles(orgId);

  const target = profiles.find(
    (profile) => profile.name.trim().toLowerCase() === botName.toLowerCase()
  );

  if (!target) {
    return failSubAgentResult(
      `No agent named "${botName}" in this organization.`
    );
  }

  if (target.id === fromProfileId) {
    return failSubAgentResult("Cannot send_to_bot to yourself.");
  }

  const timeoutMs = clampTimeout(input.timeoutMs ?? null);

  const fromName =
    profiles.find((profile) => profile.id === fromProfileId)?.name ??
    "another agent";

  const task = [
    `Message from teammate "${fromName}" via send_to_bot:`,
    message,
    "",
    "Reply with the answer for that teammate to use. Do not call send_to_bot unless another specialist is clearly needed.",
  ].join("\n");

  try {
    const result = await agentService.runSendToBotPrompt({
      agentDepth: depth + 1,
      clientOrigin: context.clientOrigin,
      orgId,
      orgRole: context.orgRole,
      profileId: target.id,
      sessionId: context.sessionId,
      task,
      timeoutMs,
      userId: context.userId,
    });

    if (result.error) {
      return {
        ...result,
        from: target.name,
        status: "error",
      };
    }

    return {
      from: target.name,
      output: result.output,
      status: "ok",
      summary: result.summary,
    };
  } catch (error) {
    return failSubAgentResult(
      error instanceof Error ? error.message : String(error)
    );
  }
}

function clampTimeout(value: number | null): number {
  if (value === null || !Number.isFinite(value)) {
    return DEFAULT_SUB_AGENT_TIMEOUT_MS;
  }

  return Math.min(Math.max(Math.floor(value), 1000), MAX_SUB_AGENT_TIMEOUT_MS);
}
