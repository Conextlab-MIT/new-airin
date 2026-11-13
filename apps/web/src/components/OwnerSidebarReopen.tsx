import { Button } from "@airin/ui/button";
import { cn } from "@airin/ui/utils";
import { PanelLeftOpenIcon } from "hugeicons-react";
import { useLocale } from "@/context/use-locale";
import { useOwnerSidebarHidden } from "@/hooks/use-sidebar-collapsed";

/**
 * Shows the Owner team sidebar again on tablet after Hide. Phones use the
 * nav drawer instead (`MobileNavDrawer`).
 */
export function OwnerSidebarReopen({ className }: { className?: string }) {
  const { collapsed: hidden, toggle } = useOwnerSidebarHidden();
  const { t } = useLocale();

  if (!hidden) {
    return null;
  }

  return (
    <Button
      aria-label={t("owner.showSidebar")}
      className={cn(
        "hidden shrink-0 text-muted-foreground sm:inline-flex lg:hidden",
        className
      )}
      onClick={toggle}
      size="icon-sm"
      title={t("owner.showSidebar")}
      type="button"
      variant="ghost"
    >
      <PanelLeftOpenIcon aria-hidden="true" className="size-4" />
    </Button>
  );
}
