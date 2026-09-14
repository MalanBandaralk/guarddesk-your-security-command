import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LoadingState } from "@/components/page-state";
import { useAuth } from "@/lib/auth";

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/auth", replace: true });
  }, [loading, user, navigate]);
  if (loading || !user) return <LoadingState />;
  return children;
}