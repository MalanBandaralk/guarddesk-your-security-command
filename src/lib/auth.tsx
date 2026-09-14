import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Member = Database["public"]["Tables"]["organization_members"]["Row"];
type Organization = Database["public"]["Tables"]["organizations"]["Row"];

type Workspace = Member & { organizations: Organization | null };

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  setActiveOrganization: (organizationId: string) => void;
  refreshWorkspaces: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeOrganizationId, setActiveOrganizationId] = useState<string | null>(null);

  const loadWorkspaces = async (userId?: string) => {
    if (!userId) {
      setWorkspaces([]);
      return;
    }
    const { data, error } = await supabase
      .from("organization_members")
      .select("*, organizations(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    const next = data ?? [];
    setWorkspaces(next);
    setActiveOrganizationId((current) => {
      if (current && next.some((workspace) => workspace.organization_id === current)) return current;
      return next[0]?.organization_id ?? null;
    });
  };

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      loadWorkspaces(data.session?.user.id).catch(console.error).finally(() => setLoading(false));
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(true);
      loadWorkspaces(nextSession?.user.id).catch(console.error).finally(() => setLoading(false));
    });
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    loading,
    workspaces,
    activeWorkspace: workspaces.find((item) => item.organization_id === activeOrganizationId) ?? null,
    setActiveOrganization: setActiveOrganizationId,
    refreshWorkspaces: () => loadWorkspaces(session?.user.id),
    signOut: async () => {
      await supabase.auth.signOut();
    },
  }), [session, loading, workspaces, activeOrganizationId]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}