import { describe, expect, test } from "bun:test";
import {
  laundryAgentRoleMessageKey,
  ownerAgentSubtitleMessageKey,
} from "./owner-agent-role-subtitle";

describe("ownerAgentSubtitleMessageKey", () => {
  test("maps laundry profile ids to role keys", () => {
    expect(
      ownerAgentSubtitleMessageKey({
        id: "laundry_social",
        isSuper: false,
        name: "Sari",
      })
    ).toBe("owner.role.laundrySocial");
    expect(
      ownerAgentSubtitleMessageKey({
        id: "laundry_ops",
        isSuper: false,
        name: "Toni",
      })
    ).toBe("owner.role.laundryOps");
  });

  test("maps legacy display names when id is unknown", () => {
    expect(
      laundryAgentRoleMessageKey({
        id: "legacy-social",
        isSuper: false,
        name: "Social",
      })
    ).toBe("owner.role.laundrySocial");
  });

  test("uses orchestrator label for super agents", () => {
    expect(
      ownerAgentSubtitleMessageKey({
        id: "super",
        isSuper: true,
        name: "Boss",
      })
    ).toBe("owner.orchestrator");
  });

  test("falls back to generic agent label", () => {
    expect(
      ownerAgentSubtitleMessageKey({
        id: "custom-bot",
        isSuper: false,
        name: "Helper",
      })
    ).toBe("owner.agent");
  });
});
