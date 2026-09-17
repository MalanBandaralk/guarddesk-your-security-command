import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Building2, CreditCard, Users, Wallet, AlertCircle, BadgeCheck, PauseCircle, TrendingUp, Activity } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { MetricCard } from "@/components/metric-card";
import { LoadingState } from "@/components/page-state";
import { getPlatformOverview, listPlatformCompanies } from "@/lib/platform.functions";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/platform/")({
  head: () => ({ meta: [
    { title: "Platform Overview | GuardDesk" },
    { name: "description", content: "Review GuardDesk companies, subscriptions, revenue, and account status." },
    { property: "og:title", content: "Platform Overview | GuardDesk" },
    { property: "og:description", content: "Review GuardDesk companies, subscriptions, revenue, and account status." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: PlatformDashboard,
});

function PlatformDashboard() {
  const overview = useQuery({ queryKey: ["platform-overview"], queryFn: () => getPlatformOverview() });
  const companies = useQuery({ queryKey: ["platform-companies"], queryFn: () => listPlatformCompanies() });

  if (overview.isLoading) return <LoadingState />;
  const o = overview.data;
  if (!o) return <LoadingState />;

  const recent = (companies.data ?? []).slice(0, 5);
  const attention = (companies.data ?? []).filter((c) => c.status !== "active").slice(0, 5);
  const growth = o.newLast30Days - o.newPrevious30Days;
  const peakSignups = Math.max(1, ...o.signupTrend.map((point) => point.count));

  return (
    <div>
      <PageHeader
        title="Platform overview"
        description="Companies, subscriptions, revenue and usage across the whole GuardDesk platform."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Companies" value={String(o.totalOrganizations)} detail={`${o.activeOrganizations} active · ${o.newLast30Days} new in 30 days`} icon={Building2} />
        <MetricCard label="Total users" value={String(o.totalUsers)} detail={`${o.totalGuards} guards · ${o.totalSites} sites`} icon={Users} />
        <MetricCard label="Active subscriptions" value={String(o.activeSubscriptions)} detail={`${o.trialingSubscriptions} on trial · ${o.trialsEndingSoon} ending soon`} icon={BadgeCheck} tone="success" />
        <MetricCard label="Monthly recurring revenue" value={formatCurrency(o.mrr, o.currency)} detail={`${formatCurrency(o.outstanding, o.currency)} outstanding`} icon={Wallet} tone="success" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Net new companies" value={`${growth >= 0 ? "+" : ""}${growth}`} detail={`vs ${o.newPrevious30Days} in the prior 30 days`} icon={TrendingUp} tone={growth >= 0 ? "success" : "warning"} />
        <MetricCard label="Open incidents" value={String(o.openIncidents)} detail="Across all companies" icon={Activity} tone={o.openIncidents ? "warning" : "neutral"} />
        <MetricCard label="Suspended companies" value={String(o.suspendedOrganizations)} detail="Access paused, data retained" icon={PauseCircle} tone="warning" />
        <MetricCard label="Deactivated companies" value={String(o.deactivatedOrganizations)} detail="Data retained, not deleted" icon={AlertCircle} tone="danger" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border bg-card shadow-xs">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-sm font-semibold text-card-foreground">New companies by month</h2>
            <span className="text-xs text-muted-foreground">Last 6 months</span>
          </div>
          <div className="flex h-44 items-end gap-3 px-4 py-4">
            {o.signupTrend.map((point) => (
              <div key={point.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">{point.count}</span>
                <div className="flex w-full flex-1 items-end">
                  <div className="w-full rounded-t bg-primary/80" style={{ height: `${Math.round((point.count / peakSignups) * 100)}%`, minHeight: "4px" }} />
                </div>
                <span className="text-xs text-muted-foreground">{point.month}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border bg-card shadow-xs">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-sm font-semibold text-card-foreground">Plan mix</h2>
            <Link to="/platform/plans" className="text-xs font-medium text-primary hover:underline">Manage plans</Link>
          </div>
          <ul className="divide-y">
            {o.planDistribution.map((plan) => (
              <li key={plan.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-card-foreground">{plan.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {plan.subscribers} subscriber{plan.subscribers === 1 ? "" : "s"} · {formatCurrency(plan.revenue, o.currency)} / month
                    </p>
                  </div>
                  <StatusBadge status={plan.active ? "active" : "inactive"} />
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                  <div className="h-1.5 rounded-full bg-primary" style={{ width: `${o.activeSubscriptions ? Math.round((plan.subscribers / o.activeSubscriptions) * 100) : 0}%` }} />
                </div>
              </li>
            ))}
            {o.planDistribution.length === 0 && <li className="px-4 py-6 text-sm text-muted-foreground">No plans configured yet.</li>}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border bg-card shadow-xs">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-sm font-semibold text-card-foreground">Recently onboarded</h2>
            <Link to="/platform/companies" className="text-xs font-medium text-primary hover:underline">View all</Link>
          </div>
          <ul className="divide-y">
            {recent.map((c) => (
              <li key={c.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-card-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">Joined {formatDate(c.created_at)} · {c.member_count} users · {c.guard_count} guards</p>
                </div>
                <StatusBadge status={c.status} />
              </li>
            ))}
            {recent.length === 0 && <li className="px-4 py-6 text-sm text-muted-foreground">No companies yet.</li>}
          </ul>
        </section>

        <section className="rounded-lg border bg-card shadow-xs">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-sm font-semibold text-card-foreground">Needs attention</h2>
            <Link to="/platform/companies" className="text-xs font-medium text-primary hover:underline">Manage</Link>
          </div>
          <ul className="divide-y">
            {attention.map((c) => (
              <li key={c.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-card-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.plan_name} · {c.subscription_status}</p>
                </div>
                <StatusBadge status={c.status} />
              </li>
            ))}
            {attention.length === 0 && <li className="px-4 py-6 text-sm text-muted-foreground">All companies are active. Nothing needs attention.</li>}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link to="/platform/companies" className="rounded-lg border bg-card px-4 py-3 text-sm font-medium shadow-xs hover:bg-muted/40">Manage companies</Link>
        <Link to="/platform/plans" className="rounded-lg border bg-card px-4 py-3 text-sm font-medium shadow-xs hover:bg-muted/40">Plans &amp; pricing</Link>
        <Link to="/platform/admins" className="rounded-lg border bg-card px-4 py-3 text-sm font-medium shadow-xs hover:bg-muted/40">Platform administrators</Link>
      </div>
    </div>
  );
}

