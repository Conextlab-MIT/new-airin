import {
  getCustomToolsDir,
  jsonSchemaFromZod,
  type ToolContext,
  type ToolDefinition,
} from "@airin/core";
import { z } from "zod";
import {
  CUSTOM_TOOL_HANDLERS,
  customToolTypesLabel,
  isCustomToolType,
} from "../services/custom-tool-handlers";
import {
  completeToolSetup,
  loadToolSetup,
  saveToolSetup,
} from "../services/custom-tool-shared";
import type { ProfileService } from "../services/profile-service";
import type { SuperAirinSessionState } from "../services/super-airin-session-state";
import {
  proposeToolSchema,
  readString,
  requireOrgId,
  SuperAirinInputSchema,
} from "./super-airin-tool-shared";

export function createSuperAirinCustomTools(
  profileService: ProfileService,
  sessionState: SuperAirinSessionState
): ToolDefinition[] {
  return [
    {
      description:
        "Present a custom tool build plan for one-click approval, optional API key, and agent assignment. Call before writing code, then end the turn. Never accept API keys in tool inputs or chat. After approval, build and register with create_tool using the returned setupId. Works for any JavaScript or Python tool.",
      name: "propose_tool",
      parameters: jsonSchemaFromZod(proposeToolSchema),
      async run(input, context) {
        const orgId = requireOrgId(context);

        if (!context.sessionId) {
          throw new Error("A chat session is required to propose a tool.");
        }

        const parsed = proposeToolSchema.parse(input);

        if (parsed.profileId) {
          await profileService.getProfile(orgId, parsed.profileId);
        }

        const plan = {
          ...parsed,
          createdAt: new Date().toISOString(),
          id: crypto.randomUUID(),
          sessionId: context.sessionId,
          status: "pending" as const,
        };

        await saveToolSetup(orgId, plan);

        return { orgId, setupId: plan.id, type: "tool_setup_required" };
      },
    },
    {
      description:
        "Register an existing JavaScript or Python module. For a setup card, pass setupId after approval; registration connects its saved key and assigns the selected agent automatically. Registration does not execute or test the tool.",
      name: "create_tool",
      parameters: {
        additionalProperties: false,
        properties: {
          description: { description: "What the tool does.", type: "string" },
          handlerConfig: {
            additionalProperties: true,
            description: `Write the module with write_file using an absolute path under ${getCustomToolsDir("{orgId}")} (substitute your organization id; a missing-module error from this tool states the exact path) before registering. modulePath: filename relative to that directory, ending in .js or .py. JavaScript (preferred): export async function run(input, context). Python: def run(input, context) plus a __main__ harness reading JSON from sys.stdin and writing JSON to sys.stdout. parameters: input JSON schema with properties and required fields; exported JS parameters are ignored. Validate inputs; return JSON-serializable results; log only to stderr. Profile files: context.workspaceRoot (JS) or AIRIN_WORKSPACE_ROOT (Python). requiresApiKey: true only if needed; read AIRIN_TOOL_API_KEY at runtime, never put keys in inputs/source/output. env: for other settings (base URL, account id, extra keys), list [{ name: "UPPER_SNAKE_CASE", secret: true|false }] and read process.env[name] (JS) or os.environ[name] (Python); names may not start with AIRIN_, NODE_, PYTHON, LD_ or be PATH/HOME. An admin fills env values in the tool playground Configuration card. Direct users to the web chat Configure card, then retry.`,
            type: "object",
          },
          handlerType: {
            description: 'Handler type: "javascript" (default) or "python".',
            type: "string",
          },
          name: { description: "Unique tool name.", type: "string" },
          setupId: {
            description:
              "Approved setup id from propose_tool. Never put an API key here.",
            type: "string",
          },
        },
        required: ["name", "description"],
        type: "object",
      },
      async run(input, context: ToolContext) {
        const toolInput = SuperAirinInputSchema.parse(input);
        const setupId = readString(toolInput, "setupId");

        const setup = setupId
          ? await loadToolSetup(requireOrgId(context), setupId)
          : null;

        if (
          setup &&
          (setup.sessionId !== context.sessionId || setup.status === "pending")
        ) {
          throw new Error(
            "Approve this tool's setup card in the original chat before building it."
          );
        }

        if (setup?.status === "ready") {
          return {
            assignedProfileId: setup.profileId ?? null,
            toolId: setup.toolId,
            type: "tool_setup_ready",
          };
        }

        const name = setup?.name ?? readString(toolInput, "name");

        const description =
          setup?.description ?? readString(toolInput, "description");

        if (!(name && description)) {
          throw new Error("name and description are required.");
        }

        const requestedHandlerType = readString(toolInput, "handlerType");
        const handlerType = requestedHandlerType ?? "javascript";

        if (!isCustomToolType(handlerType)) {
          throw new Error(
            `Airin can only create ${customToolTypesLabel()} tools. Use handlerType ${customToolTypesLabel()}.`
          );
        }

        const handler = CUSTOM_TOOL_HANDLERS[handlerType];
        const rawHandlerConfig = toolInput.handlerConfig;

        const parsedHandlerConfig = z
          .record(z.string(), z.json())
          .safeParse(rawHandlerConfig);

        const handlerConfig = parsedHandlerConfig.success
          ? { ...parsedHandlerConfig.data }
          : {};

        if (setup) {
          handlerConfig.requiresApiKey = setup.requiresApiKey;
        }

        const modulePath = readString(handlerConfig, "modulePath");

        if (!modulePath?.endsWith(handler.extension)) {
          throw new Error(
            `${handlerType} tools require handlerConfig.modulePath ending in "${handler.extension}". Write the module with write_file to ${getCustomToolsDir(requireOrgId(context))} first.`
          );
        }

        await handler.validateModule(modulePath, requireOrgId(context));

        const tool = setup?.toolId
          ? (await profileService.getTool(setup.toolId, requireOrgId(context)))
              .tool
          : await profileService.createTool(
              { description, handlerConfig, handlerType, name },
              requireOrgId(context)
            );

        sessionState.markToolCreated(context.sessionId, tool.id);

        if (setup) {
          const orgId = requireOrgId(context);
          await saveToolSetup(orgId, { ...setup, toolId: tool.id });

          if (setup.profileId) {
            await profileService.assignTool(
              orgId,
              setup.profileId,
              { toolId: tool.id },
              {
                actorUserId: context.userId ?? null,
                source: "super_airin",
              }
            );
          }

          await completeToolSetup(orgId, setup, tool.id);

          // Null says "assigned to no agent" outright. A missing key sent the
          // agent off to list_profiles and get_profile to find out.
          return {
            assignedProfileId: setup.profileId ?? null,
            tool,
            toolId: tool.id,
            type: "tool_setup_ready",
          };
        }

        const storedHandlerConfig = z
          .record(z.string(), z.json())
          .safeParse(tool.handlerConfig);

        if (
          z
            .boolean()
            .safeParse(
              storedHandlerConfig.success
                ? storedHandlerConfig.data.requiresApiKey
                : undefined
            ).data === true
        ) {
          return {
            orgId: requireOrgId(context),
            tool,
            toolId: tool.id,
            toolName: tool.name,
            type: "tool_credentials_required",
          };
        }

        return { tool };
      },
    },
  ];
}
