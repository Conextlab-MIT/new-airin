import type { ProfileSummary } from "@airin/core";
import type { AgentGroup } from "@airin/core/agent-groups";
import { ConfirmDialog } from "@airin/ui/dialog";
import { DropdownMenuItem } from "@airin/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@airin/ui/tooltip";
import { cn } from "@airin/ui/utils";
import { ContextMenu } from "@base-ui/react/context-menu";
import {
  Calendar03Icon,
  DashboardSquare01Icon,
  Delete02Icon,
  NotificationOff01Icon,
  PanelLeftCloseIcon,
  PinIcon,
  PinOffIcon,
  PlusSignIcon,
  Settings01Icon,
  Store01Icon,
} from "hugeicons-react";
import { type ReactElement, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GroupAvatar } from "@/components/agent-groups/GroupAvatar";
import { OwnerCreateAgentDialog } from "@/components/OwnerCreateAgentDialog";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { SidebarUserMenu } from "@/components/SidebarUserMenu";
import { useOwnerSimpleUi } from "@/context/owner-simple-ui-context";
import { useAuth } from "@/context/use-auth";
import { useLocale } from "@/context/use-locale";
import { useUiMode } from "@/context/use-ui-mode";
import {
  useAgentGroupsQuery,
  useRailPinsQuery,
  useToggleRailPin,
} from "@/hooks/use-agent-groups";
import { useDeleteProfileMutation } from "@/hooks/use-resource-mutations";
import { useSelectProfile } from "@/hooks/use-select-profile";
import { isAgentChatMuted, setAgentChatMuted } from "@/lib/agent-chat-prefs";
import { formatError } from "@/lib/client";
import {
  groupPath,
  groupRouteFromPath,
  PAGE_PATHS,
  pathForPage,
} from "@/lib/navigation";
import { ownerAgentSubtitleMessageKey } from "@/lib/owner-agent-role-subtitle";

/**
 * Owner-mode sidebar: team roster (agents + groups) and a short footer nav.
 * Advanced mode keeps ProfileRail + AppSidebar instead.
 */
