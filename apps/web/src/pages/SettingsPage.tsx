import { DEMO_LOGIN_HOST } from "@airin/core/demo-login";
import { Button } from "@airin/ui/button";
import { Card, CardContent } from "@airin/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@airin/ui/dialog";
import { Spinner } from "@airin/ui/spinner";
import { Switch } from "@airin/ui/switch";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ComposioSettingsCard } from "@/components/ComposioSettingsCard";
import { LanguageToggle } from "@/components/LanguageToggle";
import { LocalAuthTokenCard } from "@/components/LocalAuthTokenCard";
import { WebPushToggle } from "@/components/notifications/web-push-toggle";
import { BrowserRuntimeSettingsCard } from "@/components/settings/BrowserRuntimeSettingsCard";
import { BrowserSessionsCard } from "@/components/settings/BrowserSessionsCard";
import { DataPortabilityPanel } from "@/components/settings/DataPortabilityPanel";
import { ImageGenerationSettingsCard } from "@/components/settings/ImageGenerationSettingsCard";
import { MfaSettingsCard } from "@/components/settings/MfaSettingsCard";
import { PlatformMfaSettingsCard } from "@/components/settings/PlatformMfaSettingsCard";
import { ProviderSettingsCard } from "@/components/settings/ProviderSettingsCard";
import { TranscriptionSettingsCard } from "@/components/settings/TranscriptionSettingsCard";
import { VersionSettingsRow } from "@/components/settings/VersionSettingsRow";
import { VisionSettingsCard } from "@/components/settings/VisionSettingsCard";
import { WebPublicUrlSettingsRow } from "@/components/settings/WebPublicUrlSettingsRow";
import { WebSearchSettingsCard } from "@/components/settings/WebSearchSettingsCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TimezoneSelect } from "@/components/TimezoneSelect";
import { UserContextSettings } from "@/components/UserContextCard";
import { useAppContext } from "@/context/use-app-context";
import { useAuth } from "@/context/use-auth";
import { useLocale } from "@/context/use-locale";
import { useChatUsageVisible } from "@/hooks/use-chat-usage-visible";
import { useSaveUserLanguage, useUserLanguage } from "@/hooks/use-language";
import { useSaveUserTimezone, useUserTimezone } from "@/hooks/use-timezones";
import { formatError } from "@/lib/client";
import type { AppLocale } from "@/lib/locale";
import { needsMfaEnrollment } from "@/lib/mfa";
import { getBrowserTimezone } from "@/lib/timezones";

function isDemoLoginHost(
  hostname: string = typeof window === "undefined"
    ? ""
    : window.location.hostname
): boolean {
  return hostname.trim().toLowerCase() === DEMO_LOGIN_HOST;
}

export function SettingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { health } = useAppContext();
  const isDemo = isDemoLoginHost();
  const isPlatformAdmin = user?.isPlatformAdmin === true;

  const [mfaRequiredNotice, setMfaRequiredNotice] = useState(
    () => new URLSearchParams(location.search).get("mfa") === "required"
  );

  const chatUsage = useChatUsageVisible();
  const version = health?.version?.trim();
  const { t } = useLocale();
  const mfaPending = needsMfaEnrollment(user);

  return (
    <>
      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setMfaRequiredNotice(false);
            navigate("/settings/preferences", { replace: true });
          }
        }}
        open={mfaRequiredNotice}
      >
        {mfaRequiredNotice ? (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Multi-factor authentication required</DialogTitle>
              <DialogDescription>
                Your platform requires multi-factor authentication. Set up an
                authenticator app below to continue using Airin.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => {
                  setMfaRequiredNotice(false);
                  navigate("/settings/preferences", { replace: true });
                }}
                type="button"
              >
                Set up authentication
              </Button>
            </DialogFooter>
          </DialogContent>
        ) : null}
      </Dialog>
      <div className="mx-auto max-w-3xl space-y-10">
        {mfaPending ? (
          <SettingsSection title={t("settings.security")}>
            <Card className="w-full shadow-none">
              <CardContent className="px-4 py-3">
                <p className="text-foreground text-sm">
                  Multi-factor authentication is required on this platform. Set
                  up a passkey or authenticator app below to continue.
                </p>
              </CardContent>
            </Card>
            <MfaSettingsCard />
            <section id="sessions">
              <BrowserSessionsCard />
            </section>
          </SettingsSection>
        ) : (
          <SettingsSection title={t("settings.general")}>
            <Card className="w-full shadow-none">
              <CardContent className="divide-y divide-border p-0">
                <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 px-4 py-3">
                  <p className="text-foreground text-sm">
                    {t("settings.appearance")}
                  </p>
                  <ThemeToggle />
                </div>

                <LanguageSettingsRow />

                <UserContextSettings />

                <div
                  className="flex min-h-14 flex-wrap items-center justify-between gap-3 px-4 py-3"
                  id="chat-usage-setting"
                >
                  <p className="text-foreground text-sm">
                    {t("settings.tokenUsage")}
                  </p>
                  <Switch
                    aria-label={t("settings.tokenUsage")}
                    checked={chatUsage.visible}
                    onCheckedChange={chatUsage.toggle}
                  />
                </div>

                <div className="px-2.5 py-2" id="notifications-setting">
                  <p className="mb-1 px-1.5 text-foreground text-sm">
                    {t("settings.notifications")}
                  </p>
                  <WebPushToggle showTest />
                </div>
              </CardContent>
            </Card>

            <section id="sessions">
              <BrowserSessionsCard />
            </section>

            <MfaSettingsCard />
          </SettingsSection>
        )}

        {!mfaPending && (version || isPlatformAdmin) ? (
          <InstanceSettings
            isDemo={isDemo}
            isPlatformAdmin={isPlatformAdmin}
            updateCheckEnabled={health?.updateCheckEnabled === true}
            version={version}
          />
        ) : null}
      </div>
    </>
  );
}

