import {
  type AssignSkillRequest,
  emptyObjectSchema,
  getProfileSoulDir,
  jsonSchemaFromZod,
  type ListSkillsResponse,
  loadSoulStack,
  type ModelsResponse,
  type ProfileResponse,
  parseToolInput,
  type ToolContext,
  type ToolDefinition,
  type UpdateProfileRequest,
} from "@airin/core";
import type { AgentGroup } from "@airin/core/agent-groups";
import { z } from "zod";
import { modelSupportsVision } from "../providers/models";
import type { PluginService } from "../services/plugin-service";
import type { ProfileChangeMeta } from "../services/profile-change-history";
import type { ProfileService } from "../services/profile-service";
import {
  PROFILE_UPDATE_CONFIRMATION_MESSAGE,
  SKILL_ASSIGNMENT_CONFIRMATION_MESSAGE,
  type SuperAirinSessionState,
  TOOL_ASSIGNMENT_CONFIRMATION_MESSAGE,
} from "../services/super-airin-session-state";
import { createSuperAirinCustomTools } from "./super-airin-custom-tools";
import {
  createGroupSchema,
  createProfileSchema,
  readString,
  requireOrgId,
  SENTENCE_END,
  SOUL_STACK_FILES,
  SuperAirinInputSchema,
  type SupportedSoulFileName,
  updateProfileSchema,
} from "./super-airin-tool-shared";

