import { Button } from "@airin/ui/button";
import { Spinner } from "@airin/ui/spinner";
import { cn } from "@airin/ui/utils";
import { Home01Icon, Store01Icon } from "hugeicons-react";
import { useState } from "react";

export function ChatBusinessTypePrompt({
  error,
  onPickLaundry,
  onPickOther,
  onSkip,
  pending,
}: {
  error: string | null;
  onPickLaundry: () => void;
  onPickOther: () => void;
  onSkip: () => void;
  pending: boolean;
}) {
  return (
    <div className="fade-in-0 slide-in-from-top-1 flex animate-in flex-col gap-6 px-4 duration-300 motion-reduce:animate-none">
      <div className="space-y-2 text-center sm:text-left">
        <h2 className="font-semibold text-2xl text-foreground tracking-tight sm:text-3xl">
          What type of business do you run?
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          Airin sets up agents and examples for your industry. You can change
          this later in Personalisation.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <BusinessTypeCard
          busy={pending}
          description="Social, WhatsApp, stock, and location insights for laundry shops."
          icon={Home01Icon}
          label="Laundry"
          onSelect={onPickLaundry}
          recommended
        />
        <BusinessTypeCard
          busy={pending}
          description="General marketing, email, and research helpers."
          icon={Store01Icon}
          label="Other business"
          onSelect={onPickOther}
        />
      </div>

      {error ? (
        <p
          className="text-center text-destructive text-sm sm:text-left"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="flex justify-center sm:justify-end">
        <Button
          disabled={pending}
          onClick={onSkip}
          type="button"
          variant="ghost"
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
}

function BusinessTypeCard({
  busy,
  description,
  icon: Icon,
  label,
  onSelect,
  recommended = false,
}: {
  busy: boolean;
  description: string;
  icon: typeof Home01Icon;
  label: string;
  onSelect: () => void;
  recommended?: boolean;
}) {
  const [arm, setArm] = useState(false);

  return (
    <button
      className={cn(
        "relative flex min-h-[8.5rem] flex-col gap-3 rounded-2xl border bg-card p-5 text-left transition-colors",
        "hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        recommended ? "border-foreground/25" : "border-border"
      )}
      disabled={busy}
      onClick={onSelect}
      onPointerDown={() => setArm(true)}
      type="button"
    >
      {recommended ? (
        <span className="absolute top-3 right-3 rounded-full bg-foreground px-2 py-0.5 font-medium text-2xs text-background">
          Demo default
        </span>
      ) : null}
      <span className="flex size-11 items-center justify-center rounded-xl bg-muted text-foreground">
        {busy && arm ? (
          <Spinner className="size-5" />
        ) : (
          <Icon aria-hidden className="size-5" />
        )}
      </span>
      <span>
        <span className="block font-semibold text-base">{label}</span>
        <span className="mt-1 block text-muted-foreground text-sm leading-relaxed">
          {description}
        </span>
      </span>
    </button>
  );
}
