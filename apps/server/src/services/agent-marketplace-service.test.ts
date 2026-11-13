import { describe, expect, test } from "bun:test";
import { AirinApiError } from "@airin/core";
import { AgentMarketplaceService } from "./agent-marketplace-service";
import type { ProfileService } from "./profile-service";

function profilesStub(initial: { id: string; name: string }[] = []) {
  const profiles = [...initial];

  return {
    createProfile: async (
      _orgId: string,
      input: { name: string; systemPrompt?: string }
    ) => {
      const profile = {
        id: `profile_${profiles.length + 1}`,
        name: input.name,
        systemPrompt: input.systemPrompt ?? "",
      };
      profiles.push(profile);

      return profile;
    },
    listProfiles: async () => ({ profiles }),
    updateProfile: async (
      _orgId: string,
      profileId: string,
      input: { name?: string }
    ) => {
      const profile = profiles.find((entry) => entry.id === profileId);

      if (!profile) {
        throw new Error("missing");
      }

      if (input.name) {
        profile.name = input.name;
      }

      return profile;
    },
  } as unknown as ProfileService;
}

describe("AgentMarketplaceService", () => {
  test("lists the core pack with installed flags", async () => {
    const service = new AgentMarketplaceService(
      profilesStub([{ id: "p1", name: "Fajar" }])
    );

    const listed = await service.list("org_1");

    expect(listed.agents).toHaveLength(8);
    expect(listed.agents.find((agent) => agent.id === "sales")?.installed).toBe(
      true
    );
    expect(
      listed.agents.find((agent) => agent.id === "chief-of-staff")?.installed
    ).toBe(false);
  });

  test("renames legacy role titles to person names on list", async () => {
    const service = new AgentMarketplaceService(
      profilesStub([{ id: "p1", name: "Social Media" }])
    );

    const listed = await service.list("org_1");

    expect(
      listed.agents.find((agent) => agent.id === "social-media")?.installed
    ).toBe(true);
    expect(
      listed.agents.find((agent) => agent.id === "social-media")?.name
    ).toBe("Kezia");
  });

  test("install creates a profile from the catalog entry", async () => {
    const service = new AgentMarketplaceService(profilesStub());

    const { profile } = await service.install("org_1", "chief-of-staff", {
      ownerUserId: "user_1",
      sharedWithTeam: true,
    });

    expect(profile.name).toBe("Jovan");
    expect(profile.systemPrompt).toContain("send_to_bot");
  });

  test("install refuses a duplicate legacy or person name", async () => {
    const service = new AgentMarketplaceService(
      profilesStub([{ id: "p1", name: "Chief of Staff" }])
    );

    await expect(service.install("org_1", "chief-of-staff")).rejects.toEqual(
      new AirinApiError("This marketplace agent is already installed.", 409)
    );
  });

  test("install refuses an unknown catalog id", async () => {
    const service = new AgentMarketplaceService(profilesStub());

    await expect(service.install("org_1", "missing")).rejects.toEqual(
      new AirinApiError("Marketplace agent not found.", 404)
    );
  });
});
