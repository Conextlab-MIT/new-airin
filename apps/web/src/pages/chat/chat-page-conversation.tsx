import { formatAgentQuestionnaireAnswersMessage } from "@airin/core/agent-questionnaire";
import { cn } from "@airin/ui/utils";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { ArtifactStreamingPanelBridge } from "@/components/chat/artifact-streaming-panel-bridge";
import { BrowserLiveViewPanelBridge } from "@/components/chat/browser-live-view-panel-bridge";
import {
  ChatMessageList,
  type SaveCaseReply,
} from "@/components/chat/chat-message-list";
import type { AgentActivity } from "@/components/moodstone";
import { OwnerSidebarReopen } from "@/components/OwnerSidebarReopen";
import { SaveRegressionCaseDialog } from "@/components/regression-cases";
import { UserContextEditorDialog } from "@/components/UserContextCard";
import { ChatAttachmentPanelProvider } from "@/context/chat-attachment-panel-context";
import { useAuth } from "@/context/use-auth";
import type { ChatListItem } from "@/lib/chat-history";
import { canAccessIntegrationsPage } from "@/lib/navigation";
import { ChatBusinessTypePrompt } from "@/pages/chat/chat-business-onboarding";
import {
  ChatGoalPrompt,
  ChatSetupChecklist,
  ChatSetupFinding,
  ChatSetupPill,
} from "@/pages/chat/chat-onboarding";
import { LAUNDRY_GOAL_OPTIONS } from "@/pages/chat/chat-onboarding-goals";
import { deriveAgentActivity } from "@/pages/chat/chat-page.shared";
import { ChatPageColumn, ChatSessionBar } from "@/pages/chat/chat-page-layout";
import {
  ChatStatusArtifactOpener,
  ChatStatusButton,
  ChatStatusProvider,
} from "@/pages/chat/chat-status-panel";
import type { Onboarding } from "@/pages/chat/use-chat-onboarding";
import type { ChatPageState } from "@/pages/chat/use-chat-page";

/** Long enough to see the celebration, short enough not to look stuck. */
const DONE_ACTIVITY_MS = 2400;

function useAgentActivity(
  busy: boolean,
  messages: ChatListItem[],
  lastSuccessfulTurnAt: number | null,
  sessionId: string
): AgentActivity {
  const [celebrating, setCelebrating] = useState(false);
  const seen = useRef({ sessionId, turnAt: lastSuccessfulTurnAt });

  useEffect(() => {
    // The timestamp survives a session change: opening another chat must not
    // replay the flash of the one that just finished.
    if (seen.current.sessionId !== sessionId) {
      seen.current = { sessionId, turnAt: lastSuccessfulTurnAt };
      setCelebrating(false);

      return;
    }

    if (
      lastSuccessfulTurnAt === null ||
      seen.current.turnAt === lastSuccessfulTurnAt
    ) {
      return;
    }

    seen.current.turnAt = lastSuccessfulTurnAt;
    setCelebrating(true);
    const timer = setTimeout(() => setCelebrating(false), DONE_ACTIVITY_MS);

    return () => clearTimeout(timer);
  }, [lastSuccessfulTurnAt, sessionId]);

  return useMemo(
    () => deriveAgentActivity(busy, messages, celebrating),
    [busy, messages, celebrating]
  );
}

