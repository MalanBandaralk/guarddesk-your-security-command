import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState, LoadingState } from "@/components/page-state";
import { listPlatformCompanies, setOrganizationStatus } from "@/lib/platform.functions";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/platform/companies")({
  head: () => ({ meta: [{ title: "Companies — Platform Admin" }, { name: "robots", content: "noindex" }] }),
  component: CompaniesPage,
});

type Company = Awaited<ReturnType<typeof listPlatformCompanies>>[number];

function CompaniesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const companies = useQuery({ queryKey: ["platform-companies"], queryFn: () => listPlatformCompanies() });

  const statusMutation = useMutation({
    mutationFn: (input: { organizationId: string; status: "active" | "suspended" | "deactivated" }) =>
      setOrganizationStatus({ data: input }),
    onSuccess: (_result, input) => {
      toast.success(`Company ${input.status === "active" ? "activated" : input.status}`);
      queryClient.invalidateQueries({ queryKey: ["platform-companies"] });
      queryClient.invalidateQueries({ queryKey: ["platform-overview"] });
    },
    onError: (error) => toast.error(error.message),
  });

  if (companies.isLoading) return <LoadingState />;
  const rows = (companies.data ?? []).filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader title="Companies" description="Every security company on the platform. Suspend or deactivate without deleting data." />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies…"
            className="h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="deactivated">Deactivated</option>
        </select>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No companies found" description="Try adjusting your search or status filter." />
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-card shadow-xs">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Subscription</th>
                <th className="px-4 py-3 font-medium">Users</th>
                <th className="px-4 py-3 font-medium">Guards</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((company) => (
                <CompanyRow
                  key={company.id}
                  company={company}
                  pending={statusMutation.isPending}
                  onSetStatus={(status) => statusMutation.mutate({ organizationId: company.id, status })}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CompanyRow({
  company,
  pending,
  onSetStatus,
}: {
  company: Company;
  pending: boolean;
  onSetStatus: (status: "active" | "suspended" | "deactivated") => void;
}) {
  return (
    <tr>
      <td className="px-4 py-3 font-medium text-card-foreground">{company.name}</td>
      <td className="px-4 py-3 text-muted-foreground">{company.plan_name}</td>
      <td className="px-4 py-3"><StatusBadge status={company.subscription_status} /></td>
      <td className="px-4 py-3 text-muted-foreground">{company.member_count}</td>
      <td className="px-4 py-3 text-muted-foreground">{company.guard_count}</td>
      <td className="px-4 py-3 text-muted-foreground">{formatDate(company.created_at)}</td>
      <td className="px-4 py-3"><StatusBadge status={company.status} /></td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {company.status !== "active" && (
            <button disabled={pending} onClick={() => onSetStatus("active")} className="rounded-md border px-2 py-1 text-xs font-medium text-success hover:bg-success/10 disabled:opacity-50">
              Activate
            </button>
          )}
          {company.status === "active" && (
            <button disabled={pending} onClick={() => onSetStatus("suspended")} className="rounded-md border px-2 py-1 text-xs font-medium text-warning-foreground hover:bg-warning/10 disabled:opacity-50">
              Suspend
            </button>
          )}
          {company.status !== "deactivated" && (
            <button
              disabled={pending}
              onClick={() => {
                if (window.confirm(`Deactivate ${company.name}? Their data is retained and can be reactivated later.`)) {
                  onSetStatus("deactivated");
                }
              }}
              className="rounded-md border px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
            >
              Deactivate
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
