import { hasActiveAgentQuestionnaire } from "@airin/core/agent-questionnaire";
import { Button } from "@airin/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@airin/ui/dialog";
import { Spinner } from "@airin/ui/spinner";
import { cn } from "@airin/ui/utils";
import { Settings01Icon } from "hugeicons-react";
import {
  lazy,
  type ReactNode,
  Suspense,
  useMemo,
  useRef,
  useState,
} from "react";
import { PromptInputProvider } from "@/components/ai-elements/prompt-input";
import { ChatCognitoControl } from "@/components/chat/chat-cognito-control";
import { ChatComposer } from "@/components/chat/chat-composer";
import { OwnerAgentSettingsDialog } from "@/components/OwnerAgentSettingsDialog";
import { ChatAttachmentPanelProvider } from "@/context/chat-attachment-panel-context";
import { useUiMode } from "@/context/use-ui-mode";
import { useChatUsageVisible } from "@/hooks/use-chat-usage-visible";
import { usePostTurnSkillReviewOverlay } from "@/hooks/use-post-turn-skill-review-overlay";
import { formatSessionChannelLabel } from "@/lib/chat-history";
import { sumChatUsage } from "@/lib/chat-usage";
import { extractModelId } from "@/lib/models";
import {
  emptyStateControlClass,
  shouldShowCognitoControl,
} from "@/pages/chat/chat-page.shared";
import {
  ChatConversation,
  EmptyChatBody,
  NewChatTopBar,
} from "@/pages/chat/chat-page-conversation";
import { ChatPageColumn, ChatWelcome } from "@/pages/chat/chat-page-layout";
import { ChatStatusButton } from "@/pages/chat/chat-status-panel";
import { useOnboarding } from "@/pages/chat/use-chat-onboarding";
import type { ChatPageState } from "@/pages/chat/use-chat-page";

const ProviderSetupForm = lazy(async () => ({
  default: (await import("@/components/ProviderSetupForm")).ProviderSetupForm,
}));

