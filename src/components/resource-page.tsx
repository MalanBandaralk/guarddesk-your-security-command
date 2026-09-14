import { useMemo, useState } from "react";
import { Filter, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState, LoadingState } from "@/components/page-state";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspaceData } from "@/hooks/use-workspace-data";
import { formatCurrency, formatDate, formatTime } from "@/lib/format";
import { useAuth } from "@/lib/auth";
import { WorkspaceEmpty } from "@/components/workspace-empty";

type PageKind = "clients" | "guards" | "contracts" | "schedule" | "attendance" | "documents" | "operations";

const config: Record<PageKind, { title: string; description: string; action: string }> = {
  clients: { title: "Clients & sites", description: "Manage service relationships, locations and coverage requirements.", action: "Add client" },
  guards: { title: "Guards", description: "Manage personnel, readiness, skills and assignment status.", action: "Add guard" },
  contracts: { title: "Contracts", description: "Track service scope, staffing requirements and contract value.", action: "Add contract" },
  schedule: { title: "Schedule", description: "Plan shifts and make sure every post has the right coverage.", action: "Create shift" },
  attendance: { title: "Attendance", description: "Review verified clock-ins, exceptions and approvals.", action: "Add record" },
  documents: { title: "Documents", description: "Monitor configurable guard documents and expiry risk.", action: "Add document" },
  operations: { title: "Live operations", description: "See current deployment status and respond to coverage gaps.", action: "Create shift" },
};

export function ResourcePage({ kind }: { kind: PageKind }) {
  const { activeWorkspace } = useAuth();
  const { data, loading, error } = useWorkspaceData();
  const [query, setQuery] = useState("");
  if (!activeWorkspace) return <WorkspaceEmpty />;
  if (loading) return <LoadingState />;
  if (error) return <EmptyState title="Data could not be loaded" description={error} />;
  const rows = buildRows(kind, data).filter((row) => Object.values(row).join(" ").toLowerCase().includes(query.toLowerCase()));
  const columns = rows[0] ? Object.keys(rows[0]) : [];
  return <><PageHeader {...config[kind]} actions={<Button><Plus />{config[kind].action}</Button>} /><div className="rounded-lg border bg-card"><div className="flex flex-col gap-3 border-b p-4 sm:flex-row"><div className="relative max-w-sm flex-1"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input className="pl-9" placeholder={`Search ${config[kind].title.toLowerCase()}…`} value={query} onChange={(event) => setQuery(event.target.value)} /></div><Button variant="outline"><Filter />Filters</Button></div>{rows.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b bg-muted/30 text-xs text-muted-foreground"><tr>{columns.map((column) => <th key={column} className="whitespace-nowrap px-4 py-3 font-medium capitalize">{column.replaceAll("_"," ")}</th>)}</tr></thead><tbody className="divide-y">{rows.map((row,index) => <tr key={index} className="hover:bg-muted/30">{columns.map((column) => <td key={column} className="whitespace-nowrap px-4 py-3">{column === "status" ? <StatusBadge status={String(row[column])} /> : String(row[column] ?? "—")}</td>)}</tr>)}</tbody></table></div> : <div className="p-5"><EmptyState title={`No ${config[kind].title.toLowerCase()} found`} description="Try a different search or add the first record." /></div>}</div></>;
}

function buildRows(kind: PageKind, data: ReturnType<typeof useWorkspaceData>["data"]) {
  if (kind === "clients") return data.clients.map((client) => ({ client: client.name, industry: client.industry ?? "—", sites: data.sites.filter((site) => site.client_id === client.id).length, contact: client.contact_name ?? "—", status: client.status }));
  if (kind === "guards") return data.guards.map((guard) => ({ employee_id: guard.employee_id, guard: guard.full_name, phone: guard.phone ?? "—", skills: guard.skills.join(", ") || "—", status: guard.status }));
  if (kind === "contracts") return data.contracts.map((contract) => ({ reference: contract.reference ?? "—", contract: contract.title, starts: formatDate(contract.start_date), value: formatCurrency(Number(contract.value)), guards: contract.required_guards, status: contract.status }));
  if (kind === "documents") return data.documents.map((document) => ({ guard: data.guards.find((guard) => guard.id === document.guard_id)?.full_name ?? "—", number: document.document_number ?? "—", expires: formatDate(document.expiry_date), status: document.expiry_date && new Date(document.expiry_date) < new Date() ? "overdue" : "active" }));
  if (kind === "attendance") return data.attendance.map((record) => ({ guard: data.guards.find((guard) => guard.id === record.guard_id)?.full_name ?? "—", site: data.sites.find((site) => site.id === record.site_id)?.name ?? "—", clock_in: formatTime(record.clock_in_at), location: record.clock_in_within_geofence ? "Verified" : "Review", status: record.approval_status }));
  return data.shifts.map((shift) => { const assignment = data.assignments.find((item) => item.shift_id === shift.id); const guard = data.guards.find((item) => item.id === assignment?.guard_id); return { date: formatDate(shift.shift_date), site: data.sites.find((site) => site.id === shift.site_id)?.name ?? "—", guard: guard?.full_name ?? "Unassigned", time: `${shift.start_time.slice(0,5)}–${shift.end_time.slice(0,5)}`, status: guard ? shift.status : "pending" }; });
}