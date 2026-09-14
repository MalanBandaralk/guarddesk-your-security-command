import { cn } from "@/lib/utils";

export function BrandMark({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="grid size-8 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">G</span>
      {!compact && <span className="text-lg font-semibold text-foreground">GuardDesk</span>}
    </div>
  );
}