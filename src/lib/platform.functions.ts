import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type AuthedSupabase = SupabaseClient<Database>;

async function assertPlatformAdmin(supabase: AuthedSupabase, userId: string) {
  const { data } = await supabase
    .from("platform_admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (!data) throw new Error("Forbidden: platform administrator access required");
}

export const getPlatformOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertPlatformAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [orgs, members, subs, plans, invoices, guards, sites, incidents] = await Promise.all([
      supabaseAdmin.from("organizations").select("id, status, created_at"),
      supabaseAdmin.from("organization_members").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("subscriptions").select("id, status, plan_id, organization_id, trial_ends_at"),
      supabaseAdmin.from("subscription_plans").select("id, name, code, monthly_price, currency_code, active"),
      supabaseAdmin.from("invoices").select("id, total, status"),
      supabaseAdmin.from("guards").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("sites").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("incidents").select("id", { count: "exact", head: true }).neq("status", "closed"),
    ]);

    const organizations = orgs.data ?? [];
    const subscriptions = subs.data ?? [];
    const planRows = plans.data ?? [];
    const activeSubs = subscriptions.filter((s) => s.status === "active" || s.status === "trialing");
    const planPrice = new Map(planRows.map((p) => [p.id, Number(p.monthly_price)]));
    const mrr = activeSubs.reduce((sum, s) => sum + (planPrice.get(s.plan_id) ?? 0), 0);
    const invoiceRows = invoices.data ?? [];
    const outstanding = invoiceRows
      .filter((i) => i.status === "sent" || i.status === "overdue")
      .reduce((sum, i) => sum + Number(i.total), 0);

    const now = Date.now();
    const newLast30Days = organizations.filter((o) => now - new Date(o.created_at).getTime() <= 30 * 86400000).length;
    const newPrevious30Days = organizations.filter((o) => {
      const age = now - new Date(o.created_at).getTime();
      return age > 30 * 86400000 && age <= 60 * 86400000;
    }).length;
    const trialsEndingSoon = subscriptions.filter(
      (s) =>
        s.status === "trialing" &&
        s.trial_ends_at !== null &&
        new Date(s.trial_ends_at).getTime() - now <= 14 * 86400000,
    ).length;

    const signupTrend: { month: string; count: number }[] = [];
    for (let index = 5; index >= 0; index -= 1) {
      const start = new Date();
      start.setUTCDate(1);
      start.setUTCHours(0, 0, 0, 0);
      start.setUTCMonth(start.getUTCMonth() - index);
      const end = new Date(start);
      end.setUTCMonth(end.getUTCMonth() + 1);
      signupTrend.push({
        month: start.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }),
        count: organizations.filter((o) => {
          const created = new Date(o.created_at).getTime();
          return created >= start.getTime() && created < end.getTime();
        }).length,
      });
    }

    const planDistribution = planRows.map((plan) => {
      const subscribers = activeSubs.filter((s) => s.plan_id === plan.id).length;
      return {
        id: plan.id,
        name: plan.name,
        active: plan.active,
        monthlyPrice: Number(plan.monthly_price),
        subscribers,
        revenue: subscribers * Number(plan.monthly_price),
      };
    });

    return {
      totalOrganizations: organizations.length,
      activeOrganizations: organizations.filter((o) => o.status === "active").length,
      suspendedOrganizations: organizations.filter((o) => o.status === "suspended").length,
      deactivatedOrganizations: organizations.filter((o) => o.status === "deactivated").length,
      totalUsers: members.count ?? 0,
      totalGuards: guards.count ?? 0,
      totalSites: sites.count ?? 0,
      openIncidents: incidents.count ?? 0,
      activeSubscriptions: activeSubs.length,
      trialingSubscriptions: subscriptions.filter((s) => s.status === "trialing").length,
      trialsEndingSoon,
      newLast30Days,
      newPrevious30Days,
      signupTrend,
      planDistribution,
      mrr,
      outstanding,
      currency: planRows[0]?.currency_code ?? "LKR",
    };
  });