/** Swaps the welcome and composer for the onboarding step that is active. */
export function EmptyChatBody({
  children,
  onboarding,
}: {
  children: ReactNode;
  onboarding: Onboarding;
}) {
  const dialog = (
    <UserContextEditorDialog
      onOpenChange={onboarding.setAboutYouOpen}
      onSaved={onboarding.markAboutYouSaved}
      open={onboarding.aboutYouOpen}
    />
  );

  switch (onboarding.view) {
    case "business-type":
      return (
        <ChatBusinessTypePrompt
          error={onboarding.businessTypeError}
          onPickLaundry={() => onboarding.pickBusinessType("laundry")}
          onPickOther={() => onboarding.pickBusinessType("generic")}
          onSkip={onboarding.skipBusinessType}
          pending={onboarding.businessTypePending}
        />
      );
    case "goal": {
      const laundryGoals = onboarding.businessVertical === "laundry";

      return (
        <ChatGoalPrompt
          error={onboarding.goalError}
          goalOptions={laundryGoals ? LAUNDRY_GOAL_OPTIONS : undefined}
          onSave={onboarding.saveGoal}
          onSkip={onboarding.skipGoal}
          saving={onboarding.savingGoal}
          subtitle={
            laundryGoals
              ? "Examples tuned for laundry shops — pick one or type your own."
              : undefined
          }
          title={
            laundryGoals ? "What should we tackle first?" : "What is your goal?"
          }
        />
      );
    }
    case "finding":
      return <ChatSetupFinding goal={onboarding.goal} />;
    case "checklist":
      return (
        <>
          <ChatSetupChecklist
            busyKey={onboarding.busyKey}
            error={onboarding.actionError}
            goal={onboarding.goal}
            onAction={onboarding.runAction}
            onFinish={onboarding.finish}
            onSkipRest={onboarding.skipRest}
            rows={onboarding.rows}
          />
          {dialog}
        </>
      );
    default:
      return (
        <>
          {onboarding.pill ? (
            <ChatSetupPill
              done={onboarding.pill.done}
              onOpen={onboarding.openChecklist}
              total={onboarding.pill.total}
            />
          ) : null}
          {children}
        </>
      );
  }
}

// oxlint-disable-next-line react-doctor/no-high-complexity-react-function -- Session chrome, message list, and composer share one layout tree.
export function ChatConversation({
  below,
  cognitoControl,
  cognitoSurface,
  cognitoToggle,
  composer,
  onSwitchModel,
  ownerAgentSettingsButton,
  ownerMode,
  showSessionBar,
  showUsage,
  state,
}: {
  below?: ReactNode;
  cognitoControl: ReactNode;
  cognitoSurface: boolean;
  ownerAgentSettingsButton?: ReactNode;
  ownerMode: boolean;
  cognitoToggle: ReactNode;
  composer: ReactNode;
  onSwitchModel: () => void;
  showSessionBar: boolean;
  showUsage: boolean;
  state: ChatPageState;
}) {
  const {
    activeProfile,
    agentQuestionnaire,
    branchingMessageId,
    busy,
    cognito,
    contextUsage,
    currentModelSelection,
    handleBranchMessage,
    handleEditMessage,
    handleTryAgainMessage,
    lastSuccessfulTurnAt,
    messages,
    profileId,
    queuedMessages,
    readOnlySession,
    renderModelLabel,
    sendMessage,
    session,
    sessionChannel,
    showThinking,
    turnStartedAt,
  } = state;

  const agentActivity = useAgentActivity(
    busy,
    messages,
    lastSuccessfulTurnAt,
    session?.id ?? "new"
  );

  const { caseTarget, openCase, setCaseDraft } = useChatCaseDraft(
    session?.id,
    profileId,
    cognito
  );

  // Cognito chats are not kept, so neither is their open panel.
  const rememberId = session && !cognito ? session.id : undefined;
  const modelLabel = renderModelLabel(currentModelSelection);

  const statusData = useMemo(
    () => ({
      busy,
      channel: sessionChannel,
      contextUsage,
      messages,
      modelLabel,
      profile: activeProfile,
      profileId,
    }),
    [
      activeProfile,
      busy,
      contextUsage,
      messages,
      modelLabel,
      profileId,
      sessionChannel,
    ]
  );

  return (
    <ChatStatusProvider data={statusData} key={session?.id ?? "new"}>
      <ChatAttachmentPanelProvider
        below={below}
        key={session?.id ?? "new"}
        rememberId={rememberId}
      >
        <ArtifactStreamingPanelBridge
          messages={messages}
          profileId={profileId}
        />
        <ChatStatusArtifactOpener />
        <BrowserLiveViewPanelBridge
          messages={messages}
          sessionId={session?.id}
        />
        <ChatPageColumn
          cognito={cognitoSurface}
          wallpaper={ownerMode && !cognitoSurface}
        >
          {cognitoControl}
          {session && showSessionBar ? (
            <ChatSessionBar
              actions={
                <>
                  {ownerAgentSettingsButton}
                  {cognitoToggle}
                  <ChatStatusButton />
                </>
              }
              activity={agentActivity}
              cognito={cognito}
              profile={activeProfile}
              profileId={profileId}
              sessionId={session.id}
            />
          ) : null}
          <div className="mx-auto flex min-h-0 w-full flex-1 flex-col">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <ChatMessageList
                actionsDisabled={busy || readOnlySession}
                branchingMessageId={branchingMessageId}
                contentClassName="mx-auto w-full max-w-3xl px-4"
                messages={messages}
                modelLabel={
                  currentModelSelection
                    ? renderModelLabel(currentModelSelection)
                    : null
                }
                onBranchMessage={(message) => void handleBranchMessage(message)}
                onContinueToolSetup={async (setupId) => {
                  await sendMessage(
                    `Build the approved tool setup ${setupId}. Use this setupId with create_tool to connect the saved credentials and selected agent.`,
                    []
                  );
                }}
                onEditMessage={(message, text) =>
                  void handleEditMessage(message, text)
                }
                onRetryMessage={(message) =>
                  void handleTryAgainMessage(message)
                }
                onSaveAsCase={
                  caseTarget
                    ? (reply) =>
                        setCaseDraft({
                          ...reply,
                          sessionId: caseTarget.sessionId,
                        })
                    : undefined
                }
                onSubmitQuestionnaire={(answers) => {
                  void sendMessage(
                    formatAgentQuestionnaireAnswersMessage(answers),
                    [],
                    { questionnaireAnswers: answers }
                  );
                }}
                onSwitchModel={onSwitchModel}
                profileId={profileId}
                questionnaire={
                  !busy && queuedMessages.length === 0
                    ? agentQuestionnaire
                    : null
                }
                sessionId={session?.id}
                showThinking={showThinking}
                showUsage={showUsage}
                streamActive={busy}
                turnStartedAt={turnStartedAt}
                workStreamActive={turnStartedAt !== null}
              />
            </div>

            <div
              className={cn(
                "sticky bottom-0 z-10 mt-auto w-full shrink-0 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pt-4 sm:pb-4",
                // Owner wallpaper must show through; Advanced keeps a soft fade.
                ownerMode
                  ? "bg-transparent"
                  : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85"
              )}
            >
              <div className="mx-auto w-full max-w-3xl">{composer}</div>
            </div>
          </div>
          {caseTarget && openCase ? (
            <SaveRegressionCaseDialog
              expectedResult={openCase.expectedResult}
              onOpenChange={(open) => {
                if (!open) {
                  setCaseDraft(null);
                }
              }}
              open
              profileId={caseTarget.profileId}
              source={{
                messageIndex: openCase.messageIndex,
                sourceId: caseTarget.sessionId,
                sourceType: "session",
              }}
            />
          ) : null}
        </ChatPageColumn>
      </ChatAttachmentPanelProvider>
    </ChatStatusProvider>
  );
}

