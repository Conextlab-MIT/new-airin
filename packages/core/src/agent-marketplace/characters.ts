/**
 * Portrait pack for agent UI. Files live at `/characters/{id}.png` in the web app.
 */

export const AGENT_CHARACTER_IDS = [
  "aditya",
  "alya",
  "arif",
  "bagas",
  "bima",
  "dimas",
  "fajar",
  "hana",
  "intan",
  "jovan",
  "kezia",
  "kirana",
  "laras",
  "maya",
  "mira",
  "nadia",
  "naufal",
  "nisa",
  "raka",
  "rani",
  "reza",
  "sinta",
  "tara",
] as const;

export type AgentCharacterId = (typeof AGENT_CHARACTER_IDS)[number];

/** Marketplace agent id → portrait id. */
export const MARKETPLACE_CHARACTER_BY_AGENT_ID: Readonly<
  Record<string, AgentCharacterId>
> = {
  "chief-of-staff": "jovan",
  "customer-success": "hana",
  "finance-ops": "dimas",
  "hr-indonesia": "alya",
  "laundry-analyst": "mira",
  "laundry-finance": "dimas",
  "laundry-ops": "bima",
  "laundry-social": "kezia",
  "laundry-support": "hana",
  "laundry-visibility": "laras",
  "legal-lite": "nisa",
  ops: "bima",
  sales: "fajar",
  "social-media": "kezia",
};

/** Profile display name (case-insensitive) → portrait id for installed marketplace agents. */
export const MARKETPLACE_CHARACTER_BY_NAME: Readonly<
  Record<string, AgentCharacterId>
> = {
  alya: "alya",
  analyst: "mira",
  ardi: "mira",
  bima: "bima",
  "chief of staff": "jovan",
  "customer success": "hana",
  dimas: "dimas",
  fajar: "fajar",
  "finance ops": "dimas",
  gilang: "fajar",
  hana: "hana",
  "hr indonesia": "alya",
  jovan: "jovan",
  kezia: "kezia",
  "legal lite": "nisa",
  nisa: "nisa",
  operations: "bima",
  ops: "bima",
  rina: "hana",
  sales: "fajar",
  sari: "kezia",
  social: "kezia",
  "social media": "kezia",
  support: "hana",
  toni: "bima",
  visibility: "laras",
};

/** Older role titles → person names (same portrait / gender). */
export const MARKETPLACE_LEGACY_NAME_TO_PERSON: Readonly<
  Record<string, string>
> = {
  "chief of staff": "Jovan",
  "customer success": "Hana",
  "finance ops": "Dimas",
  "hr indonesia": "Alya",
  "legal lite": "Nisa",
  ops: "Bima",
  sales: "Fajar",
  "social media": "Kezia",
};

export function isAgentCharacterId(value: string): value is AgentCharacterId {
  return (AGENT_CHARACTER_IDS as readonly string[]).includes(value);
}

export function agentCharacterPublicPath(
  characterId: AgentCharacterId
): string {
  return `/characters/${characterId}.png`;
}

/** Stable portrait when the profile has no uploaded avatar and is not a known marketplace name. */
export function characterIdForIdentity(identity: string): AgentCharacterId {
  let hash = 0;

  for (let index = 0; index < identity.length; index++) {
    hash = (hash * 31 + identity.charCodeAt(index)) % 0x1_00_00_00_00;
  }

  return AGENT_CHARACTER_IDS[
    Math.abs(hash) % AGENT_CHARACTER_IDS.length
  ] as AgentCharacterId;
}

export function resolveAgentCharacterId(input: {
  marketplaceId?: string | null;
  name?: string | null;
  profileId?: string | null;
}): AgentCharacterId {
  const marketplaceId = input.marketplaceId?.trim();

  if (marketplaceId && MARKETPLACE_CHARACTER_BY_AGENT_ID[marketplaceId]) {
    return MARKETPLACE_CHARACTER_BY_AGENT_ID[marketplaceId]!;
  }

  const nameKey = input.name?.trim().toLowerCase();

  if (nameKey && MARKETPLACE_CHARACTER_BY_NAME[nameKey]) {
    return MARKETPLACE_CHARACTER_BY_NAME[nameKey]!;
  }

  return characterIdForIdentity(input.profileId?.trim() || nameKey || "agent");
}
