import type { ThinkingEffort } from "@airin/core/contract";
import { encodeModelSelection } from "@/lib/models";

export type OwnerChatEffort = "low" | "medium" | "ultra";

export const OWNER_CHAT_EFFORT_KEY = "airin-owner-chat-effort";

export const OWNER_CHAT_EFFORTS: readonly OwnerChatEffort[] = [
  "low",
  "medium",
  "ultra",
] as const;

export const OWNER_CHAT_EFFORT_LABELS: Record<OwnerChatEffort, string> = {
  low: "Low",
  medium: "Medium",
  ultra: "Ultra",
};

export type OwnerEffortModelRef = {
  id: string;
  name: string;
  providerId?: string;
};

export type OwnerEffortProviderGroup = {
  providerId: string;
  providerLabel: string;
  models: OwnerEffortModelRef[];
};

type FlatModel = {
  id: string;
  name: string;
  providerId: string;
  selection: string;
};

function flattenModels(groups: OwnerEffortProviderGroup[]): FlatModel[] {
  return groups.flatMap((group) =>
    group.models.map((model) => {
      const providerId = model.providerId ?? group.providerId;

      return {
        id: model.id,
        name: model.name,
        providerId,
        selection: encodeModelSelection(providerId, model.id),
      };
    })
  );
}

function scoreMatch(haystack: string, patterns: RegExp[]): number {
  const value = haystack.toLowerCase();

  for (let index = 0; index < patterns.length; index++) {
    if (patterns[index]?.test(value)) {
      return patterns.length - index;
    }
  }

  return 0;
}

function pickBest(models: FlatModel[], patterns: RegExp[]): FlatModel | null {
  let best: FlatModel | null = null;
  let bestScore = 0;

  for (const model of models) {
    const score = Math.max(
      scoreMatch(model.id, patterns),
      scoreMatch(model.name, patterns)
    );

    if (score > bestScore) {
      best = model;
      bestScore = score;
    }
  }

  return best;
}

/** Low → DeepSeek Flash; Medium → DeepSeek Pro/V4; Ultra → GLM 5.3. */
const DEEPSEEK_LOW_PATTERNS = [
  /deepseek-flash/,
  /deepseek-v4-flash/,
  /deepseek-chat/,
  /deepseek/,
];

const DEEPSEEK_MEDIUM_PATTERNS = [
  /deepseek-v4-pro/,
  /deepseek-pro/,
  /deepseek-v4(?!-flash)/,
  /deepseek-reasoner/,
  /deepseek/,
];

const GLM_ULTRA_PATTERNS = [
  /glm-5\.3/,
  /glm-5p3/,
  /glm 5\.3/,
  /glm-5\.2/,
  /glm-5p2/,
  /glm-5/,
  /glm/,
];

export function resolveOwnerEffortModel(
  effort: OwnerChatEffort,
  groups: OwnerEffortProviderGroup[]
): FlatModel | null {
  const models = flattenModels(groups);

  if (models.length === 0) {
    return null;
  }

  if (effort === "ultra") {
    return pickBest(models, GLM_ULTRA_PATTERNS) ?? models[0] ?? null;
  }

  if (effort === "medium") {
    return pickBest(models, DEEPSEEK_MEDIUM_PATTERNS) ?? models[0] ?? null;
  }

  return pickBest(models, DEEPSEEK_LOW_PATTERNS) ?? models[0] ?? null;
}

/**
 * Low ≈ no deep reasoning (lowest level). Medium / Ultra use medium thinking
 * on DeepSeek / GLM respectively.
 */
export function thinkingEffortForOwnerChat(
  effort: OwnerChatEffort
): ThinkingEffort {
  return effort === "low" ? "low" : "medium";
}

export function isOwnerChatEffort(
  value: string | null | undefined
): value is OwnerChatEffort {
  return value === "low" || value === "medium" || value === "ultra";
}

export function getStoredOwnerChatEffort(): OwnerChatEffort {
  try {
    const stored = localStorage.getItem(OWNER_CHAT_EFFORT_KEY);

    return isOwnerChatEffort(stored) ? stored : "medium";
  } catch {
    return "medium";
  }
}

export function persistOwnerChatEffort(effort: OwnerChatEffort): void {
  try {
    localStorage.setItem(OWNER_CHAT_EFFORT_KEY, effort);
  } catch {
    // Ignore storage failures.
  }
}

export function ownerEffortFromSelection(
  selection: string | null | undefined,
  groups: OwnerEffortProviderGroup[]
): OwnerChatEffort | null {
  if (!selection) {
    return null;
  }

  for (const effort of OWNER_CHAT_EFFORTS) {
    const model = resolveOwnerEffortModel(effort, groups);

    if (model?.selection === selection) {
      return effort;
    }
  }

  return null;
}