export const listPlatformCompanies = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertPlatformAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [{ data: orgs }, { data: members }, { data: subs }, { data: plans }, { data: guards }] = await Promise.all([
      supabaseAdmin.from("organizations").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("organization_members").select("organization_id"),
      supabaseAdmin.from("subscriptions").select("organization_id, plan_id, status, trial_ends_at, current_period_end"),
      supabaseAdmin.from("subscription_plans").select("id, name, code"),
      supabaseAdmin.from("guards").select("organization_id"),
    ]);

    const memberCount = new Map<string, number>();
    for (const m of members ?? []) memberCount.set(m.organization_id, (memberCount.get(m.organization_id) ?? 0) + 1);
    const guardCount = new Map<string, number>();
    for (const g of guards ?? []) guardCount.set(g.organization_id, (guardCount.get(g.organization_id) ?? 0) + 1);
    const planName = new Map((plans ?? []).map((p) => [p.id, p.name]));
    const subByOrg = new Map((subs ?? []).map((s) => [s.organization_id, s]));

    return (orgs ?? []).map((org) => {
      const sub = subByOrg.get(org.id);
      return {
        ...org,
        member_count: memberCount.get(org.id) ?? 0,
        guard_count: guardCount.get(org.id) ?? 0,
        subscription_status: sub?.status ?? "none",
        plan_name: sub ? planName.get(sub.plan_id) ?? "—" : "—",
        trial_ends_at: sub?.trial_ends_at ?? null,
        current_period_end: sub?.current_period_end ?? null,
      };
    });
  });

export const setOrganizationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ organizationId: z.string().uuid(), status: z.enum(["active", "suspended", "deactivated"]) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertPlatformAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("organizations").update({ status: data.status }).eq("id", data.organizationId);
    if (error) throw error;
    return { ok: true };
  });

export const listPlatformPlans = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertPlatformAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: plans }, { data: subs }] = await Promise.all([
      supabaseAdmin.from("subscription_plans").select("*").order("monthly_price", { ascending: true }),
      supabaseAdmin.from("subscriptions").select("plan_id, status"),
    ]);
    const activeCount = new Map<string, number>();
    for (const s of subs ?? []) {
      if (s.status === "active" || s.status === "trialing") activeCount.set(s.plan_id, (activeCount.get(s.plan_id) ?? 0) + 1);
    }
    return (plans ?? []).map((p) => ({ ...p, subscriber_count: activeCount.get(p.id) ?? 0 }));
  });

export const setPlanActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ planId: z.string().uuid(), active: z.boolean() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertPlatformAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("subscription_plans").update({ active: data.active }).eq("id", data.planId);
    if (error) throw error;
    return { ok: true };
  });

export const listPlatformAdmins = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertPlatformAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: admins, error } = await supabaseAdmin.from("platform_admins").select("user_id, created_at");
    if (error) throw error;
    const rows = await Promise.all(
      (admins ?? []).map(async (a) => {
        const { data } = await supabaseAdmin.auth.admin.getUserById(a.user_id);
        return { user_id: a.user_id, created_at: a.created_at, email: data.user?.email ?? "unknown" };
      }),
    );
    return rows;
  });

export const addPlatformAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ email: z.string().email() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertPlatformAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    if (listError) throw listError;
    const target = users.users.find((u) => u.email?.toLowerCase() === data.email.toLowerCase());
    if (!target) throw new Error("No account found with that email");
    const { error } = await supabaseAdmin.from("platform_admins").insert({ user_id: target.id });
    if (error) throw error;
    return { ok: true };
  });

export const removePlatformAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ userId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertPlatformAdmin(context.supabase, context.userId);
    if (data.userId === context.userId) throw new Error("You cannot remove your own platform admin access");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("platform_admins").delete().eq("user_id", data.userId);
    if (error) throw error;
    return { ok: true };
  });

export const checkPlatformAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("platform_admins")
      .select("user_id")
      .eq("user_id", context.userId)
      .maybeSingle();
    return { isPlatformAdmin: !!data };
  });
