import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState, LoadingState } from "@/components/page-state";
import { listPlatformPlans, setPlanActive } from "@/lib/platform.functions";
import { formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/platform/plans")({
  head: () => ({ meta: [
    { title: "Plans & Pricing | GuardDesk Platform" },
    { name: "description", content: "Manage GuardDesk subscription plans, limits, and availability." },
    { property: "og:title", content: "Plans & Pricing | GuardDesk Platform" },
    { property: "og:description", content: "Manage GuardDesk subscription plans, limits, and availability." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: PlansPage,
});

function PlansPage() {
  const queryClient = useQueryClient();
  const plans = useQuery({ queryKey: ["platform-plans"], queryFn: () => listPlatformPlans() });

  const toggle = useMutation({
    mutationFn: (input: { planId: string; active: boolean }) => setPlanActive({ data: input }),
    onSuccess: (_result, input) => {
      toast.success(input.active ? "Plan activated" : "Plan hidden from new signups");
      queryClient.invalidateQueries({ queryKey: ["platform-plans"] });
    },
    onError: (error) => toast.error(error.message),
  });

  if (plans.isLoading) return <LoadingState />;
  const rows = plans.data ?? [];

  return (
    <div>
      <PageHeader title="Plans & pricing" description="Database-driven subscription plans and limits. Existing subscribers are never affected by hiding a plan." />

      {rows.length === 0 ? (
        <EmptyState title="No plans configured" description="Subscription plans are defined in the database. Add plans to start selling subscriptions." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((plan) => {
            const limits = (plan.limits ?? {}) as Record<string, unknown>;
            const features = (plan.features ?? {}) as Record<string, unknown>;
            return (
              <article key={plan.id} className="rounded-lg border bg-card p-5 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-semibold text-card-foreground">{plan.name}</h2>
                    <p className="text-xs text-muted-foreground">{plan.code}</p>
                  </div>
                  <StatusBadge status={plan.active ? "active" : "inactive"} />
                </div>
                <p className="mt-3 text-2xl font-semibold text-card-foreground">
                  {formatCurrency(Number(plan.monthly_price), plan.currency_code)}
                  <span className="text-sm font-normal text-muted-foreground"> / month</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{plan.subscriber_count} active subscriber{plan.subscriber_count === 1 ? "" : "s"}</p>

                <dl className="mt-4 space-y-1.5 text-sm">
                  {Object.entries(limits).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <dt className="text-muted-foreground capitalize">{key.replaceAll("_", " ")}</dt>
                      <dd className="font-medium text-card-foreground">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
                {Object.keys(features).length > 0 && (
                  <ul className="mt-3 space-y-1 border-t pt-3 text-xs text-muted-foreground">
                    {Object.entries(features).map(([key, value]) => (
                      <li key={key}>• {key.replaceAll("_", " ")}: {String(value)}</li>
                    ))}
                  </ul>
                )}

                <button
                  disabled={toggle.isPending}
                  onClick={() => toggle.mutate({ planId: plan.id, active: !plan.active })}
                  className="mt-4 w-full rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
                >
                  {plan.active ? "Hide from new signups" : "Make available"}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