export function LanguageSettingsRow() {
  const { locale, setLocale, t } = useLocale();
  const [hint, setHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data: savedLanguage } = useUserLanguage();
  const saveLanguageMutation = useSaveUserLanguage();
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (!savedLanguage || hydratedRef.current) {
      return;
    }

    hydratedRef.current = true;
    setLocale(savedLanguage);
  }, [savedLanguage, setLocale]);

  useEffect(() => {
    if (!hint) {
      return;
    }

    const timeout = window.setTimeout(() => setHint(null), 2500);

    return () => window.clearTimeout(timeout);
  }, [hint]);

  const handleChange = useCallback(
    (next: AppLocale) => {
      const previous = locale;
      setError(null);
      setHint(null);
      setLocale(next);

      saveLanguageMutation.mutate(next, {
        onError: (err) => {
          setLocale(savedLanguage ?? previous);
          setError(formatError(err));
        },
        onSuccess: (saved) => {
          setLocale(saved);
          setHint(t("settings.saved"));
        },
      });
    },
    [locale, saveLanguageMutation, savedLanguage, setLocale, t]
  );

  return (
    <div
      aria-busy={saveLanguageMutation.isPending || undefined}
      className="flex min-h-14 flex-wrap items-center justify-between gap-3 px-4 py-3"
    >
      <div className="min-w-0 space-y-0.5">
        <p className="text-foreground text-sm">{t("settings.language")}</p>
        <p className="text-muted-foreground text-xs">
          {t("settings.languageHint")}
        </p>
        {error ? (
          <p className="text-destructive text-xs" role="alert">
            {error}
          </p>
        ) : null}
        {hint ? (
          <p
            className="text-emerald-700 text-xs dark:text-emerald-300"
            role="status"
          >
            {hint}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        {saveLanguageMutation.isPending ? (
          <Spinner className="size-4 text-muted-foreground" />
        ) : null}
        <LanguageToggle
          disabled={saveLanguageMutation.isPending}
          onSelect={handleChange}
        />
      </div>
    </div>
  );
}

export function TimezoneSettingsRow() {
  const { t } = useLocale();
  const [timezone, setTimezone] = useState(() => getBrowserTimezone());
  const [hint, setHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data: savedTimezone } = useUserTimezone();
  const saveTimezoneMutation = useSaveUserTimezone();

  useEffect(() => {
    if (savedTimezone) {
      setTimezone(savedTimezone);
    }
  }, [savedTimezone]);

  useEffect(() => {
    if (!hint) {
      return;
    }

    const timeout = window.setTimeout(() => setHint(null), 2500);

    return () => window.clearTimeout(timeout);
  }, [hint]);

  const handleChange = useCallback(
    (nextTimezone: string) => {
      setError(null);
      setHint(null);
      setTimezone(nextTimezone);

      saveTimezoneMutation.mutate(nextTimezone, {
        onError: (err) => {
          // Show the value that is still saved, so picking again retries.
          setTimezone(savedTimezone ?? getBrowserTimezone());
          setError(formatError(err));
        },
        onSuccess: (saved) => {
          setTimezone(saved);
          setHint(t("settings.saved"));
        },
      });
    },
    [saveTimezoneMutation, savedTimezone, t]
  );

  return (
    <div
      aria-busy={saveTimezoneMutation.isPending || undefined}
      className="flex min-h-14 flex-wrap items-center justify-between gap-3 px-4 py-3"
    >
      <div className="min-w-0 space-y-0.5">
        <p className="text-foreground text-sm">{t("settings.timezone")}</p>
        {error ? (
          <p className="text-destructive text-xs" role="alert">
            {error}
          </p>
        ) : null}
        {hint ? (
          <p
            className="text-emerald-700 text-xs dark:text-emerald-300"
            role="status"
          >
            {hint}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        {saveTimezoneMutation.isPending ? (
          <Spinner className="size-4 text-muted-foreground" />
        ) : null}
        <TimezoneSelect
          className="w-44 min-w-0 sm:w-52"
          emptyLabel="Select timezone"
          id="timezone"
          onValueChange={(nextTimezone) => {
            if (
              nextTimezone &&
              nextTimezone !== timezone &&
              !saveTimezoneMutation.isPending
            ) {
              handleChange(nextTimezone);
            }
          }}
          value={timezone}
        />
      </div>
    </div>
  );
}

function InstanceSettings({
  isDemo,
  isPlatformAdmin,
  updateCheckEnabled,
  version,
}: {
  isDemo: boolean;
  isPlatformAdmin: boolean;
  updateCheckEnabled: boolean;
  version: string | undefined;
}) {
  const { t } = useLocale();

  return (
    <SettingsSection title={t("settings.instance")}>
      <Card className="w-full shadow-none">
        <CardContent className="divide-y divide-border p-0">
          {version ? (
            <VersionSettingsRow
              updateCheckEnabled={updateCheckEnabled}
              version={version}
            />
          ) : null}

          {isPlatformAdmin ? <TimezoneSettingsRow /> : null}

          {/* Install-wide: the callback/share base for every organization. */}
          {isPlatformAdmin ? <WebPublicUrlSettingsRow /> : null}

          {isPlatformAdmin ? (
            <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 px-4 py-3">
              <p className="text-foreground text-sm">Platform overview</p>
              <Link
                className="text-primary text-sm underline-offset-4 hover:underline"
                to="/platform"
              >
                Open
              </Link>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {!isDemo && isPlatformAdmin ? <PlatformMfaSettingsCard /> : null}

      {/* The rotate route needs a platform admin. */}
      {isPlatformAdmin ? (
        <section id="local-token">
          <LocalAuthTokenCard />
        </section>
      ) : null}

      {isPlatformAdmin ? (
        <section id="composio">
          <ComposioSettingsCard />
        </section>
      ) : null}

      {isPlatformAdmin ? (
        <Card className="w-full overflow-hidden shadow-none">
          <CardContent className="p-0">
            <DataPortabilityPanel />
          </CardContent>
        </Card>
      ) : null}
    </SettingsSection>
  );
}

function SettingsSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  const headingId = `settings-section-${title.toLowerCase()}`;

  return (
    <section aria-labelledby={headingId} className="space-y-3">
      <h2
        className="type-section-title font-medium text-muted-foreground"
        id={headingId}
      >
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function LlmProvidersPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const [addProviderOpen, setAddProviderOpen] = useState(false);
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    }
  }, [hash]);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <ProviderSettingsCard
        addOpen={addProviderOpen}
        formError={formError}
        onAddOpenChange={setAddProviderOpen}
        onFormError={setFormError}
      />
      <section aria-labelledby="routing-heading" className="space-y-3">
        <h2
          className="font-semibold text-foreground text-sm"
          id="routing-heading"
        >
          Routing
        </h2>
        <div className="overflow-hidden rounded-xl border border-border">
          <div
            aria-hidden
            className="flex justify-between gap-3 bg-muted/40 px-4 py-2.5 text-muted-foreground text-xs"
          >
            <span>Task</span>
            <span className="hidden gap-2 sm:grid sm:w-[25rem] sm:grid-cols-2">
              <span>Provider</span>
              <span>Model</span>
            </span>
          </div>
          <div className="divide-y divide-border border-border border-t">
            <div id="image-parsing">
              <VisionSettingsCard />
            </div>
            <div id="transcription">
              <TranscriptionSettingsCard
                onAddProvider={() => setAddProviderOpen(true)}
              />
            </div>
            <div id="image-generation">
              <ImageGenerationSettingsCard />
            </div>
            <div id="web-search">
              <WebSearchSettingsCard />
            </div>
            <div id="browser-runtime">
              <BrowserRuntimeSettingsCard />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
