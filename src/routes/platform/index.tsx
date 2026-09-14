import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Building2, CreditCard, Users, Wallet, AlertCircle, BadgeCheck, PauseCircle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { MetricCard } from "@/components/metric-card";
import { LoadingState } from "@/components/page-state";
import { getPlatformOverview, listPlatformCompanies } from "@/lib/platform.functions";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/platform/")({
  head: () => ({ meta: [{ title: "Platform Admin — GuardDesk" }, { name: "robots", content: "noindex" }] }),
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

  return (
    <div>
      <PageHeader title="Platform overview" description="Companies, subscriptions, and revenue across the whole GuardDesk platform." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Companies" value={String(o.totalOrganizations)} detail={`${o.activeOrganizations} active`} icon={Building2} />
        <MetricCard label="Total users" value={String(o.totalUsers)} detail="Across all companies" icon={Users} />
        <MetricCard label="Active subscriptions" value={String(o.activeSubscriptions)} detail={`${o.trialingSubscriptions} on trial`} icon={BadgeCheck} tone="success" />
        <MetricCard label="Monthly recurring revenue" value={formatCurrency(o.mrr, o.currency)} detail={`${formatCurrency(o.outstanding, o.currency)} outstanding`} icon={Wallet} tone="success" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <MetricCard label="Suspended companies" value={String(o.suspendedOrganizations)} detail="Access paused, data retained" icon={PauseCircle} tone="warning" />
        <MetricCard label="Deactivated companies" value={String(o.deactivatedOrganizations)} detail="Data retained, not deleted" icon={AlertCircle} tone="danger" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
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
                  <p className="text-xs text-muted-foreground">Joined {formatDate(c.created_at)}</p>
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
    </div>
  );
}
