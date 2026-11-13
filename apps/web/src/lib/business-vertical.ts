import type { UserOrgSummary } from "@nakama/core/contract";

export type BusinessVerticalId = "generic" | "laundry";

const STORAGE_PREFIX = "airin:business-vertical:";

export const LAUNDRY_GOAL_SUGGESTIONS = [
  "Plan social posts",
  "Answer WhatsApp customers",
  "Forecast busy days",
  "Track stock and money",
  "See how we rank on Maps",
] as const;

export function businessVerticalStorageKey(userId: string): string {
  return `${STORAGE_PREFIX}${userId}`;
}

export function readBusinessVertical(
  userId: string
): BusinessVerticalId | null {
  try {
    const raw = localStorage.getItem(businessVerticalStorageKey(userId));

    if (raw === "laundry" || raw === "generic") {
      return raw;
    }
  } catch {
    // Ignore private mode.
  }

  return null;
}

export function writeBusinessVertical(
  userId: string,
  vertical: BusinessVerticalId
): void {
  try {
    localStorage.setItem(businessVerticalStorageKey(userId), vertical);
  } catch {
    // Ignore storage failures.
  }
}

/** Finds a demo laundry workspace org by name or slug (e.g. "Laundry Demo"). */
export function findLaundryWorkspaceOrg(
  orgs: readonly UserOrgSummary[]
): UserOrgSummary | null {
  return (
    orgs.find(
      (org) =>
        /laundry/i.test(org.name) ||
        (typeof org.slug === "string" && /laundry/i.test(org.slug))
    ) ?? null
  );
}