/** The reply a member is saving as a test case, and where it saves. */
function useChatCaseDraft(
  sessionId: string | undefined,
  profileId: ChatPageState["profileId"],
  cognito: boolean
) {
  const { activeOrg } = useAuth();

  // Tied to the chat it came from: the page does not remount between chats.
  const [caseDraft, setCaseDraft] = useState<
    (SaveCaseReply & { sessionId: string }) | null
  >(null);

  // Cognito chats are never stored, so there is no run to save.
  const caseTarget =
    canAccessIntegrationsPage(activeOrg?.role) &&
    sessionId &&
    profileId &&
    !cognito
      ? { profileId, sessionId }
      : null;

  const openCase =
    caseDraft && caseDraft.sessionId === caseTarget?.sessionId
      ? caseDraft
      : null;

  return { caseTarget, openCase, setCaseDraft };
}

export function NewChatTopBar({
  actions,
  toggle,
}: {
  actions?: ReactNode;
  toggle: ReactNode;
}) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-1 border-border border-b bg-background px-4 max-sm:hidden">
      <OwnerSidebarReopen />
      <h1 className="truncate px-2 font-semibold text-[15px] tracking-tight">
        New chat
      </h1>
      {actions || toggle ? (
        <div className="ml-auto flex items-center gap-1">
          {actions}
          {toggle}
        </div>
      ) : null}
    </div>
  );
}
