import { copyFile, mkdir, readFile } from "node:fs/promises";
import {
  type AgentMarketplaceEntry,
  AirinApiError,
  listLaundryInnovationSummitCatalog,
} from "@airin/core";
import type { ProfileResponse } from "@airin/core/contract";
import {
  LAUNDRY_DEMO_TOOL_TEMPLATES,
  LAUNDRY_INNOVATION_SUMMIT_PACK_ID,
  type LaundryDemoToolTemplateId,
  laundryDemoToolTemplatePath,
} from "@airin/core/laundry-demo";
import { getCustomToolsDir } from "@airin/core/tools/paths";
import type { DatabaseAdapter } from "@airin/db";
import type { ProfileService } from "./profile-service";

export interface LaundryPackInstallResponse {
  packId: string;
  profiles: ProfileResponse[];
  seededTools: { id: string; name: string }[];
  skippedAgents: { catalogId: string; reason: string }[];
}

export class LaundryPackService {
  constructor(
    private readonly profiles: ProfileService,
    private readonly db: DatabaseAdapter
  ) {}

  async installPack(
    orgId: string,
    owner?: { ownerUserId: string; sharedWithTeam: boolean }
  ): Promise<LaundryPackInstallResponse> {
    const seededTools = await this.ensureDemoTools(orgId);
    const toolIdsByName = new Map(
      seededTools.map((tool) => [tool.name, tool.id])
    );

    const installed: ProfileResponse[] = [];
    const skippedAgents: { catalogId: string; reason: string }[] = [];

    for (const entry of listLaundryInnovationSummitCatalog()) {
      try {
        const profile = await this.installPackAgent(
          orgId,
          entry,
          toolIdsByName,
          owner
        );
        installed.push(profile);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        if (
          error instanceof AirinApiError &&
          error.status === 409 &&
          message.includes("already")
        ) {
          skippedAgents.push({
            catalogId: entry.id,
            reason: "Profile already exists for this agent.",
          });
          continue;
        }

        if (message.includes("already taken")) {
          skippedAgents.push({
            catalogId: entry.id,
            reason: "Profile id already taken.",
          });
          continue;
        }

        throw error;
      }
    }

    return {
      packId: LAUNDRY_INNOVATION_SUMMIT_PACK_ID,
      profiles: installed,
      seededTools,
      skippedAgents,
    };
  }

  private async installPackAgent(
    orgId: string,
    entry: AgentMarketplaceEntry,
    toolIdsByName: Map<string, string>,
    owner?: { ownerUserId: string; sharedWithTeam: boolean }
  ): Promise<ProfileResponse> {
    const existing = await this.profiles.listProfiles(orgId);
    const nameKey = entry.name.trim().toLowerCase();
    const already = existing.profiles.find(
      (profile) => profile.name.trim().toLowerCase() === nameKey
    );

    if (already) {
      throw new AirinApiError(
        "This marketplace agent is already installed.",
        409
      );
    }

    const soulFiles: Record<string, string> = {
      "INSTRUCTIONS.md": entry.instructions,
      "SOUL.md": entry.soul,
      "STYLE.md": entry.style,
    };

    if (entry.roleOneLiner) {
      soulFiles["INSTRUCTIONS.md"] =
        `${entry.instructions}\n\n## Role one-liner\n\n${entry.roleOneLiner}`;
    }

    if (entry.memoryMarkdown) {
      soulFiles["MEMORY.md"] = entry.memoryMarkdown;
    }

    const profile = await this.profiles.createProfile(
      orgId,
      {
        id: entry.preferredProfileId,
        name: entry.name,
        soulFiles,
        systemPrompt: entry.systemPrompt,
      },
      owner
    );

    const profileId = profile.profile.id;

    await this.assignBundledSkills(profileId, entry.bundledSkillNames ?? []);
    await this.assignComposioHints(orgId, profileId, entry.composioApps);
    await this.assignLaundryTools(
      orgId,
      profileId,
      entry.laundryToolTemplateIds ?? [],
      toolIdsByName
    );

    return profile;
  }

  private async assignBundledSkills(
    profileId: string,
    names: readonly string[]
  ): Promise<void> {
    for (const name of names) {
      const skill = await this.db.getSkillByName(name);

      if (skill) {
        await this.db.assignSkillToProfile(profileId, skill.id);
      }
    }
  }

  private async assignComposioHints(
    orgId: string,
    profileId: string,
    slugs: readonly string[]
  ): Promise<void> {
    if (slugs.length === 0) {
      return;
    }

    const assignments = [];

    for (const slug of slugs) {
      const toolkit = await this.db.getComposioToolkitBySlug(orgId, slug);

      if (toolkit) {
        assignments.push({
          allowedActions: null,
          profileId,
          toolkitId: toolkit.id,
        });
      }
    }

    if (assignments.length > 0) {
      await this.db.replaceProfileComposioToolkits(profileId, assignments);
    }
  }

  private async assignLaundryTools(
    orgId: string,
    profileId: string,
    templateIds: readonly LaundryDemoToolTemplateId[],
    toolIdsByName: Map<string, string>
  ): Promise<void> {
    for (const templateId of templateIds) {
      const template = LAUNDRY_DEMO_TOOL_TEMPLATES.find(
        (item) => item.id === templateId
      );

      if (!template) {
        continue;
      }

      const toolId = toolIdsByName.get(template.name);

      if (!toolId) {
        continue;
      }

      await this.profiles.assignTool(orgId, profileId, { toolId });
    }
  }

  async ensureDemoTools(
    orgId: string
  ): Promise<{ id: string; name: string }[]> {
    const toolsDir = getCustomToolsDir(orgId);
    await mkdir(toolsDir, { recursive: true });

    const seeded: { id: string; name: string }[] = [];

    for (const template of LAUNDRY_DEMO_TOOL_TEMPLATES) {
      const existing = await this.db.getToolByNameForOrg(orgId, template.name);

      if (existing) {
        seeded.push({ id: existing.id, name: existing.name });
        continue;
      }

      const sourcePath = laundryDemoToolTemplatePath(template.id);
      const modulePath = template.moduleFileName;
      const destPath = `${toolsDir}/${modulePath}`;

      await copyFile(sourcePath, destPath);
      await readFile(destPath, "utf8");

      const detail = await this.profiles.createTool(
        {
          description: template.description,
          handlerConfig: {
            env: template.env,
            modulePath,
            parameters: template.handlerConfigParameters,
          },
          handlerType: "javascript",
          name: template.name,
        },
        orgId
      );

      seeded.push({ id: detail.id, name: detail.name });
    }

    return seeded;
  }
}