export function OwnerTeamSidebar({
  onHide,
  onNavigate,
  variant = "shell",
}: {
  /** Hides the shell sidebar below `lg`, or closes the phone drawer. */
  onHide?: () => void;
  onNavigate?: () => void;
  variant?: "drawer" | "shell";
} = {}) {
  const { profiles, activeProfileId, selectProfile } = useSelectProfile();
  const { data: groups = [] } = useAgentGroupsQuery();
  const { data: pins = [] } = useRailPinsQuery();
  const togglePin = useToggleRailPin();
  const deleteProfile = useDeleteProfileMutation();
  const location = useLocation();
  const openGroupId = groupRouteFromPath(location.pathname)?.groupId ?? null;
  const { activeOrg } = useAuth();
  const ownerSimple = useOwnerSimpleUi();
  const { setUiMode } = useUiMode();
  const { t } = useLocale();
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProfileSummary | null>(null);
  const drawer = variant === "drawer";

  const pinRank = new Map(pins.map((id, index) => [id, index]));

  const orderedProfiles = profiles.toSorted((left, right) => {
    const leftPinned = pinRank.has(left.id);
    const rightPinned = pinRank.has(right.id);

    if (leftPinned !== rightPinned) {
      return leftPinned ? -1 : 1;
    }

    if (leftPinned && rightPinned) {
      return (pinRank.get(left.id) ?? 0) - (pinRank.get(right.id) ?? 0);
    }

    return Number(right.isSuper) - Number(left.isSuper);
  });

  const rosterProfiles = ownerSimple
    ? orderedProfiles.filter((profile) => !profile.isSuper)
    : orderedProfiles;

  return (
    <aside
      aria-label={t("owner.yourTeam")}
      className={cn(
        "owner-team-sidebar flex h-full shrink-0 flex-col overflow-hidden border-border/50 border-r bg-muted/30",
        ownerSimple && "owner-simple-ui",
        drawer ? "w-full border-r-0" : "w-[240px] lg:w-[280px]"
      )}
      data-variant={variant}
    >
      <OwnerCreateAgentDialog onOpenChange={setCreateOpen} open={createOpen} />
      {deleteTarget ? (
        <ConfirmDialog
          confirmLabel={t("owner.deleteChat")}
          description={
            <span className="space-y-2">
              <span className="block font-medium text-destructive">
                {t("owner.deleteDanger")}
              </span>
              <span className="block">
                {t("owner.deleteChatBody", { name: deleteTarget.name })}
              </span>
            </span>
          }
          onClose={() => setDeleteTarget(null)}
          onConfirm={async () => {
            const removedId = deleteTarget.id;

            try {
              await deleteProfile.mutateAsync(removedId);
            } catch (error) {
              throw new Error(formatError(error));
            }

            if (activeProfileId === removedId) {
              const next = profiles.find((profile) => profile.id !== removedId);

              if (next) {
                selectProfile(next.id);
              }
            }
          }}
          title={t("owner.deleteChatTitle", { name: deleteTarget.name })}
        />
      ) : null}

      <div className="flex h-[60px] shrink-0 items-center justify-between gap-1 px-3">
        <h1 className="min-w-0 flex-1 truncate font-semibold text-foreground text-sm">
          {t("owner.yourTeam")}
        </h1>
        <div className="flex shrink-0 items-center gap-0.5">
          <IconTip label={t("owner.addAgent")}>
            <button
              aria-label={t("owner.addAgent")}
              className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              onClick={() => {
                setCreateOpen(true);
                onNavigate?.();
              }}
              type="button"
            >
              <PlusSignIcon aria-hidden="true" className="size-4" />
            </button>
          </IconTip>
          {onHide ? (
            <IconTip label={t("owner.hideSidebar")}>
              <button
                aria-label={t("owner.hideSidebar")}
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground",
                  !drawer && "lg:hidden"
                )}
                onClick={onHide}
                type="button"
              >
                <PanelLeftCloseIcon aria-hidden="true" className="size-4" />
              </button>
            </IconTip>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
        {rosterProfiles.length === 0 && groups.length === 0 ? (
          <p className="px-3 py-6 text-muted-foreground text-sm">
            {t("owner.emptyTeam")}
          </p>
        ) : null}

        <ul className="flex flex-col gap-0.5">
          {rosterProfiles.map((profile) => (
            <li key={profile.id}>
              <AgentRow
                active={openGroupId === null && activeProfileId === profile.id}
                largeType={ownerSimple}
                muteLabel={t("owner.mute")}
                onDelete={() => setDeleteTarget(profile)}
                onSelect={() => {
                  onNavigate?.();
                  selectProfile(profile.id);
                }}
                onToggleMute={() => {
                  setAgentChatMuted(profile.id, !isAgentChatMuted(profile.id));
                }}
                onTogglePin={() => {
                  togglePin({
                    itemId: profile.id,
                    pinned: !pinRank.has(profile.id),
                  });
                }}
                pinLabel={
                  pinRank.has(profile.id) ? t("owner.unpin") : t("owner.pin")
                }
                pinned={pinRank.has(profile.id)}
                profile={profile}
                removeLabel={t("owner.removeChat")}
                roleSubtitle={t(ownerAgentSubtitleMessageKey(profile))}
                unmuteLabel={t("owner.unmute")}
              />
            </li>
          ))}
        </ul>

        {!ownerSimple && groups.length > 0 ? (
          <div className="mt-4">
            <p className="px-3 pb-1 font-medium text-2xs text-muted-foreground uppercase tracking-wide">
              {t("owner.groups")}
            </p>
            <ul className="flex flex-col gap-0.5">
              {groups.map((group) => (
                <li key={group.id}>
                  <GroupRow
                    active={openGroupId === group.id}
                    agentsCountLabel={t("owner.agentsCount", {
                      count: group.memberIds.length,
                    })}
                    group={group}
                    onNavigate={onNavigate}
                    profiles={orderedProfiles}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="shrink-0 border-border/50 border-t px-2 pt-2 pb-3">
        {ownerSimple ? null : (
          <>
            <OwnerFooterLink
              active={location.pathname.startsWith(PAGE_PATHS.marketplace)}
              href={PAGE_PATHS.marketplace}
              icon={Store01Icon}
              label={t("owner.marketplace")}
              onNavigate={onNavigate}
            />
            <OwnerFooterLink
              active={location.pathname.startsWith(PAGE_PATHS.automations)}
              href={pathForPage("automations")}
              icon={Calendar03Icon}
              label={t("owner.automations")}
              onNavigate={onNavigate}
            />
          </>
        )}
        <OwnerFooterLink
          active={location.pathname.startsWith(PAGE_PATHS.settings)}
          href={pathForPage("settings")}
          icon={Settings01Icon}
          label={t("owner.settings")}
          largeType={ownerSimple}
          onNavigate={onNavigate}
        />
        {ownerSimple ? null : (
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-muted-foreground text-sm transition-colors hover:bg-background/70 hover:text-foreground"
            onClick={() => {
              setUiMode("advanced");
              onNavigate?.();
            }}
            type="button"
          >
            <DashboardSquare01Icon
              aria-hidden="true"
              className="size-4 shrink-0"
            />
            {t("owner.advanced")}
          </button>
        )}
        <div className="mt-2 flex items-center justify-between gap-2 px-2">
          <p className="truncate text-muted-foreground text-xs">
            {activeOrg?.name ?? t("owner.organization")}
          </p>
          <SidebarUserMenu />
        </div>
      </div>
    </aside>
  );
}

function IconTip({
  label,
  children,
}: {
  label: string;
  children: ReactElement;
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent side="right" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function useMuted(profileId: string): boolean {
  const [muted, setMuted] = useState(() => isAgentChatMuted(profileId));

  useEffect(() => {
    const sync = () => setMuted(isAgentChatMuted(profileId));
    sync();
    window.addEventListener("airin:agent-chat-mute-changed", sync);

    return () => {
      window.removeEventListener("airin:agent-chat-mute-changed", sync);
    };
  }, [profileId]);

  return muted;
}

function AgentRow({
  profile,
  active,
  largeType = false,
  onSelect,
  onTogglePin,
  onToggleMute,
  onDelete,
  pinned,
  pinLabel,
  muteLabel,
  unmuteLabel,
  removeLabel,
  roleSubtitle,
}: {
  profile: ProfileSummary;
  active: boolean;
  largeType?: boolean;
  onSelect: () => void;
  onTogglePin: () => void;
  onToggleMute: () => void;
  onDelete: () => void;
  pinned: boolean;
  pinLabel: string;
  muteLabel: string;
  unmuteLabel: string;
  removeLabel: string;
  roleSubtitle: string;
}) {
  const muted = useMuted(profile.id);

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="flex w-full">
        <button
          aria-current={active ? "page" : undefined}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-xl px-2 text-left transition-colors",
            largeType ? "min-h-12 py-2.5" : "py-2",
            active ? "bg-background shadow-sm" : "hover:bg-background/70"
          )}
          onClick={onSelect}
          type="button"
        >
          <ProfileAvatar
            className={cn("shrink-0", largeType ? "size-10" : "size-9")}
            profile={profile}
            size="md"
          />
          <span className="min-w-0 flex-1">
            <span className="flex min-w-0 items-center gap-1.5">
              <span
                className={cn(
                  "block truncate font-medium text-foreground",
                  largeType ? "text-base" : "text-sm"
                )}
              >
                {profile.name}
              </span>
              {pinned ? (
                <PinIcon
                  aria-hidden="true"
                  className="size-3 shrink-0 text-muted-foreground/70"
                />
              ) : null}
              {muted ? (
                <NotificationOff01Icon
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-muted-foreground/55"
                />
              ) : null}
            </span>
            <span
              className={cn(
                "block truncate text-muted-foreground leading-snug",
                largeType ? "text-xs" : "text-2xs"
              )}
              title={roleSubtitle}
            >
              {roleSubtitle}
            </span>
          </span>
        </button>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner className="isolate z-50 outline-none">
          <ContextMenu.Popup className="z-50 min-w-44 rounded-lg bg-popover p-1 text-popover-foreground shadow-md outline-none ring-1 ring-foreground/10">
            <DropdownMenuItem onClick={onTogglePin}>
              {pinned ? <PinOffIcon /> : <PinIcon />}
              {pinLabel}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleMute}>
              <NotificationOff01Icon />
              {muted ? unmuteLabel : muteLabel}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} variant="destructive">
              <Delete02Icon />
              {removeLabel}
            </DropdownMenuItem>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}

function GroupRow({
  group,
  active,
  onNavigate,
  profiles,
  agentsCountLabel,
}: {
  group: AgentGroup;
  active: boolean;
  onNavigate?: () => void;
  profiles: ProfileSummary[];
  agentsCountLabel: string;
}) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl px-2 py-2 transition-colors",
        active ? "bg-background shadow-sm" : "hover:bg-background/70"
      )}
      onClick={() => onNavigate?.()}
      to={groupPath(group.id)}
    >
      <GroupAvatar
        className="size-9 shrink-0"
        group={group}
        profiles={profiles}
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-foreground text-sm">
          {group.name}
        </span>
        <span className="block truncate text-muted-foreground text-xs">
          {agentsCountLabel}
        </span>
      </span>
    </Link>
  );
}

function OwnerFooterLink({
  href,
  label,
  icon: Icon,
  active,
  largeType = false,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: typeof Store01Icon;
  active: boolean;
  largeType?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors",
        largeType ? "min-h-11 text-base" : "text-sm",
        active
          ? "bg-background font-medium text-foreground shadow-sm"
          : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
      )}
      onClick={() => onNavigate?.()}
      to={href}
    >
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      {label}
    </Link>
  );
}
