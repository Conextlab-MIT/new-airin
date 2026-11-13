export { AirinApiError, AirinAuthExpiredError } from "@airin/core/api-error";

export { AirinClient } from "./client";

export type {
  RemoteChatSession,
  SendMessageArg,
  StreamHandlers,
  TransferProgress,
} from "./types";

import type { ProfileSummary } from "@airin/core/contract";

export function getProfileAvatarUrl(
  profile: Pick<ProfileSummary, "id" | "hasAvatar" | "updatedAt">,
  orgId?: string
): string | null {
  if (!profile.hasAvatar) {
    return null;
  }

  const query = new URLSearchParams({ v: profile.updatedAt });

  if (orgId) {
    query.set("orgId", orgId);
  }

  return `/v1/profiles/${encodeURIComponent(profile.id)}/avatar?${query.toString()}`;
}
