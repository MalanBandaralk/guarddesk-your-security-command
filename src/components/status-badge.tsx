import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success",
  approved: "bg-success/10 text-success",
  completed: "bg-success/10 text-success",
  present: "bg-success/10 text-success",
  scheduled: "bg-info/10 text-info",
  assigned: "bg-info/10 text-info",
  pending: "bg-warning/10 text-warning-foreground",
  draft: "bg-muted text-muted-foreground",
  on_leave: "bg-warning/10 text-warning-foreground",
  inactive: "bg-muted text-muted-foreground",
  critical: "bg-destructive/10 text-destructive",
  overdue: "bg-destructive/10 text-destructive",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize", statusStyles[status] ?? "bg-muted text-muted-foreground")}>
      {status.replaceAll("_", " ")}
    </span>
  );
}