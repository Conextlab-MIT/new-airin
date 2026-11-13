import { describe, expect, test } from "bun:test";
import {
  AGENT_MARKETPLACE_CORE_PACK,
  getAgentMarketplaceEntry,
  listAgentMarketplaceCatalog,
} from "./catalog";

describe("agent marketplace catalog", () => {
  test("ships eight core agents with unique ids", () => {
    const list = listAgentMarketplaceCatalog();
    expect(list).toHaveLength(8);
    expect(new Set(list.map((entry) => entry.id)).size).toBe(8);
    expect(getAgentMarketplaceEntry("chief-of-staff")?.name).toBe("Jovan");
    expect(getAgentMarketplaceEntry("chief-of-staff")?.characterId).toBe(
      "jovan"
    );
    expect(
      AGENT_MARKETPLACE_CORE_PACK.every(
        (entry) => entry.soul.length > 0 && entry.characterId.length > 0
      )
    ).toBe(true);
  });
});
