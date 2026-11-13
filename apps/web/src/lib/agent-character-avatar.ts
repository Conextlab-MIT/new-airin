import type { AgentCharacterId } from "@airin/core/agent-marketplace";
import { agentCharacterPublicPath } from "@airin/core/agent-marketplace";
import type { ImageAttachment } from "@airin/core/contract";

/** Load a curated portrait as an uploadable avatar attachment. */
export async function characterIdToImageAttachment(
  characterId: AgentCharacterId
): Promise<ImageAttachment> {
  const response = await fetch(agentCharacterPublicPath(characterId));

  if (!response.ok) {
    throw new Error(`Could not load portrait ${characterId}.`);
  }

  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return {
    data: btoa(binary),
    mediaType: blob.type || "image/png",
  };
}

export async function characterIdToFile(
  characterId: AgentCharacterId
): Promise<File> {
  const response = await fetch(agentCharacterPublicPath(characterId));

  if (!response.ok) {
    throw new Error(`Could not load portrait ${characterId}.`);
  }

  const blob = await response.blob();

  return new File([blob], `${characterId}.png`, {
    type: blob.type || "image/png",
  });
}
