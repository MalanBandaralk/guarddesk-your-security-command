import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { emptyDashboardData, type DashboardData } from "@/lib/workspace-data";

export function useWorkspaceData() {
  const { activeWorkspace } = useAuth();
  const [data, setData] = useState<DashboardData>(emptyDashboardData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const organizationId = activeWorkspace?.organization_id;
    if (!organizationId) {
      setData(emptyDashboardData);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const [guards, sites, clients, contracts, shifts, assignments, attendance, documents, audit] = await Promise.all([
      supabase.from("guards").select("*").eq("organization_id", organizationId).order("full_name"),
      supabase.from("sites").select("*").eq("organization_id", organizationId).order("name"),
      supabase.from("clients").select("*").eq("organization_id", organizationId).order("name"),
      supabase.from("contracts").select("*").eq("organization_id", organizationId).order("created_at", { ascending: false }),
      supabase.from("shifts").select("*").eq("organization_id", organizationId).order("shift_date"),
      supabase.from("shift_assignments").select("*").eq("organization_id", organizationId),
      supabase.from("attendance_records").select("*").eq("organization_id", organizationId).order("created_at", { ascending: false }),
      supabase.from("guard_documents").select("*").eq("organization_id", organizationId).order("expiry_date"),
      supabase.from("audit_logs").select("*").eq("organization_id", organizationId).order("created_at", { ascending: false }).limit(20),
    ]);
    const firstError = [guards, sites, clients, contracts, shifts, assignments, attendance, documents, audit].find((result) => result.error)?.error;
    if (firstError) {
      setError(firstError.message);
    } else {
      setData({
        guards: guards.data ?? [], sites: sites.data ?? [], clients: clients.data ?? [], contracts: contracts.data ?? [],
        shifts: shifts.data ?? [], assignments: assignments.data ?? [], attendance: attendance.data ?? [],
        documents: documents.data ?? [], audit: audit.data ?? [],
      });
    }
    setLoading(false);
  };

  useEffect(() => { void load(); }, [activeWorkspace?.organization_id]);
  return { data, loading, error, refresh: load };
}