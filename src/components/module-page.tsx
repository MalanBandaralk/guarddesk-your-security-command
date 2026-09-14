import { useEffect, useState } from "react";
import { CircleDollarSign, FileCheck2, MapPinned, Plus, ReceiptText, Route as RouteIcon, Siren, WalletCards } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/format";
import { PageHeader } from "@/components/page-header";
import { EmptyState, LoadingState } from "@/components/page-state";
import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { WorkspaceEmpty } from "@/components/workspace-empty";
import { Button } from "@/components/ui/button";

type ModuleKind = "patrols" | "incidents" | "payroll" | "billing" | "profitability";
type DisplayRow = Record<string, string | number>;

const copy = {
  patrols: ["Patrols", "Track routes, checkpoint completion and verification exceptions."],
  incidents: ["Incidents", "Record, investigate and resolve events from every site."],
  payroll: ["Payroll", "Calculate pay from approved attendance and configurable rules."],
  billing: ["Billing", "Turn approved service delivery into accurate client invoices."],
  profitability: ["Profitability", "Understand revenue, payroll cost, expenses and contract margin."],
} as const;

export function ModulePage({ kind }: { kind: ModuleKind }) {
  const { activeWorkspace } = useAuth();
  const [rows, setRows] = useState<DisplayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const org = activeWorkspace?.organization_id;
    if (!org) { setLoading(false); return; }
    setLoading(true);
    const run = async () => {
      if (kind === "patrols") {
        const { data, error: queryError } = await supabase.from("patrol_routes").select("*").eq("organization_id", org).order("name");
        if (queryError) throw queryError;
        setRows((data ?? []).map((item) => ({ route: item.name, frequency: `Every ${item.frequency_minutes} min`, duration: `${item.expected_duration_minutes} min`, status: item.active ? "active" : "inactive" })));
      } else if (kind === "incidents") {
        const { data, error: queryError } = await supabase.from("incidents").select("*").eq("organization_id", org).order("occurred_at", { ascending: false });
        if (queryError) throw queryError;
        setRows((data ?? []).map((item) => ({ reference: item.reference, incident: item.title, occurred: formatDate(item.occurred_at), severity: item.severity, status: item.status })));
      } else if (kind === "payroll") {
        const { data, error: queryError } = await supabase.from("payroll_periods").select("*").eq("organization_id", org).order("start_date", { ascending: false });
        if (queryError) throw queryError;
        setRows((data ?? []).map((item) => ({ period: item.name, starts: formatDate(item.start_date), ends: formatDate(item.end_date), status: item.status })));
      } else if (kind === "billing") {
        const { data, error: queryError } = await supabase.from("invoices").select("*").eq("organization_id", org).order("issue_date", { ascending: false });
        if (queryError) throw queryError;
        setRows((data ?? []).map((item) => ({ invoice: item.invoice_number, issued: formatDate(item.issue_date), due: formatDate(item.due_date), total: formatCurrency(Number(item.total)), status: item.status })));
      } else {
        const [contracts, payroll, expenses] = await Promise.all([supabase.from("contracts").select("value").eq("organization_id", org).eq("status", "active"), supabase.from("payroll_records").select("net_pay").eq("organization_id", org), supabase.from("expenses").select("amount").eq("organization_id", org)]);
        const found = contracts.error ?? payroll.error ?? expenses.error;
        if (found) throw found;
        const revenue = (contracts.data ?? []).reduce((sum, row) => sum + Number(row.value), 0);
        const pay = (payroll.data ?? []).reduce((sum, row) => sum + Number(row.net_pay), 0);
        const costs = (expenses.data ?? []).reduce((sum, row) => sum + Number(row.amount), 0);
        const profit = revenue - pay - costs;
        setRows([{ metric: "Contract revenue", amount: formatCurrency(revenue) }, { metric: "Payroll cost", amount: formatCurrency(pay) }, { metric: "Other expenses", amount: formatCurrency(costs) }, { metric: "Estimated gross profit", amount: formatCurrency(profit) }]);
      }
    };
    run().catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load this module")).finally(() => setLoading(false));
  }, [activeWorkspace?.organization_id, kind]);
  if (!activeWorkspace) return <WorkspaceEmpty />;
  if (loading) return <LoadingState />;
  const [title, description] = copy[kind];
  const icon = kind === "patrols" ? RouteIcon : kind === "incidents" ? Siren : kind === "payroll" ? WalletCards : kind === "billing" ? ReceiptText : CircleDollarSign;
  if (error) return <><PageHeader title={title} description={description} /><EmptyState title="This module could not be loaded" description={error} /></>;
  if (kind === "profitability") {
    const values = rows.map((row) => String(row["amount"]));
    return <><PageHeader title={title} description={description} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Revenue" value={values[0] ?? "LKR 0"} detail="Active contract value" icon={CircleDollarSign} /><MetricCard label="Payroll" value={values[1] ?? "LKR 0"} detail="Approved payroll records" icon={WalletCards} /><MetricCard label="Expenses" value={values[2] ?? "LKR 0"} detail="Recorded operating costs" icon={ReceiptText} /><MetricCard label="Estimated profit" value={values[3] ?? "LKR 0"} detail="Revenue − payroll − expenses" icon={FileCheck2} tone="success" /></div></>;
  }
  const columns = rows[0] ? Object.keys(rows[0]) : [];
  return <><PageHeader title={title} description={description} actions={<Button><Plus />{kind === "incidents" ? "Report incident" : kind === "patrols" ? "Create route" : kind === "payroll" ? "Create period" : "Create invoice"}</Button>} /><div className="rounded-lg border bg-card">{rows.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b bg-muted/30"><tr>{columns.map((item) => <th key={item} className="px-4 py-3 text-xs font-medium capitalize text-muted-foreground">{item}</th>)}</tr></thead><tbody className="divide-y">{rows.map((row,index) => <tr key={index}>{columns.map((column) => <td key={column} className="px-4 py-3">{column === "status" || column === "severity" ? <StatusBadge status={String(row[column])} /> : row[column]}</td>)}</tr>)}</tbody></table></div> : <div className="p-5"><EmptyState title={`No ${title.toLowerCase()} yet`} description="Your records will appear here as the connected workflow progresses." /></div>}</div></>;
}