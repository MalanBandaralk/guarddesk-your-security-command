import type { LucideIcon } from "lucide-react";

export function MetricCard({ label, value, detail, icon: Icon, tone = "neutral" }: { label: string; value: string; detail: string; icon: LucideIcon; tone?: "neutral" | "success" | "warning" | "danger" }) {
  const toneClass = tone === "success" ? "text-success bg-success/10" : tone === "warning" ? "text-warning-foreground bg-warning/10" : tone === "danger" ? "text-destructive bg-destructive/10" : "text-primary bg-primary/10";
  return <div className="rounded-lg border bg-card p-4 shadow-xs"><div className="flex items-start justify-between"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold text-card-foreground">{value}</p></div><span className={`grid size-9 place-items-center rounded-md ${toneClass}`}><Icon className="size-4" /></span></div><p className="mt-2 text-xs text-muted-foreground">{detail}</p></div>;
}