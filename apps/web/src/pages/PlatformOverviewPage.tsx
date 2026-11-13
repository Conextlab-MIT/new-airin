import { Button } from "@airin/ui/button";
import { buttonVariants } from "@airin/ui/button-variants";
import { Card, CardContent } from "@airin/ui/card";
import { Spinner } from "@airin/ui/spinner";
import { cn } from "@airin/ui/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { formatUsd } from "@/lib/chat-usage";
import { client, formatError } from "@/lib/client";
import { PAGE_PATHS } from "@/lib/navigation";

/** Platform-admin install overview: orgs, users, LLM rollup. */
export function PlatformOverviewPage() {
  const { data, error, isLoading, refetch } = useQuery({
    queryFn: () => client.getPlatformOverview(),
    queryKey: ["platform", "overview"],
    staleTime: 30_000,
  });

  if (isLoading && !data) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <p className="text-destructive text-sm" role="alert">
          {formatError(error)}
        </p>
        <Button onClick={() => void refetch()} type="button" variant="outline">
          Try again
        </Button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { totals, organizations } = data;

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-semibold text-foreground text-xl">Platform</h1>
        <Link
          className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
          to={PAGE_PATHS.workers}
        >
          Workers & LLM detail
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Organizations"
          value={String(totals.organizationCount)}
        />
        <StatCard label="Users" value={String(totals.userCount)} />
        <StatCard label="Tokens" value={totals.totalTokens.toLocaleString()} />
        <StatCard
          label="Est. cost"
          value={formatUsd(totals.estimatedCostUsd)}
        />
      </div>

      <Card className="shadow-none">
        <CardContent className="divide-y divide-border p-0">
          {organizations.length === 0 ? (
            <p className="px-4 py-6 text-muted-foreground text-sm">
              No organizations yet.
            </p>
          ) : (
            organizations.map((org) => (
              <div
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                key={org.id}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground text-sm">
                    {org.name}
                  </p>
                  <p className="truncate text-muted-foreground text-xs">
                    {org.slug}
                  </p>
                </div>
                <div className="text-right text-muted-foreground text-xs">
                  <p>{org.totalTokens.toLocaleString()} tokens</p>
                  <p>{formatUsd(org.estimatedCostUsd)}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="shadow-none">
      <CardContent className="space-y-1 p-4">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="font-semibold text-foreground text-lg tabular-nums">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
