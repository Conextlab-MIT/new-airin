import {
  AGENT_CHARACTER_IDS,
  type AgentCharacterId,
  agentCharacterPublicPath,
} from "@airin/core/agent-marketplace";
import { cn } from "@airin/ui/utils";

export function AgentCharacterPicker({
  busy = false,
  selectedId,
  onSelect,
}: {
  busy?: boolean;
  selectedId: AgentCharacterId | null;
  onSelect: (characterId: AgentCharacterId) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-foreground text-sm">Photo</p>
      <ul className="grid grid-cols-5 gap-2 sm:grid-cols-6">
        {AGENT_CHARACTER_IDS.map((characterId) => {
          const selected = selectedId === characterId;

          return (
            <li key={characterId}>
              <button
                aria-label={characterId}
                aria-pressed={selected}
                className={cn(
                  "overflow-hidden rounded-xl outline outline-1 -outline-offset-1 transition-[outline-color,transform] active:scale-[0.97]",
                  selected
                    ? "outline-2 outline-primary"
                    : "outline-black/10 hover:outline-foreground/30 dark:outline-white/10"
                )}
                disabled={busy}
                onClick={() => onSelect(characterId)}
                type="button"
              >
                <img
                  alt=""
                  className="aspect-square size-full object-cover"
                  height={64}
                  src={agentCharacterPublicPath(characterId)}
                  width={64}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
