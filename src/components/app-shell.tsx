import { Link, Outlet } from "@tanstack/react-router";
import {
  Activity, BadgeDollarSign, Bell, Building2, CalendarDays, ChevronDown, ClipboardCheck,
  FileClock, FileText, Gauge, Globe2, LogOut, Menu, MoreHorizontal, ReceiptText, Search,
  ShieldCheck, Siren, UserRoundCheck, UsersRound, WalletCards, X,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { checkPlatformAdmin } from "@/lib/platform.functions";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", to: "/app", icon: Gauge },
  { label: "Operations", to: "/app/operations", icon: Activity },
  { label: "Schedule", to: "/app/schedule", icon: CalendarDays },
  { label: "Attendance", to: "/app/attendance", icon: UserRoundCheck },
  { label: "Patrols", to: "/app/patrols", icon: ShieldCheck },
  { label: "Incidents", to: "/app/incidents", icon: Siren },
  { label: "Clients & sites", to: "/app/clients", icon: Building2 },
  { label: "Guards", to: "/app/guards", icon: UsersRound },
  { label: "Contracts", to: "/app/contracts", icon: FileText },
  { label: "Documents", to: "/app/documents", icon: FileClock },
  { label: "Payroll", to: "/app/payroll", icon: WalletCards },
  { label: "Billing", to: "/app/billing", icon: ReceiptText },
  { label: "Profitability", to: "/app/profitability", icon: BadgeDollarSign },
] as const;

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { activeWorkspace, workspaces, setActiveOrganization, user, signOut } = useAuth();
  const platformAdmin = useQuery({ queryKey: ["platform-admin-check"], queryFn: () => checkPlatformAdmin(), staleTime: 60_000 });
  const isPlatformAdmin = platformAdmin.data?.isPlatformAdmin ?? false;
  const displayName = activeWorkspace?.display_name || user?.user_metadata?.["full_name"] || user?.email?.split("@")[0] || "User";

  const sidebar = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
        <BrandMark />
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X /></Button>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto p-3" aria-label="Main navigation">
        {activeWorkspace ? (
          <>
            <div className="space-y-1">
              {nav.slice(0, 6).map((item) => <NavItem key={item.to} {...item} close={() => setMobileOpen(false)} />)}
            </div>
            <div>
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase text-muted-foreground">Management</p>
              <div className="space-y-1">{nav.slice(6, 10).map((item) => <NavItem key={item.to} {...item} close={() => setMobileOpen(false)} />)}</div>
            </div>
            <div>
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase text-muted-foreground">Finance</p>
              <div className="space-y-1">{nav.slice(10).map((item) => <NavItem key={item.to} {...item} close={() => setMobileOpen(false)} />)}</div>
            </div>
          </>
        ) : (
          <div className="space-y-1">
            <NavItem label="Dashboard" to="/app" icon={Gauge} close={() => setMobileOpen(false)} />
            <p className="px-3 pt-2 text-xs leading-5 text-muted-foreground">
              {isPlatformAdmin ? "Company modules appear once you join a company workspace." : "Create your company workspace to unlock the operations modules."}
            </p>
          </div>
        )}
        {isPlatformAdmin && (
          <div>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase text-muted-foreground">Platform</p>
            <Link to="/platform" onClick={() => setMobileOpen(false)} className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><Globe2 className="size-4" />Platform admin</Link>
          </div>
        )}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-sidebar-accent" onClick={() => void signOut().then(() => { window.location.href = "/auth"; })}>
          <span className="grid size-9 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{initials(displayName)}</span>
          <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{displayName}</span><span className="block truncate text-xs capitalize text-muted-foreground">{activeWorkspace?.role ?? "Member"}</span></span>
          <LogOut className="size-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border lg:block">{sidebar}</aside>
      {mobileOpen && <><div className="fixed inset-0 z-40 bg-overlay lg:hidden" onClick={() => setMobileOpen(false)} /><aside className="fixed inset-y-0 left-0 z-50 w-72 border-r border-sidebar-border lg:hidden">{sidebar}</aside></>}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu /></Button>
          <div className="relative hidden max-w-md flex-1 md:block"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><input className="h-9 w-full rounded-md border bg-muted/40 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Search guards, sites, incidents…" /></div>
          <div className="ml-auto flex items-center gap-2">
            {workspaces.length > 1 && <label className="relative hidden sm:block"><span className="sr-only">Organization</span><select value={activeWorkspace?.organization_id ?? ""} onChange={(event) => setActiveOrganization(event.target.value)} className="h-9 appearance-none rounded-md border bg-background pl-3 pr-8 text-sm"><option value="">Select company</option>{workspaces.map((item) => <option key={item.id} value={item.organization_id}>{item.organizations?.name}</option>)}</select><ChevronDown className="pointer-events-none absolute right-2 top-2.5 size-4 text-muted-foreground" /></label>}
            <Button variant="ghost" size="icon" aria-label="Notifications"><Bell /></Button>
            <Button variant="ghost" size="icon" aria-label="More options"><MoreHorizontal /></Button>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] p-4 md:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}

function NavItem({ label, to, icon: Icon, close }: { label: string; to: string; icon: typeof Gauge; close: () => void }) {
  return <Link to={to} onClick={close} activeOptions={{ exact: to === "/app" }} className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground [&.active]:bg-sidebar-accent [&.active]:text-sidebar-primary"><Icon className="size-4" />{label}</Link>;
}