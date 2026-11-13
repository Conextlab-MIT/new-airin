import { describe, expect, test } from "bun:test";
import { getAgentMarketplaceEntry } from "./catalog";
import {
  LAUNDRY_INNOVATION_SUMMIT_PACK,
  listLaundryInnovationSummitCatalog,
} from "./catalog-laundry";

describe("laundry innovation summit catalog", () => {
  test("ships six agents with unique ids and role one-liners", () => {
    const list = listLaundryInnovationSummitCatalog();
    expect(list).toHaveLength(6);
    expect(new Set(list.map((entry) => entry.id)).size).toBe(6);
    expect(
      LAUNDRY_INNOVATION_SUMMIT_PACK.every(
        (entry) =>
          entry.packId === "laundry-innovation-summit" &&
          entry.roleOneLiner &&
          entry.roleOneLiner.length > 0
      )
    ).toBe(true);
  });

  test("resolves through shared getAgentMarketplaceEntry", () => {
    expect(getAgentMarketplaceEntry("laundry-analyst")?.name).toBe("Ardi");
    expect(
      getAgentMarketplaceEntry("laundry-analyst")?.laundryToolTemplateIds
    ).toEqual(["laundry-weather-forecast"]);
  });
});
