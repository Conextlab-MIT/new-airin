import { cn } from "@airin/ui/utils";
import { useLocale } from "@/context/use-locale";
import type { AppLocale } from "@/lib/locale";

const LANGUAGE_OPTIONS: { id: AppLocale; label: string }[] = [
  { id: "id", label: "ID" },
  { id: "en", label: "EN" },
];

export function LanguageToggle({
  disabled = false,
  onSelect,
}: {
  disabled?: boolean;
  onSelect?: (locale: AppLocale) => void;
} = {}) {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex gap-0.5 rounded-lg bg-muted p-0.5">
      {LANGUAGE_OPTIONS.map((option) => {
        const selected = option.id === locale;

        return (
          <button
            aria-pressed={selected}
            className={cn(
              "flex h-8 min-w-10 items-center justify-center rounded-md px-3 text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
              selected
                ? "bg-background font-medium text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            disabled={disabled}
            key={option.id}
            onClick={() => {
              if (option.id === locale) {
                return;
              }

              setLocale(option.id);
              onSelect?.(option.id);
            }}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
