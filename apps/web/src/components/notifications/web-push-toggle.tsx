import { Button } from "@airin/ui/button";
import { Switch } from "@airin/ui/switch";
import { toast } from "@airin/ui/toast";
import { Notification01Icon } from "hugeicons-react";
import { useState } from "react";
import { useLocale } from "@/context/use-locale";
import { useWebPush, webPushSupported } from "@/hooks/use-web-push";

export function WebPushToggle({
  showTest = false,
}: {
  showTest?: boolean;
} = {}) {
  const { busy, enabled, error, setPush } = useWebPush();
  const { t } = useLocale();
  const [testing, setTesting] = useState(false);

  if (!webPushSupported) {
    return (
      <p className="px-1.5 py-1.5 text-2xs text-muted-foreground leading-snug">
        This browser cannot show notifications. On iPhone, add Airin to the Home
        Screen first.
      </p>
    );
  }

  async function sendTestNotification() {
    setTesting(true);

    try {
      if ((await Notification.requestPermission()) !== "granted") {
        toast(
          "Notifications are blocked for this site. Allow them in the browser settings."
        );

        return;
      }

      const notification = new Notification("Airin", {
        body: t("settings.testNotificationBody"),
        tag: "airin-test-notification",
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      toast(t("settings.testNotificationSent"));
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="px-1.5 py-1.5" id="web-push-toggle">
      <div className="flex items-center gap-2">
        <Notification01Icon
          aria-hidden
          className="size-3.5 shrink-0 text-muted-foreground"
        />
        <label
          className="flex-1 text-foreground text-xs"
          htmlFor="web-push-switch"
        >
          {t("settings.notificationsHint")}
        </label>
        <Switch
          checked={enabled === true}
          disabled={busy || enabled === null}
          id="web-push-switch"
          onCheckedChange={(next) => {
            setPush(next).catch(() => undefined);
          }}
          size="sm"
        />
      </div>
      {error ? (
        <p className="mt-1 text-2xs text-destructive leading-snug">{error}</p>
      ) : null}
      {showTest ? (
        <div className="mt-2 flex justify-end">
          <Button
            disabled={testing || busy}
            onClick={() => {
              void sendTestNotification();
            }}
            size="sm"
            type="button"
            variant="outline"
          >
            {t("settings.testNotification")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
