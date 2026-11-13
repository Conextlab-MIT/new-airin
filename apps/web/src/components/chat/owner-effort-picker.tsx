import { Popover, PopoverContent, PopoverTrigger } from "@airin/ui/popover";
import { cn } from "@airin/ui/utils";
import { ArrowDown01Icon } from "hugeicons-react";
import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
  getStoredOwnerChatEffort,
  OWNER_CHAT_EFFORT_LABELS,
  OWNER_CHAT_EFFORTS,
  type OwnerChatEffort,
  type OwnerEffortProviderGroup,
  persistOwnerChatEffort,
  resolveOwnerEffortModel,
  thinkingEffortForOwnerChat,
} from "@/lib/owner-chat-effort";

const EFFORT_HINTS: Record<OwnerChatEffort, string> = {
  low: "Fast replies",
  medium: "Balanced",
  ultra: "Best quality",
};

const CLOSE_DELAY_MS = 1000;

/**
 * ChatGPT-style effort control for Owner chat: hides model ids and maps
 * Low / Medium / Ultra onto DeepSeek / DeepSeek / GLM.
 */
export function OwnerEffortPicker({
  busy,
  disabled,
  groups,
  currentModelSelection,
  onModelChange,
  onThinkingEffortChange,
  triggerRef,
}: {
  busy: boolean;
  disabled: boolean;
  groups: OwnerEffortProviderGroup[];
  currentModelSelection: string | null;
  onModelChange: (selection: string) => void;
  onThinkingEffortChange?: (effort: string) => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}) {
  const [open, setOpen] = useState(false);

  const [effort, setEffort] = useState<OwnerChatEffort>(() =>
    getStoredOwnerChatEffort()
  );

  const syncedRef = useRef(false);
  const hoveringRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);

  const resolved = useMemo(
    () => resolveOwnerEffortModel(effort, groups),
    [effort, groups]
  );

  const index = OWNER_CHAT_EFFORTS.indexOf(effort);
  const label = OWNER_CHAT_EFFORT_LABELS[effort];
  const isUltra = effort === "ultra";

  function clearCloseTimer() {
    if (closeTimerRef.current == null) {
      return;
    }

    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      if (!hoveringRef.current) {
        setOpen(false);
      }
    }, CLOSE_DELAY_MS);
  }

  useEffect(() => () => clearCloseTimer(), []);

  function applyEffort(next: OwnerChatEffort) {
    setEffort(next);
    persistOwnerChatEffort(next);

    const model = resolveOwnerEffortModel(next, groups);

    if (model && model.selection !== currentModelSelection) {
      onModelChange(model.selection);
    }

    onThinkingEffortChange?.(thinkingEffortForOwnerChat(next));
  }

  // First time models load, align the session to the stored Owner effort.
  // oxlint-disable react-doctor/no-pass-data-to-parent react-doctor/no-pass-live-state-to-parent -- One-shot sync when the model list first arrives; syncedRef prevents repeats.
  useEffect(() => {
    if (syncedRef.current || busy || disabled || groups.length === 0) {
      return;
    }

    const model = resolveOwnerEffortModel(effort, groups);

    if (!model) {
      return;
    }

    syncedRef.current = true;

    if (model.selection !== currentModelSelection) {
      onModelChange(model.selection);
    }

    onThinkingEffortChange?.(thinkingEffortForOwnerChat(effort));
  }, [
    busy,
    currentModelSelection,
    disabled,
    effort,
    groups,
    onModelChange,
    onThinkingEffortChange,
  ]);
  // oxlint-enable react-doctor/no-pass-data-to-parent react-doctor/no-pass-live-state-to-parent

  return (
    <div className="min-w-[4.5rem] shrink overflow-hidden">
      <Popover
        onOpenChange={(next) => {
          if (next) {
            clearCloseTimer();
            hoveringRef.current = true;
            setOpen(true);

            return;
          }

          // Outside click / Esc: close now. Hover leave uses scheduleClose.
          if (!hoveringRef.current) {
            clearCloseTimer();
            setOpen(false);
          }
        }}
        open={open}
      >
        <PopoverTrigger
          aria-label="Select effort"
          className="flex h-7 max-w-full items-center gap-1 overflow-hidden rounded-lg bg-muted px-2.5 font-medium text-foreground text-xs transition-[background-color,opacity] hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 aria-expanded:bg-accent"
          disabled={
            disabled || groups.every((group) => group.models.length === 0)
          }
          ref={triggerRef}
          title={label}
          type="button"
        >
          <span className="min-w-0 truncate">{label}</span>
          <ArrowDown01Icon
            aria-hidden
            className="size-3.5 shrink-0 opacity-60"
          />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[min(20rem,92vw)] overflow-hidden rounded-2xl border-border/60 bg-popover p-0 shadow-lg"
          onPointerEnter={() => {
            hoveringRef.current = true;
            clearCloseTimer();
          }}
          onPointerLeave={() => {
            hoveringRef.current = false;
            scheduleClose();
          }}
        >
          <div className="px-3 pt-3 text-center">
            <p
              className={cn(
                "font-semibold text-base",
                isUltra
                  ? "text-sky-500 dark:text-sky-400"
                  : "text-violet-500 dark:text-violet-400"
              )}
            >
              {label}
            </p>
            <p className="text-muted-foreground text-xs">
              {resolved ? EFFORT_HINTS[effort] : "No model available"}
            </p>
          </div>

          <div className="relative px-4 pt-4 pb-2">
            {isUltra ? (
              <div
                aria-hidden
                className="owner-effort-bubbles pointer-events-none absolute inset-x-4 top-3 h-5 overflow-hidden"
              >
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            ) : null}
            <label className="sr-only" htmlFor="owner-effort-slider">
              Effort
            </label>
            <input
              className={cn(
                "owner-effort-slider relative z-[1] w-full",
                isUltra && "owner-effort-slider-ultra"
              )}
              disabled={busy || disabled}
              id="owner-effort-slider"
              max={OWNER_CHAT_EFFORTS.length - 1}
              min={0}
              onChange={(event) => {
                const next = OWNER_CHAT_EFFORTS[Number(event.target.value)];

                if (next) {
                  applyEffort(next);
                }
              }}
              step={1}
              type="range"
              value={index}
            />
            <div className="mt-1 flex justify-between px-0.5 text-[10px] text-muted-foreground">
              {OWNER_CHAT_EFFORTS.map((level) => (
                <button
                  className={cn(
                    "rounded px-1 py-0.5 transition-colors",
                    level === effort
                      ? "font-medium text-foreground"
                      : "hover:text-foreground"
                  )}
                  disabled={busy || disabled}
                  key={level}
                  onClick={() => applyEffort(level)}
                  type="button"
                >
                  {OWNER_CHAT_EFFORT_LABELS[level]}
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
