import {
  type AgentCharacterId,
  agentCharacterPublicPath,
  isAgentCharacterId,
  resolveAgentCharacterId,
} from "@airin/core/agent-marketplace";
import { Button } from "@airin/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@airin/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AgentCharacterPicker } from "@/components/AgentCharacterPicker";
import { useAuth } from "@/context/use-auth";
import { useUploadProfileAvatarMutation } from "@/hooks/use-resource-mutations";
import { characterIdToImageAttachment } from "@/lib/agent-character-avatar";
import { client, formatError } from "@/lib/client";
import { PAGE_PATHS } from "@/lib/navigation";

function characterSrc(characterId: string, marketplaceId: string): string {
  const id: AgentCharacterId = isAgentCharacterId(characterId)
    ? characterId
    : resolveAgentCharacterId({ marketplaceId });

  return agentCharacterPublicPath(id);
}

export function MarketplacePage() {
  const { activeOrg } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [installingId, setInstallingId] = useState<string | null>(null);

  const [pickedCharacterId, setPickedCharacterId] =
    useState<AgentCharacterId | null>(null);

  const uploadAvatar = useUploadProfileAvatarMutation();

  const catalog = useQuery({
    queryFn: () => client.listAgentMarketplace(),
    queryKey: ["agent-marketplace", activeOrg?.id],
  });

  const install = useMutation({
    mutationFn: async ({
      catalogId,
      characterId,
    }: {
      catalogId: string;
      characterId: AgentCharacterId;
    }) => {
      const result = await client.installAgentMarketplaceAgent(catalogId);
      const profileId = result.profile.profile.id;
      const attachment = await characterIdToImageAttachment(characterId);
      await uploadAvatar.mutateAsync({
        attachment,
        profileId,
      });

      return result;
    },
    onError: (failure) => {
      setError(formatError(failure));
    },
    onSuccess: async () => {
      setError(null);
      setInstallingId(null);
      setPickedCharacterId(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["agent-marketplace"] }),
        queryClient.invalidateQueries({ queryKey: ["profiles"] }),
      ]);
    },
  });

  const agents = catalog.data?.agents ?? [];
  const canInstall = activeOrg?.role === "admin";
  const installingAgent = agents.find((agent) => agent.id === installingId);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:p-6">
      <div className="space-y-1">
        <h1 className="font-semibold text-foreground text-xl">Marketplace</h1>
        <p className="text-muted-foreground text-sm">
          Ready-made agents for your business. Install one, then chat from Your
          team.
        </p>
      </div>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}

      {catalog.isLoading ? (
        <p className="text-muted-foreground text-sm">Loading agents…</p>
      ) : null}

      <ul className="grid gap-3 sm:grid-cols-2">
        {agents.map((agent) => (
          <li
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4"
            key={agent.id}
          >
            <div className="flex items-start gap-3">
              <img
                alt=""
                className="size-14 shrink-0 rounded-2xl object-cover outline outline-1 outline-black/10 -outline-offset-1 dark:outline-white/10"
                height={56}
                src={characterSrc(agent.characterId, agent.id)}
                width={56}
              />
              <div className="min-w-0 space-y-1">
                <p className="font-medium text-2xs text-muted-foreground uppercase tracking-wide">
                  {agent.category}
                </p>
                <h2 className="font-semibold text-base text-foreground">
                  {agent.name}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {agent.description}
                </p>
                {agent.composioApps.length > 0 ? (
                  <p className="text-muted-foreground text-xs">
                    Connect later: {agent.composioApps.join(", ")}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mt-auto flex items-center gap-2">
              {agent.installed ? (
                <Button
                  render={<Link to={PAGE_PATHS.chat} />}
                  size="sm"
                  variant="outline"
                >
                  Open chat
                </Button>
              ) : (
                <Button
                  disabled={!canInstall || install.isPending}
                  onClick={() => {
                    setError(null);
                    setInstallingId(agent.id);
                    setPickedCharacterId(
                      isAgentCharacterId(agent.characterId)
                        ? agent.characterId
                        : resolveAgentCharacterId({ marketplaceId: agent.id })
                    );
                  }}
                  size="sm"
                  type="button"
                >
                  Install
                </Button>
              )}
              {canInstall || agent.installed ? null : (
                <span className="text-muted-foreground text-xs">
                  Ask an admin to install
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setInstallingId(null);
            setPickedCharacterId(null);
          }
        }}
        open={installingAgent !== undefined}
      >
        <DialogContent className="max-w-md gap-4">
          <DialogHeader>
            <DialogTitle>Add {installingAgent?.name}</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Pick a photo for this agent, then install.
          </p>
          <AgentCharacterPicker
            busy={install.isPending}
            onSelect={setPickedCharacterId}
            selectedId={pickedCharacterId}
          />
          <DialogFooter>
            <Button
              disabled={install.isPending}
              onClick={() => {
                setInstallingId(null);
                setPickedCharacterId(null);
              }}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={
                install.isPending ||
                !installingAgent ||
                pickedCharacterId === null
              }
              onClick={() => {
                if (!(installingAgent && pickedCharacterId)) {
                  return;
                }

                install.mutate({
                  catalogId: installingAgent.id,
                  characterId: pickedCharacterId,
                });
              }}
              type="button"
            >
              {install.isPending ? "Installing…" : "Install"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