// oxlint-disable-next-line react-doctor/no-high-complexity-react-function -- Owner/Advanced empty vs active chat composition stays in one entry.
export function ChatPageContent({
  below,
  cognitoLocked = false,
  onBtw,
  ...state
}: ChatPageState & {
  below?: ReactNode;
  /** Cognito cannot be turned off here: no toggle, no cognito surface. */
  cognitoLocked?: boolean;
  onBtw?: (question: string) => void;
}) {
  const {
    session,
    messages,
    profileId,
    profiles,
    activeProfile,
    availableSkills,
    chatStatus,
    busy,
    lastSuccessfulTurnAt,
    canStop,
    error,
    composerDraftKey,
    composerEntry,
    queuedMessages,
    editQueuedMessage,
    removeQueuedMessage,
    sendQueuedMessageNow,
    showOfflineHint,
    health,
    providerModelGroups,
    currentModelSelection,
    activeModelSupportsVision,
    thinkingEffortVisible,
    thinkingEffort,
    thinkingEffortDisabled,
    thinkingEffortOptions,
    readOnlySession,
    isEmptyState,
    composerDisabled,
    sessionChannel,
    contextUsage,
    handleProfileSwitch,
    handleModelChange,
    handleThinkingEffortChange,
    renderModelLabel,
    cognito,
    handleCognitoChange,
    sendMessage,
    stopStreaming,
    agentTodos,
    agentQuestionnaire,
    promptHistoryRef,
  } = state;

  const [providerDialogOpen, setProviderDialogOpen] = useState(false);

  const onboarding = useOnboarding({
    cognito,
    cognitoLocked,
    isEmptyState,
    profileId,
    readOnlySession,
  });

  // A locked cognito chat looks like a normal one: it has no other mode.
  const cognitoSurface = cognito && !cognitoLocked;

  const cognitoToggle =
    !cognitoLocked && shouldShowCognitoControl(cognito, isEmptyState) ? (
      <ChatCognitoControl
        cognito={cognito}
        disabled={busy || readOnlySession}
        onCognitoChange={handleCognitoChange}
      />
    ) : null;

  // Pinned to the column's top-right corner, which is the top right of the
  // screen area. The backdrop keeps it readable over a scrolling transcript.
  const cognitoControl = (className?: string, extra?: ReactNode) =>
    cognitoToggle || extra ? (
      <div
        className={cn(
          "absolute top-2 right-3 z-20 rounded-full backdrop-blur sm:right-6",
          className
        )}
      >
        {cognitoToggle}
        {extra}
      </div>
    ) : null;

  const { visible: chatUsageSetting } = useChatUsageVisible();
  const sessionUsage = useMemo(() => sumChatUsage(messages), [messages]);

  const { banner: skillReviewBanner } = usePostTurnSkillReviewOverlay({
    lastSuccessfulTurnAt,
    profile: activeProfile,
    readOnlySession,
    sessionChannel,
    sessionId: session?.id ?? null,
  });

  const modelPickerTriggerRef = useRef<HTMLButtonElement>(null);
  const { uiMode } = useUiMode();
  const ownerMode = uiMode === "owner";
  const showUsage = !ownerMode && chatUsageSetting;
  const [agentSettingsOpen, setAgentSettingsOpen] = useState(false);

  const ownerAgentSettingsButton =
    ownerMode && activeProfile && !isEmptyState ? (
      <Button
        aria-label="Agent settings"
        className="text-muted-foreground"
        onClick={() => setAgentSettingsOpen(true)}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <Settings01Icon aria-hidden className="size-4" />
      </Button>
    ) : null;

  const readOnlyBanner = readOnlySession ? (
    <p className="mb-3 rounded-md border border-border bg-muted/40 px-3 py-2 text-muted-foreground text-sm">
      View-only {formatSessionChannelLabel(sessionChannel)} conversation. Reply
      from {formatSessionChannelLabel(sessionChannel)}.
    </p>
  ) : null;

  const composerClassName =
    isEmptyState && !error
      ? "z-10 py-0 [&>p:first-child]:min-h-0"
      : "z-10 py-0";

  const composerShared = {
    busy,
    canStop,
    chatStatus,
    className: composerClassName,
    disabled: composerDisabled,
    draftStorageKey: composerDraftKey,
    error,
    onEditQueuedMessage: editQueuedMessage,
    onRemoveQueuedMessage: removeQueuedMessage,
    onSendQueuedMessageNow: sendQueuedMessageNow,
    onStop: stopStreaming,
    onSubmit: (text: string, files: Parameters<typeof sendMessage>[1]) => {
      void sendMessage(text, files);
    },
    placeholder: isEmptyState
      ? ownerMode
        ? `Message ${activeProfile?.name ?? "agent"}`
        : composerEntry.placeholder
      : undefined,
    promptHistoryRef,
    queuedMessages,
    todos: hasActiveAgentQuestionnaire(agentQuestionnaire) ? [] : agentTodos,
  } as const;

  const composer = ownerMode ? (
    <>
      {readOnlyBanner}
      <ChatComposer
        {...composerShared}
        profileId={profileId}
        variant="minimal"
      />
    </>
  ) : (
    <>
      {readOnlyBanner}
      <ChatComposer
        {...composerShared}
        availableSkills={availableSkills}
        contextUsage={contextUsage}
        currentModelSelection={currentModelSelection}
        headerNotice={skillReviewBanner}
        modelPickerTriggerRef={modelPickerTriggerRef}
        onBtw={onBtw}
        onConnectProvider={() => setProviderDialogOpen(true)}
        onModelChange={handleModelChange}
        onThinkingEffortChange={handleThinkingEffortChange}
        primarySupportsVision={activeModelSupportsVision}
        profileId={profileId}
        profileModelId={extractModelId(currentModelSelection)}
        providerConfigured={health?.providerConfigured}
        providerModelGroups={providerModelGroups}
        renderModelLabel={renderModelLabel}
        sessionUsage={sessionUsage}
        showOfflineHint={showOfflineHint}
        showTips={isEmptyState}
        thinkingEffort={thinkingEffort}
        thinkingEffortDisabled={thinkingEffortDisabled}
        thinkingEffortOptions={thinkingEffortOptions}
        thinkingEffortVisible={thinkingEffortVisible}
      />
    </>
  );

  const content = isEmptyState ? (
    <ChatAttachmentPanelProvider below={below} key={session?.id ?? "new"}>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {cognitoSurface ? null : (
          <NewChatTopBar
            actions={ownerAgentSettingsButton}
            toggle={cognitoToggle}
          />
        )}
        <ChatPageColumn
          centered
          cognito={cognitoSurface}
          wallpaper={ownerMode && !cognitoSurface}
        >
          {cognitoControl(
            emptyStateControlClass(cognitoSurface),
            ownerMode ? ownerAgentSettingsButton : undefined
          )}
          <div className="mx-auto mb-12 flex w-full max-w-3xl flex-col gap-1">
            <EmptyChatBody onboarding={onboarding}>
              <ChatWelcome
                cognito={cognito}
                onProfileSwitch={handleProfileSwitch}
                ownerMode={ownerMode}
                profile={activeProfile}
                profileId={profileId}
                profileSwitchDisabled={busy}
                profiles={profiles}
              />
              {composer}
            </EmptyChatBody>
          </div>
        </ChatPageColumn>
      </div>
    </ChatAttachmentPanelProvider>
  ) : (
    <ChatConversation
      below={below}
      // The session bar is hidden on phones, so the status button sits here.
      cognitoControl={cognitoControl(
        "sm:hidden",
        <>
          {ownerAgentSettingsButton}
          <ChatStatusButton />
        </>
      )}
      cognitoSurface={cognitoSurface}
      cognitoToggle={cognitoToggle}
      composer={composer}
      onSwitchModel={() => modelPickerTriggerRef.current?.click()}
      ownerAgentSettingsButton={ownerAgentSettingsButton}
      ownerMode={ownerMode}
      showSessionBar={!cognitoLocked}
      showUsage={showUsage}
      state={state}
    />
  );

  return (
    <PromptInputProvider
      initialInput={composerEntry.initialInput}
      key={`${composerDraftKey}:${composerEntry.revision}`}
    >
      {content}
      {activeProfile ? (
        <OwnerAgentSettingsDialog
          onOpenChange={setAgentSettingsOpen}
          open={agentSettingsOpen}
          profile={activeProfile}
        />
      ) : null}
      <Dialog onOpenChange={setProviderDialogOpen} open={providerDialogOpen}>
        <DialogContent className="w-[min(96vw,56rem)] grid-cols-1 sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Connect provider</DialogTitle>
          </DialogHeader>
          <Suspense fallback={<Spinner className="size-6" />}>
            <ProviderSetupForm
              onSuccess={() => setProviderDialogOpen(false)}
              showHeading={false}
              submitLabel="Connect provider"
            />
          </Suspense>
        </DialogContent>
      </Dialog>
    </PromptInputProvider>
  );
}
