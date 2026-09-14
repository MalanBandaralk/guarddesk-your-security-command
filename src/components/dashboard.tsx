import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Building2, CalendarCheck, CircleDollarSign, Clock3, MapPin, ShieldCheck, UsersRound } from "lucide-react";
import { EmptyState, LoadingState } from "@/components/page-state";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { WorkspaceEmpty } from "@/components/workspace-empty";
import { useAuth } from "@/lib/auth";
import { formatCurrency, formatTime } from "@/lib/format";
import { useWorkspaceData } from "@/hooks/use-workspace-data";

export function Dashboard() {
  const { activeWorkspace } = useAuth();
  const { data, loading, error } = useWorkspaceData();
  if (!activeWorkspace) return <WorkspaceEmpty />;
  if (loading) return <LoadingState />;
  if (error) return <EmptyState title="Workspace data could not be loaded" description={error} />;
  const today = new Date().toISOString().slice(0, 10);
  const todaysShifts = data.shifts.filter((shift) => shift.shift_date === today);
  const assignedIds = new Set(data.assignments.map((item) => item.shift_id));
  const openShifts = todaysShifts.filter((shift) => !assignedIds.has(shift.id));
  const activeGuards = data.guards.filter((guard) => guard.status === "active");
  const pendingAttendance = data.attendance.filter((item) => item.approval_status === "pending");
  const expiringDocs = data.documents.filter((doc) => doc.expiry_date && new Date(doc.expiry_date) < new Date(Date.now() + 30 * 86400000));
  const revenue = data.contracts.filter((contract) => contract.status === "active").reduce((sum, item) => sum + Number(item.value), 0);

  return <><PageHeader title={`Good day, ${activeWorkspace.display_name || "team"}`} description={`${activeWorkspace.organizations?.name ?? "Your company"} · Live operational overview`} actions={<Button asChild><Link to="/app/operations">Open live operations <ArrowRight /></Link></Button>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Active guards" value={String(activeGuards.length)} detail={`${data.guards.length} total team members`} icon={UsersRound} tone="success" /><MetricCard label="Today's shifts" value={String(todaysShifts.length)} detail={openShifts.length ? `${openShifts.length} still open` : "All scheduled shifts assigned"} icon={CalendarCheck} tone={openShifts.length ? "warning" : "success"} /><MetricCard label="Attendance review" value={String(pendingAttendance.length)} detail="Awaiting supervisor approval" icon={Clock3} tone={pendingAttendance.length ? "warning" : "neutral"} /><MetricCard label="Monthly contracts" value={formatCurrency(revenue)} detail={`${data.contracts.filter((item) => item.status === "active").length} active agreements`} icon={CircleDollarSign} /></div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_.8fr]"><section className="rounded-lg border bg-card"><div className="flex items-center justify-between border-b p-5"><div><h2 className="font-semibold">Today’s deployment</h2><p className="text-sm text-muted-foreground">Coverage across active sites</p></div><Button variant="outline" size="sm" asChild><Link to="/app/schedule">View schedule</Link></Button></div><div className="divide-y">{todaysShifts.slice(0, 7).map((shift) => { const site = data.sites.find((item) => item.id === shift.site_id); const assignment = data.assignments.find((item) => item.shift_id === shift.id); const guard = data.guards.find((item) => item.id === assignment?.guard_id); return <div key={shift.id} className="grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center"><div><p className="text-sm font-medium">{site?.name ?? "Unknown site"}</p><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" />{site?.city ?? "Location not set"}</p></div><div><p className="text-sm">{guard?.full_name ?? "Unassigned"}</p><p className="mt-1 text-xs text-muted-foreground">{shift.start_time.slice(0,5)}–{shift.end_time.slice(0,5)}</p></div><StatusBadge status={guard ? "assigned" : "pending"} /></div>; })}{todaysShifts.length === 0 && <div className="p-5"><EmptyState title="No shifts today" description="Create shifts from Schedule to begin deployment planning." /></div>}</div></section>
      <section className="rounded-lg border bg-card"><div className="border-b p-5"><h2 className="font-semibold">Needs attention</h2><p className="text-sm text-muted-foreground">Items requiring action</p></div><div className="divide-y">{[[openShifts.length,"Open shifts",CalendarCheck,"/app/schedule"],[pendingAttendance.length,"Attendance approvals",Clock3,"/app/attendance"],[expiringDocs.length,"Expiring documents",AlertTriangle,"/app/documents"]].map(([count,label,Icon,to]) => { const ItemIcon = Icon as typeof ShieldCheck; return <Link key={String(label)} to={String(to)} className="flex items-center gap-3 p-4 hover:bg-muted/40"><span className="grid size-9 place-items-center rounded-md bg-warning/10 text-warning-foreground"><ItemIcon className="size-4" /></span><div className="flex-1"><p className="text-sm font-medium">{String(label)}</p><p className="text-xs text-muted-foreground">Review and resolve</p></div><span className="text-lg font-semibold">{String(count)}</span></Link>; })}</div><div className="border-t p-5"><h3 className="text-sm font-semibold">Latest clock-ins</h3><div className="mt-3 space-y-3">{data.attendance.slice(0,3).map((record) => { const guard = data.guards.find((item) => item.id === record.guard_id); return <div key={record.id} className="flex items-center gap-3 text-sm"><span className="size-2 rounded-full bg-success" /><span className="min-w-0 flex-1 truncate">{guard?.full_name}</span><span className="text-xs text-muted-foreground">{formatTime(record.clock_in_at)}</span></div>; })}</div></div></section></div>
  </>;
}