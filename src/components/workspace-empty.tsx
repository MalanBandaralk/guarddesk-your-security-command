import { useState } from "react";
import { Building2, LoaderCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export function WorkspaceEmpty() {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const { refreshWorkspaces } = useAuth();
  const create = async () => {
    setBusy(true);
    const { error } = await supabase.rpc("create_demo_organization", { _company_name: name.trim() || "Demo Security (Pvt) Ltd" });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await refreshWorkspaces();
    toast.success("Your GuardDesk workspace is ready.");
  };
  return <div className="mx-auto grid min-h-[70vh] max-w-lg place-items-center"><div className="w-full rounded-lg border bg-card p-7 text-center shadow-sm"><span className="mx-auto grid size-12 place-items-center rounded-lg bg-primary/10 text-primary"><Building2 /></span><h1 className="mt-5 text-2xl font-semibold">Set up your company workspace</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Create a secure workspace with realistic sample operations. You can replace the sample records as your team gets started.</p><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Company name" className="mt-6" /><Button className="mt-3 w-full" size="lg" onClick={create} disabled={busy}>{busy ? <LoaderCircle className="animate-spin" /> : <Sparkles />}Create sample workspace</Button></div></div>;
}