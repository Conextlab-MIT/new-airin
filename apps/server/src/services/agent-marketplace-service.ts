import {
  type AgentMarketplaceEntry,
  AirinApiError,
  getAgentMarketplaceEntry,
  listAgentMarketplaceCatalog,
  MARKETPLACE_LEGACY_NAME_TO_PERSON,
} from "@airin/core";
import type { ProfileResponse } from "@airin/core/contract";
import type { ProfileService } from "./profile-service";

export interface AgentMarketplaceListItem {
  category: string;
  characterId: string;
  composioApps: string[];
  description: string;
  id: string;
  installed: boolean;
  name: string;
}

export interface AgentMarketplaceListResponse {
  agents: AgentMarketplaceListItem[];
}

export interface AgentMarketplaceInstallResponse {
  profile: ProfileResponse;
}

function marketplaceNameKey(name: string): string {
  return name.trim().toLowerCase();
}

/** Current catalog name plus older role titles for the same agent. */
function installedNameKeysForEntry(entry: AgentMarketplaceEntry): Set<string> {
  const keys = new Set<string>([marketplaceNameKey(entry.name)]);

  for (const [legacy, person] of Object.entries(
    MARKETPLACE_LEGACY_NAME_TO_PERSON
  )) {
    if (marketplaceNameKey(person) === marketplaceNameKey(entry.name)) {
      keys.add(legacy);
    }
  }

  return keys;
}

export class AgentMarketplaceService {
  constructor(private readonly profiles: ProfileService) {}

  async list(orgId: string): Promise<AgentMarketplaceListResponse> {
    await this.renameLegacyMarketplaceProfiles(orgId);
    const existing = await this.profiles.listProfiles(orgId);

    const installedNames = new Set(
      existing.profiles.map((profile) => marketplaceNameKey(profile.name))
    );

    return {
      agents: listAgentMarketplaceCatalog().map((entry) =>
        toListItem(
          entry,
          [...installedNameKeysForEntry(entry)].some((key) =>
            installedNames.has(key)
          )
        )
      ),
    };
  }

  /** Role titles from earlier catalog seeds → person names matching portraits. */
  async renameLegacyMarketplaceProfiles(orgId: string): Promise<void> {
    const existing = await this.profiles.listProfiles(orgId);

    for (const profile of existing.profiles) {
      const next =
        MARKETPLACE_LEGACY_NAME_TO_PERSON[marketplaceNameKey(profile.name)];

      if (!next || next === profile.name) {
        continue;
      }

      try {
        await this.profiles.updateProfile(orgId, profile.id, { name: next });
      } catch {
        // Skip locked / shared instances; the owner can rename in settings.
      }
    }
  }

  async install(
    orgId: string,
    catalogId: string,
    owner?: { ownerUserId: string; sharedWithTeam: boolean }
  ): Promise<AgentMarketplaceInstallResponse> {
    const entry = getAgentMarketplaceEntry(catalogId);

    if (!entry) {
      throw new AirinApiError("Marketplace agent not found.", 404);
    }

    const existing = await this.profiles.listProfiles(orgId);
    const installedKeys = installedNameKeysForEntry(entry);

    const already = existing.profiles.find((profile) =>
      installedKeys.has(marketplaceNameKey(profile.name))
    );

    if (already) {
      throw new AirinApiError(
        "This marketplace agent is already installed.",
        409
      );
    }

    const profile = await this.profiles.createProfile(
      orgId,
      {
        name: entry.name,
        soulFiles: {
          "INSTRUCTIONS.md": entry.instructions,
          "SOUL.md": entry.soul,
          "STYLE.md": entry.style,
        },
        systemPrompt: entry.systemPrompt,
      },
      owner
    );

    return { profile };
  }
}

function toListItem(
  entry: AgentMarketplaceEntry,
  installed: boolean
): AgentMarketplaceListItem {
  return {
    category: entry.category,
    characterId: entry.characterId,
    composioApps: [...entry.composioApps],
    description: entry.description,
    id: entry.id,
    installed,
    name: entry.name,
  };
}
