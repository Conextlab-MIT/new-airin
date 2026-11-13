import type {
  CreateProfileRequest,
  ToolContext,
  UpdateProfileRequest,
} from "@airin/core";
import { agentGroupInputSchema } from "@airin/core/agent-groups";
import { z } from "zod";

export const SUPPORTED_SOUL_FILE_NAMES = [
  "SOUL.md",
  "STYLE.md",
  "INSTRUCTIONS.md",
  "MEMORY.md",
] as const;

export type SupportedSoulFileName = (typeof SUPPORTED_SOUL_FILE_NAMES)[number];

export const SuperAirinInputSchema = z.record(z.string(), z.json());

/** A period followed by whitespace: where list_tools cuts each description. */
export const SENTENCE_END = /(?<=\.)\s/;

export type SuperAirinInput = z.infer<typeof SuperAirinInputSchema>;

export const SOUL_STACK_FILES = [
  { fileName: "INSTRUCTIONS.md", key: "instructions" },
  { fileName: "MEMORY.md", key: "memory" },
  { fileName: "SOUL.md", key: "soul" },
  { fileName: "STYLE.md", key: "style" },
] as const;

export const soulFilesSchema = z
  .object({
    "INSTRUCTIONS.md": z.string().optional(),
    "MEMORY.md": z.string().optional(),
    "SOUL.md": z.string().optional(),
    "STYLE.md": z.string().optional(),
  })
  .strict();

export const SOUL_FILES_DESCRIPTION =
  "Soul file contents. Supported keys: SOUL.md, STYLE.md, INSTRUCTIONS.md, MEMORY.md. Only provided keys are written.";

export const proposeToolSchema = z
  .object({
    description: z
      .string()
      .trim()
      .min(1)
      .max(2000)
      .describe("What the tool does."),
    name: z.string().trim().min(1).max(128).describe("Unique tool name."),
    plan: z
      .string()
      .trim()
      .min(1)
      .max(8000)
      .describe(
        "User-facing plan: inputs, outputs, external effects, and provider if applicable."
      ),
    profileId: z
      .string()
      .trim()
      .min(1)
      .optional()
      .describe(
        "Optional suggested existing agent. The user can change it in the card."
      ),
    requiresApiKey: z.boolean(),
  })
  .strict();

// Same rules as the HTTP API; the descriptions are for the model only. Strict,
// so a model that invents a key is told so.
export const createGroupSchema = agentGroupInputSchema
  .extend({
    brief: agentGroupInputSchema.shape.brief.describe(
      "What the group is for. Every agent in the group reads it."
    ),
    memberIds: agentGroupInputSchema.shape.memberIds.describe(
      "Profile ids of the agents to add. 2 to 12."
    ),
    name: agentGroupInputSchema.shape.name.describe(
      'Group name in short, readable title case, like "Rosid\'s Brand Team". Never a slug or hyphenated.'
    ),
  })
  .strict();

export const createProfileSchema = z.object({
  isSuper: z
    .boolean()
    .optional()
    .catch(undefined)
    .describe("Whether this profile is a super airin."),
  model: z
    .union([z.string(), z.null()])
    .optional()
    .catch(undefined)
    .describe(
      "Model id from list_models (providerId::modelId). Omit to use your own model."
    ),
  name: z
    .string()
    .trim()
    .min(1)
    .describe(
      "Display name for the profile: a human first name such as Maya or Theo, never a job title. Put the role in the soul files."
    ),
  soulFiles: soulFilesSchema
    .optional()
    .describe(
      "Optional generated soul file contents for the new profile. Supported keys: SOUL.md, STYLE.md, INSTRUCTIONS.md, MEMORY.md."
    ),
  systemPrompt: z
    .string()
    .trim()
    .min(1)
    .optional()
    .catch(undefined)
    .describe("System prompt for the bot."),
});

export const updateProfileSchema = z.object({
  model: z
    .string()
    .trim()
    .min(1)
    .optional()
    .catch(undefined)
    .describe(
      "Model id from list_models (providerId::modelId). Omit to leave unchanged."
    ),
  profileId: z
    .string({ error: "profileId is required." })
    .trim()
    .min(1, "profileId is required.")
    .describe("Profile id to update."),
  soulFiles: soulFilesSchema.optional().describe(SOUL_FILES_DESCRIPTION),
  systemPrompt: z
    .string()
    .optional()
    .catch(undefined)
    .describe(
      "Replacement system prompt stored on the profile. Pass an empty string to clear it. Omit to leave unchanged."
    ),
});

export function requireOrgId(context: ToolContext): string {
  const orgId = context.orgId?.trim();

  if (!orgId) {
    throw new Error("Organization context is required.");
  }

  return orgId;
}

export function readString(input: SuperAirinInput, key: string): string | null {
  const value = z.string().safeParse(input[key]).data;

  return value?.trim() || null;
}

export function readSoulFiles(
  input: SuperAirinInput
):
  | CreateProfileRequest["soulFiles"]
  | UpdateProfileRequest["soulFiles"]
  | undefined {
  const raw = input.soulFiles;

  if (raw === undefined) {
    return;
  }

  return soulFilesSchema.parse(raw);
}
