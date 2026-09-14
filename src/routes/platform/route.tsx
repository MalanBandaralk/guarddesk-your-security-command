import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Building2, CreditCard, LayoutDashboard, ShieldCheck, ArrowLeft, LoaderCircle } from "lucide-react";
import { AuthGate } from "@/components/auth-gate";
import { BrandMark } from "@/components/brand-mark";
import { EmptyState } from "@/components/page-state";
import { checkPlatformAdmin } from "@/lib/platform.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/platform")({ component: PlatformLayout });

const nav = [
  { to: "/platform", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/platform/companies", label: "Companies", icon: Building2 },
  { to: "/platform/plans", label: "Plans & Pricing", icon: CreditCard },
  { to: "/platform/admins", label: "Platform Admins", icon: ShieldCheck },
];

function PlatformLayout() {
  return (
    <AuthGate>
      <PlatformGuard />
    </AuthGate>
  );
}

function PlatformGuard() {
  const { data, isLoading } = useQuery({
    queryKey: ["platform-admin-check"],
    queryFn: () => checkPlatformAdmin(),
  });

  if (isLoading) {
    return <div className="grid min-h-screen place-items-center"><LoaderCircle className="size-6 animate-spin text-primary" /></div>;
  }
  if (!data?.isPlatformAdmin) {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <div className="max-w-md">
          <EmptyState title="Platform admin access required" description="This area is restricted to GuardDesk platform administrators. Contact an existing platform admin if you believe you should have access." />
          <Link to="/app" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="size-4" /> Back to your workspace
          </Link>
        </div>
      </div>
    );
  }
  return <PlatformShell />;
}

function PlatformShell() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r bg-sidebar md:flex">
        <div className="flex items-center gap-2 border-b px-5 py-4">
          <BrandMark />
          <div>
            <p className="text-sm font-semibold text-foreground">GuardDesk</p>
            <p className="text-xs text-muted-foreground">Platform Admin</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-3">
          <Link to="/app" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to app
          </Link>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur md:hidden">
          <BrandMark />
          <p className="text-sm font-semibold">Platform Admin</p>
          <nav className="ml-auto flex gap-1 overflow-x-auto">
            {nav.map((item) => (
              <Link key={item.to} to={item.to} className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
