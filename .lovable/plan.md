# GuardDesk: fix and finish

Two full audits (application defects and security/tenant isolation) just finished. This plan fixes everything they found and closes the remaining gaps so GuardDesk can be used for real work.

## 1. Security and data isolation (do first)

- **Company admins can undo a platform suspension.** Today a company admin can edit their own company record directly and set it back to active. Lock the status field so only platform administrators can change it.
- **Client-portal users see everything in the company.** A person invited as a client can currently read every other client, every guard's personal details, every contract value and every incident. Restrict the client role to only the sites, contracts, reports and invoices that belong to them.
- **Guards see commercial data.** Guards can read client billing details and contract values. Restrict them to their own shifts, sites, patrols, incidents and documents.
- **Hard-coded bootstrap admin.** Keep the existing platform admin account but stop future environments from auto-granting it; platform admins are added from the Platform Admins screen instead.

## 2. Platform admin dashboard fixes

- Finding an account by email when adding a platform admin currently only searches the first 1000 accounts, and can silently say "no account found". Fix the lookup.
- The admin list makes one lookup per admin and hides failures behind "unknown". Batch it and show a real error state.
- The "am I a platform admin?" check runs before sign-in settles and produces error noise; make it wait for the session and treat a missing session as "not an admin".
- Dashboard money is formatted with a currency picked at random from the plan list. Use a deterministic platform default and group totals by currency when plans differ.
- Status badges: trialing, past due, canceled and none all look identical. Give each its own colour so "needs attention" is readable at a glance.
- Replace the browser confirm pop-ups on suspend/deactivate/remove with the app's own confirmation dialog, and disable buttons while the action is running.
- Fix sidebar highlighting to match on path boundaries.

## 3. Finish the company workflows

Several modules are currently read-only shells. Make each one complete: create, edit, filters, empty states, validation, and toasts.

- Clients, sites and posts: full create/edit, site-to-client linkage, posts per site.
- Contracts: create/edit with rates, billing rules and status.
- Scheduling: create shifts, assign guards, spot uncovered posts.
- Attendance: clock in/out records, review and approval, corrections that keep the original value, reason and who changed it.
- Patrols: routes, checkpoints, runs and scans, with missed/late/out-of-order flags.
- Incidents and daily reports: create, attach site/post/guard, status workflow.
- Guards and documents: profile management, document upload to private storage, expiry warnings.
- Payroll: build a period from approved attendance, adjustments, approval.
- Billing: invoices from approved billable work, payments, outstanding.
- Profitability: revenue minus payroll minus expenses by client, site, contract and period.
- Audit log entries for every sensitive action.

## 4. Quality pass

- Clean up the remaining lint warnings, including the unstable timer/effect pattern.
- Loading, empty and error states on every screen.
- Mobile-first guard screens: today's shift, clock in, patrol, report incident, daily report, clock out.
- Re-run type checks, tests, the security linter and page checks, and walk the main flows in a browser.

## Technical notes

- All access rules change through Supabase migrations (RLS policies plus column-level restriction on `organizations.status`, role-aware SELECT policies using the existing `has_org_role` helper, and a `client_site_access` scoping table for portal users).
- Writes go through `createServerFn` handlers with `requireSupabaseAuth`, Zod validation and tenant checks; the service-role client stays server-side and behind authorization checks.
- Money stays numeric/decimal; no pricing, wage or regulatory rule is hard-coded — all read from configuration tables.
- No new frameworks; existing TanStack Start + Tailwind + shadcn design system and Supabase setup are preserved.

## Note on the reported error

`src/lib/utils.ts(8,7)` keeps being reported, but that file has only six valid lines and the full TypeScript check passes. That message is stale and needs no fix.