export function createSuperAirinTools(
  profileService: ProfileService,
  sessionState: SuperAirinSessionState,
  resolveInheritedModel?: (
    model: string | null,
    context: ToolContext
  ) => Promise<string | null>,
  getPluginService?: () => PluginService | null,
  services: {
    assignSkill?: (
      orgId: string,
      profileId: string,
      request: AssignSkillRequest,
      meta: ProfileChangeMeta
    ) => Promise<ProfileResponse>;
    createGroup?: (
      orgId: string,
      userId: string,
      name: string,
      memberIds: string[],
      brief: string
    ) => Promise<AgentGroup>;
    getModels?: () => Promise<ModelsResponse>;
    listSkills?: (orgId: string) => Promise<ListSkillsResponse>;
  } = {}
): ToolDefinition[] {
  async function inheritModel(
    orgId: string,
    context: ToolContext
  ): Promise<string | null> {
    if (!context.profileId) {
      return null;
    }

    const source = await profileService.getProfile(orgId, context.profileId);

    return resolveInheritedModel
      ? await resolveInheritedModel(source.profile.model, context)
      : source.profile.model;
  }

  return [
    {
      description:
        "Show the plugin draft card in chat after plugin-drafts/<draftId> builds. The card tracks review, install, enable, and profile access for the admin. Call once per finished draft, then end the turn.",
      name: "submit_plugin_draft",
      parameters: {
        additionalProperties: false,
        properties: {
          draftId: {
            description: "Folder name under plugin-drafts/.",
            type: "string",
          },
        },
        required: ["draftId"],
        type: "object",
      },
      async run(input, context) {
        const orgId = requireOrgId(context);
        const profileId = context.profileId?.trim();
        const plugins = getPluginService?.();

        if (!profileId) {
          throw new Error("A profile is required to submit a plugin draft.");
        }

        if (!plugins) {
          throw new Error("Plugins are not available on this server.");
        }

        const { draftId } = z
          .object({ draftId: z.string().regex(/^[A-Za-z0-9_-]{1,128}$/) })
          .strict()
          .parse(input);

        const draft = { draftId, orgId, profileId };
        const preview = await plugins.describeLocalPlugin(draft);

        return {
          ...draft,
          actions: preview.contributions.actionKeys,
          digest: preview.digest,
          fileCount: preview.fileCount,
          name: preview.manifest.name,
          pluginId: preview.manifest.id,
          type: "plugin_draft_ready",
          version: preview.manifest.version,
        };
      },
    },
    {
      description:
        "List all bot profiles with their id, name, and tool counts. Use when managing profiles or when the user asks you to assign a tool and you need profile ids.",
      name: "list_profiles",
      parameters: emptyObjectSchema(),
      async run(_input, context: ToolContext) {
        return profileService.listProfiles(requireOrgId(context));
      },
    },
    {
      description:
        "Get a bot profile by id, including assigned tools and current soul file contents.",
      name: "get_profile",
      parameters: {
        additionalProperties: false,
        properties: {
          profileId: { description: "Profile id to fetch.", type: "string" },
        },
        required: ["profileId"],
        type: "object",
      },
      async run(input, context: ToolContext) {
        const toolInput = SuperAirinInputSchema.parse(input);
        const orgId = requireOrgId(context);
        const profileId = readString(toolInput, "profileId");

        if (!profileId) {
          throw new Error("profileId is required.");
        }

        const response = await profileService.getProfile(orgId, profileId);
        const stack = await loadSoulStack(getProfileSoulDir(orgId, profileId));
        const soulFiles: Partial<Record<SupportedSoulFileName, string>> = {};

        for (const { fileName, key } of SOUL_STACK_FILES) {
          const content = stack.files[key];

          if (content) {
            soulFiles[fileName] = content;
          }
        }

        return { ...response, soulFiles };
      },
    },
    {
      description: "Create a new bot profile.",
      name: "create_profile",
      parameters: jsonSchemaFromZod(createProfileSchema),
      async run(input, context: ToolContext) {
        const {
          isSuper,
          model: requestedModel,
          name,
          soulFiles,
          systemPrompt,
        } = createProfileSchema.parse(input);

        const orgId = requireOrgId(context);
        let model = requestedModel;

        if (model === undefined && context.profileId) {
          model = await inheritModel(orgId, context);
        }

        const result = await profileService.createProfile(orgId, {
          isSuper: isSuper ?? false,
          model,
          name,
          soulFiles,
          systemPrompt,
        });

        return {
          ...result,
          type: "profile_created" as const,
        };
      },
    },
    {
      description:
        "Create a group chat where the user talks with several agents at once. Get the member ids from list_profiles. Confirm the name, members, and brief with the user before calling this. The brief is shared with every agent in the group as context.",
      name: "create_group",
      parameters: jsonSchemaFromZod(createGroupSchema),
      async run(input, context: ToolContext) {
        const orgId = requireOrgId(context);
        const userId = context.userId?.trim();

        if (!(userId && services.createGroup)) {
          throw new Error("Creating groups needs a signed-in user.");
        }

        const parsed = createGroupSchema.parse(input);

        const group = await services.createGroup(
          orgId,
          userId,
          parsed.name,
          parsed.memberIds,
          parsed.brief
        );

        return { group, type: "group_created" as const };
      },
    },
    {
      description:
        "Update a profile's stored system prompt, soul files, and/or model. Draft changes in chat, wait for explicit user confirmation, then call this. Use get_profile first when you need the current prompt or soul files.",
      name: "update_profile",
      parameters: jsonSchemaFromZod(updateProfileSchema),
      async run(input, context: ToolContext) {
        const { profileId, systemPrompt, soulFiles, model } = parseToolInput(
          updateProfileSchema,
          input
        );

        if (systemPrompt === undefined && soulFiles === undefined && !model) {
          throw new Error("Provide systemPrompt, soulFiles, and/or model.");
        }

        if (!sessionState.canUpdateProfile(context.sessionId)) {
          throw new Error(PROFILE_UPDATE_CONFIRMATION_MESSAGE);
        }

        const request: UpdateProfileRequest = {};

        if (systemPrompt !== undefined) {
          request.systemPrompt = systemPrompt;
        }

        if (soulFiles !== undefined) {
          request.soulFiles = soulFiles;
        }

        if (model) {
          request.model = model;
        }

        return profileService.updateProfile(
          requireOrgId(context),
          profileId,
          request,
          {
            actorUserId: context.userId ?? null,
            source: "super_airin",
          }
        );
      },
    },
    {
      description:
        "Assign an existing tool to a profile. Use only when the user explicitly asks to assign a tool to a profile.",
      name: "assign_tool_to_profile",
      parameters: {
        additionalProperties: false,
        properties: {
          profileId: { description: "Target profile id.", type: "string" },
          toolId: { description: "Tool id to assign.", type: "string" },
        },
        required: ["profileId", "toolId"],
        type: "object",
      },
      async run(input, context: ToolContext) {
        const toolInput = SuperAirinInputSchema.parse(input);
        const profileId = readString(toolInput, "profileId");
        const toolId = readString(toolInput, "toolId");

        if (!(profileId && toolId)) {
          throw new Error("profileId and toolId are required.");
        }

        if (!sessionState.canAssignTool(context.sessionId, toolId)) {
          throw new Error(TOOL_ASSIGNMENT_CONFIRMATION_MESSAGE);
        }

        const result = await profileService.assignTool(
          requireOrgId(context),
          profileId,
          {
            toolId,
          },
          {
            actorUserId: context.userId ?? null,
            source: "super_airin",
          }
        );

        sessionState.markToolAssigned(context.sessionId, toolId);

        return result;
      },
    },
    {
      description:
        "Assign an existing skill to a profile, including a skill from an installed plugin. Use after the user approves the plan.",
      name: "assign_skill_to_profile",
      parameters: {
        additionalProperties: false,
        properties: {
          profileId: { description: "Target profile id.", type: "string" },
          skill: {
            description:
              "Skill id or skill name. A plugin skill's name is its manifest key.",
            type: "string",
          },
        },
        required: ["profileId", "skill"],
        type: "object",
      },
      async run(input, context: ToolContext) {
        const toolInput = SuperAirinInputSchema.parse(input);
        const profileId = readString(toolInput, "profileId");
        const skill = readString(toolInput, "skill");

        if (!(profileId && skill)) {
          throw new Error("profileId and skill are required.");
        }

        if (!sessionState.canUpdateProfile(context.sessionId)) {
          throw new Error(SKILL_ASSIGNMENT_CONFIRMATION_MESSAGE);
        }

        if (!services.listSkills) {
          throw new Error("Skills are not available on this server.");
        }

        const orgId = requireOrgId(context);
        const listed = await services.listSkills(orgId);

        const candidates = [
          ...listed.skills,
          ...(listed.publishedSkills ?? []),
        ];

        const byId = candidates.find((item) => item.id === skill);

        const matches = byId
          ? [byId]
          : candidates.filter((item) => item.name === skill);

        const [match] = matches;

        if (!match) {
          throw new Error(`Skill "${skill}" was not found.`);
        }

        if (matches.length > 1) {
          throw new Error(
            `More than one skill is named "${skill}". Pass one of these ids: ${matches.map((item) => item.id).join(", ")}.`
          );
        }

        const assign =
          services.assignSkill ??
          profileService.assignSkill.bind(profileService);

        return assign(
          orgId,
          profileId,
          { skillId: match.id },
          {
            actorUserId: context.userId ?? null,
            source: "super_airin",
          }
        );
      },
    },
    {
      description:
        "List configured providers and their models. Each model id is the value create_profile accepts as model. supportsVision tells which models can read images.",
      name: "list_models",
      parameters: emptyObjectSchema(),
      async run(_input, context: ToolContext) {
        if (!services.getModels) {
          throw new Error("Models are not available on this server.");
        }

        const response = await services.getModels();
        const orgId = context.orgId?.trim();

        return {
          defaultProviderId: response.currentProviderId,
          inheritedModel: orgId ? await inheritModel(orgId, context) : null,
          providers: response.providers.map((provider) => ({
            default: provider.id === response.currentProviderId,
            id: provider.id,
            label: provider.label,
            models: response.models
              .filter((model) => model.providerId === provider.id)
              .map((model) => ({
                default: model.default === true,
                id: `${provider.id}::${model.id}`,
                name: model.name,
                supportsVision:
                  modelSupportsVision(
                    model.id,
                    provider.type,
                    provider.customModels
                  ) ??
                  model.supportsVision ??
                  null,
              })),
            type: provider.type,
          })),
        };
      },
    },
    {
      description: "List all registered tools.",
      name: "list_tools",
      parameters: emptyObjectSchema(),
      async run(_input, context) {
        const orgId = context.orgId?.trim();

        if (!orgId) {
          return { tools: [] };
        }

        const { tools } = await profileService.listTools(orgId);

        // This result stays in context for every later call of the turn, so
        // keep only what reuse and assignment need.
        return {
          tools: tools.map((tool) => ({
            description: tool.description.split(SENTENCE_END)[0],
            handlerType: tool.handlerType,
            id: tool.id,
            name: tool.name,
          })),
        };
      },
    },
    ...createSuperAirinCustomTools(profileService, sessionState),
  ];
}
