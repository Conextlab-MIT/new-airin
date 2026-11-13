import { describe, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { AirinClient } from "@airin/client";
import type { ProfileSummary } from "@airin/core";
import { loadSavedCliProfileId, saveCliProfileId } from "./cli-config";
import { resolveProfileInput, resolveStartupProfile } from "./profile";

function profile(
  overrides: Partial<ProfileSummary> & Pick<ProfileSummary, "id" | "name">
): ProfileSummary {
  return {
    createdAt: "",
    hasAvatar: false,
    isSuper: false,
    mcpServerCount: 0,
    model: null,
    soulActive: false,
    toolCount: 0,
    updatedAt: "",
    ...overrides,
  };
}

const sampleProfiles = [
  profile({ id: "super_airin", isSuper: true, name: "Airin" }),
  profile({ id: "profile_default", isDefault: true, name: "Default Bot" }),
  profile({ id: "profile_custom", name: "Research Bot" }),
];

test("startup defaults to Airin and respects saved and explicit choices", async () => {
  const configDir = await mkdtemp(join(tmpdir(), "airin-cli-profile-"));
  const previous = process.env.AIRIN_CONFIG_DIR;
  process.env.AIRIN_CONFIG_DIR = configDir;

  // SAFETY: resolveStartupProfile only reads listProfiles from this fixture.
  const client = {
    listProfiles: async () => ({ profiles: sampleProfiles }),
  } as AirinClient;

  try {
    expect((await resolveStartupProfile(client, {})).profileId).toBe(
      "super_airin"
    );
    expect(await loadSavedCliProfileId()).toBe("super_airin");
    await saveCliProfileId("profile_custom");
    expect((await resolveStartupProfile(client, {})).profileId).toBe(
      "profile_custom"
    );
    expect(
      (await resolveStartupProfile(client, { profileId: "profile_default" }))
        .profileId
    ).toBe("profile_default");
    await saveCliProfileId("deleted_profile");
    expect((await resolveStartupProfile(client, {})).profileId).toBe(
      "super_airin"
    );
  } finally {
    if (previous === undefined) {
      delete process.env.AIRIN_CONFIG_DIR;
    } else {
      process.env.AIRIN_CONFIG_DIR = previous;
    }

    await rm(configDir, { force: true, recursive: true });
  }
});

describe("parseCliProfileArgs", () => {});

describe("sortProfilesForPicker", () => {});

describe("resolveProfileInput", () => {
  test("resolves id, name, and index", () => {
    expect(resolveProfileInput(sampleProfiles, "profile_custom")?.name).toBe(
      "Research Bot"
    );
    expect(resolveProfileInput(sampleProfiles, "Airin")?.id).toBe(
      "super_airin"
    );
    expect(resolveProfileInput(sampleProfiles, "1")?.id).toBe(
      "profile_default"
    );
  });

  test("returns undefined for unknown input", () => {
    expect(resolveProfileInput(sampleProfiles, "missing")).toBeUndefined();
  });
});
