import { Button } from "@airin/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@airin/ui/dialog";
import { Input } from "@airin/ui/input";
import { Spinner } from "@airin/ui/spinner";
import { type FormEvent, useState } from "react";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useCreateProfileMutation } from "@/hooks/use-resource-mutations";
import { formatError } from "@/lib/client";

/**
 * Owner-mode “+”: create a plain agent (not marketplace), ask for a name and
 * first task, then open a new persistent chat with that draft sent.
 */
export function OwnerCreateAgentDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        {open ? <OwnerCreateAgentForm onOpenChange={onOpenChange} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function OwnerCreateAgentForm({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [firstTask, setFirstTask] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createMutation = useCreateProfileMutation();
  const { navigateToNewChat } = useAppNavigation();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    const task = firstTask.trim();

    if (!trimmedName) {
      setError("Name is required.");

      return;
    }

    if (!task) {
      setError("First task is required.");

      return;
    }

    setError(null);

    try {
      const result = await createMutation.mutateAsync({
        name: trimmedName,
        soulFiles: {
          "INSTRUCTIONS.md": [
            `# ${trimmedName}`,
            "",
            "You are a plain AI agent for this business owner.",
            "Remember lasting facts with the update-profile-memory skill (MEMORY.md).",
            "The user can rename you later in agent settings.",
            "Prefer interactive HTML widgets (calculators, forms, dashboards) when they help.",
          ].join("\n"),
          "MEMORY.md": "",
          "SOUL.md": `# ${trimmedName}\n\nA helpful plain AI agent. Learn and remember across chats.`,
          "STYLE.md": "Clear, practical, and friendly.",
        },
        systemPrompt: `You are ${trimmedName}, a helpful AI agent. Persist useful facts in MEMORY.md via update-profile-memory. Prefer HTML widgets with inline CSS/JS for interactive results when useful.`,
      });

      onOpenChange(false);
      navigateToNewChat(result.profile.id, { draft: task, send: true });
    } catch (err) {
      setError(formatError(err));
    }
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)}>
      <DialogHeader>
        <DialogTitle>New agent</DialogTitle>
      </DialogHeader>
      <div className="mt-4 space-y-4">
        <label className="block space-y-1.5">
          <span className="text-foreground text-sm">Name</span>
          <Input
            autoFocus
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Finance helper"
            value={name}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-foreground text-sm">First task</span>
          <Input
            onChange={(event) => setFirstTask(event.target.value)}
            placeholder="e.g. Help me track monthly expenses"
            value={firstTask}
          />
        </label>
        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <DialogFooter className="mt-6">
        <Button
          onClick={() => onOpenChange(false)}
          type="button"
          variant="ghost"
        >
          Cancel
        </Button>
        <Button disabled={createMutation.isPending} type="submit">
          {createMutation.isPending ? <Spinner className="size-4" /> : null}
          Create
        </Button>
      </DialogFooter>
    </form>
  );
}
