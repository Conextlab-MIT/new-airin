import type { AgentCharacterId } from "@airin/core/agent-marketplace";
import {
  agentCharacterPublicPath,
  resolveAgentCharacterId,
} from "@airin/core/agent-marketplace";
import type { ProfileSummary } from "@airin/core/contract";
import { Button } from "@airin/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@airin/ui/dialog";
import { Input } from "@airin/ui/input";
import { toast } from "@airin/ui/toast";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AgentCharacterPicker } from "@/components/AgentCharacterPicker";
import {
  useUpdateProfileMutation,
  useUploadProfileAvatarMutation,
} from "@/hooks/use-resource-mutations";
import { characterIdToImageAttachment } from "@/lib/agent-character-avatar";
import { formatError } from "@/lib/client";
import { profilePath } from "@/lib/navigation";

export function OwnerAgentSettingsDialog({
  open,
  onOpenChange,
  profile,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: ProfileSummary;
}) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-md gap-4">
        {open ? (
          <OwnerAgentSettingsForm
            key={profile.id}
            onOpenChange={onOpenChange}
            profile={profile}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function OwnerAgentSettingsForm({
  onOpenChange,
  profile,
}: {
  onOpenChange: (open: boolean) => void;
  profile: ProfileSummary;
}) {
  const updateProfile = useUpdateProfileMutation();
  const uploadAvatar = useUploadProfileAvatarMutation();
  const [name, setName] = useState(profile.name);

  const [characterId, setCharacterId] = useState<AgentCharacterId>(() =>
    resolveAgentCharacterId({ name: profile.name, profileId: profile.id })
  );

  const [error, setError] = useState<string | null>(null);

  const busy = updateProfile.isPending || uploadAvatar.isPending;

  async function save() {
    const nextName = name.trim();

    if (!nextName) {
      setError("Name is required.");

      return;
    }

    setError(null);

    try {
      if (nextName !== profile.name) {
        await updateProfile.mutateAsync({
          input: { name: nextName },
          profileId: profile.id,
        });
      }

      const attachment = await characterIdToImageAttachment(characterId);
      await uploadAvatar.mutateAsync({
        attachment,
        profileId: profile.id,
      });
      toast("Agent updated.");
      onOpenChange(false);
    } catch (failure) {
      setError(formatError(failure));
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Agent settings</DialogTitle>
      </DialogHeader>

      <div className="flex items-center gap-3">
        <img
          alt=""
          className="size-14 rounded-2xl object-cover outline outline-1 outline-black/10 -outline-offset-1 dark:outline-white/10"
          height={56}
          src={agentCharacterPublicPath(characterId)}
          width={56}
        />
        <div className="min-w-0 flex-1 space-y-1.5">
          <label className="font-medium text-sm" htmlFor="owner-agent-name">
            Name
          </label>
          <Input
            disabled={busy}
            id="owner-agent-name"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </div>
      </div>

      <AgentCharacterPicker
        busy={busy}
        onSelect={setCharacterId}
        selectedId={characterId}
      />

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <DialogFooter className="gap-2 sm:justify-between">
        <Button
          render={<Link to={profilePath(profile.id)} />}
          size="sm"
          variant="ghost"
        >
          More settings
        </Button>
        <div className="flex gap-2">
          <Button
            disabled={busy}
            onClick={() => onOpenChange(false)}
            size="sm"
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button disabled={busy} onClick={() => void save()} size="sm">
            {busy ? "Saving…" : "Save"}
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
