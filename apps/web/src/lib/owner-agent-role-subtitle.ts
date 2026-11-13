import type { ProfileSummary } from "@airin/core";

export type OwnerAgentRoleMessageKey =
  | "owner.role.laundryAnalyst"
  | "owner.role.laundryFinance"
  | "owner.role.laundryOps"
  | "owner.role.laundrySocial"
  | "owner.role.laundrySupport"
  | "owner.role.laundryVisibility";

const LAUNDRY_PROFILE_ID_TO_ROLE = {
  laundry_analyst: "owner.role.laundryAnalyst",
  laundry_finance: "owner.role.laundryFinance",
  laundry_ops: "owner.role.laundryOps",
  laundry_social: "owner.role.laundrySocial",
  laundry_support: "owner.role.laundrySupport",
  laundry_visibility: "owner.role.laundryVisibility",
} as const satisfies Record<string, OwnerAgentRoleMessageKey>;

/** Summit roster display names and legacy pack labels → role subtitle. */
const LAUNDRY_PROFILE_NAME_TO_ROLE = {
  Analyst: "owner.role.laundryAnalyst",
  Ardi: "owner.role.laundryAnalyst",
  Dimas: "owner.role.laundryFinance",
  Gilang: "owner.role.laundryVisibility",
  Operations: "owner.role.laundryOps",
  Rina: "owner.role.laundrySupport",
  Sari: "owner.role.laundrySocial",
  Social: "owner.role.laundrySocial",
  Support: "owner.role.laundrySupport",
  Toni: "owner.role.laundryOps",
  Visibility: "owner.role.laundryVisibility",
} as const satisfies Record<string, OwnerAgentRoleMessageKey>;

export function laundryAgentRoleMessageKey(
  profile: Pick<ProfileSummary, "id" | "name" | "isSuper">
): OwnerAgentRoleMessageKey | null {
  return (
    LAUNDRY_PROFILE_ID_TO_ROLE[profile.id] ??
    LAUNDRY_PROFILE_NAME_TO_ROLE[profile.name.trim()] ??
    null
  );
}

export function ownerAgentSubtitleMessageKey(
  profile: Pick<ProfileSummary, "id" | "name" | "isSuper">
): OwnerAgentRoleMessageKey | "owner.orchestrator" | "owner.agent" {
  if (profile.isSuper) {
    return "owner.orchestrator";
  }

  const laundryRole = laundryAgentRoleMessageKey(profile);

  if (laundryRole) {
    return laundryRole;
  }

  return "owner.agent";
}
