import { LoaderCircle } from "lucide-react";

export function LoadingState() {
  return <div className="grid min-h-64 place-items-center"><LoaderCircle className="size-6 animate-spin text-primary" aria-label="Loading" /></div>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-y border-dashed py-16 text-center">
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}