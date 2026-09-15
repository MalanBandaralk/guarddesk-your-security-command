import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { EmptyState, LoadingState } from "@/components/page-state";
import { addPlatformAdmin, listPlatformAdmins, removePlatformAdmin } from "@/lib/platform.functions";
import { formatDate } from "@/lib/format";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/platform/admins")({
  head: () => ({ meta: [
    { title: "Platform Administrators | GuardDesk" },
    { name: "description", content: "Manage authorized GuardDesk platform administrators." },
    { property: "og:title", content: "Platform Administrators | GuardDesk" },
    { property: "og:description", content: "Manage authorized GuardDesk platform administrators." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: AdminsPage,
});

function AdminsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const admins = useQuery({ queryKey: ["platform-admins"], queryFn: () => listPlatformAdmins() });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["platform-admins"] });
  const add = useMutation({
    mutationFn: (value: string) => addPlatformAdmin({ data: { email: value } }),
    onSuccess: () => {
      toast.success("Platform admin added");
      setEmail("");
      invalidate();
    },
    onError: (error) => toast.error(error.message),
  });
  const remove = useMutation({
    mutationFn: (userId: string) => removePlatformAdmin({ data: { userId } }),
    onSuccess: () => {
      toast.success("Platform admin removed");
      invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  if (admins.isLoading) return <LoadingState />;
  const rows = admins.data ?? [];

  return (
    <div>
      <PageHeader title="Platform administrators" description="Platform admins are fully separate from company roles and can manage companies, plans, and other admins." />

      <form
        className="mb-6 flex max-w-md gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (email.trim()) add.mutate(email.trim());
        }}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          className="h-9 flex-1 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button disabled={add.isPending} className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          Add admin
        </button>
      </form>

      {rows.length === 0 ? (
        <EmptyState title="No platform admins" description="Add the first platform administrator by email above." />
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-card shadow-xs">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Added</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((admin) => (
                <tr key={admin.user_id}>
                  <td className="px-4 py-3 font-medium text-card-foreground">
                    {admin.email}
                    {admin.user_id === user?.id && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(admin.created_at)}</td>
                  <td className="px-4 py-3">
                    {admin.user_id !== user?.id && (
                      <button
                        disabled={remove.isPending}
                        onClick={() => {
                          if (window.confirm(`Remove platform admin access for ${admin.email}?`)) remove.mutate(admin.user_id);
                        }}
                        className="rounded-md border px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
