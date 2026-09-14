import { useEffect, type ReactNode } from "react";
import { LoadingState } from "@/components/page-state";
import { useAuth } from "@/lib/auth";

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!loading && !user) window.location.replace("/auth");
  }, [loading, user]);
  if (loading || !user) return <LoadingState />;
  return children;
}