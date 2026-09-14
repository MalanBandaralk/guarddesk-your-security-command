# GuardDesk — Build Plan

A multi-tenant SaaS for private security companies (Sri Lanka first). This is a large product, so it is built in phases. Each phase ends with a working, usable app — nothing half-wired.

## Phase 1 — Foundation (this first build)

**Brand & design system**
- GuardDesk visual identity: neutral/white surfaces, dark readable text, one restrained accent, subtle borders, soft shadows, controlled radius. Inter typography. Green/amber/red reserved for success/warning/critical. No gradients, glass, or neon.
- Shared shell: sidebar (Dashboard, Operations, Guards, Clients & Sites, Patrols, Incidents, Payroll, Billing, Reports, Documents), secondary group (Team, Equipment, Leave, Expenses, Settings, Audit Log), topbar with global search and account menu.
- Reusable building blocks: page header, stat card, data table (search/filter/sort/paginate, card view on mobile), status badges, detail drawer, form fields, loading skeletons, empty states, error states, toasts, confirm dialogs.

**Public marketing site**
- Landing page at `/`: hero, product overview, workflow chain, features, pricing, security, FAQ, demo CTA, sign in. Same brand as the app.

**Accounts & tenancy**
- Sign up / sign in / password reset. Every company record belongs to an organization; isolation enforced in the database, not the interface.
- Roles: Owner/Admin, Operations Manager, Supervisor, Guard, Finance, Client, plus a separate Platform Administrator area.

**Database foundation**
- Organizations, profiles, memberships, roles, clients, sites, posts, contracts, guards, document types, guard documents, shifts, shift assignments, attendance records, audit log. Money stored as exact decimal values.
- Demo data: a Sri Lankan security company with clients, sites, posts, guards, supervisors, shifts, attendance, contracts and documents in LKR.

**Working features in Phase 1**
- Dashboard: "Attention needed" list (missing check-ins, vacant posts, late arrivals, expiring documents) plus coverage and on-duty figures, each linking to the record.
- Clients & Sites: full create/edit/view, site coverage shown as Required vs Scheduled vs Present, posts under sites.
- Guards: profiles with tabs (details, documents, schedule, attendance, incidents).
- Operations: daily deployment board and weekly roster, one-time and recurring shifts, assign/replace guards, double-booking prevention.
- Attendance: guard clock in/out with location check against the site geofence; late / outside-fence / missed flags; manager corrections that keep the original value, reason, and author.
- Documents & compliance: configurable document types, expiry tracking (valid / expiring / expired / missing).
- Guard mobile experience: separate mobile-first home showing today's shift with large Clock In, Patrol, Report Incident, Daily Report, Emergency, Clock Out actions.
- Audit log for the actions above.

## Phase 2 — Field operations
Patrol routes, checkpoints, QR scanning, expected vs completed with exception flags; incidents with severity/status and critical alerts; daily activity reports with configurable templates reusing attendance/patrol/incident data; post orders with guard acknowledgement; supervisor workspace and site inspections; leave, availability and scheduling conflict warnings; equipment issue/return.

## Phase 3 — Money
Configurable pay rules, payroll periods from approved attendance with adjustments and approval; invoices from contracts and billable hours with payment tracking; expenses; profitability by client/site/contract/period with low-margin and overtime warnings; reports with filters and CSV/PDF export; notifications and preferences.

## Phase 4 — Platform admin & client portal
Platform administrator area: companies, plans, pricing, discounts, trials, subscriptions, usage, suspend/reactivate without deleting data. Client portal restricted to the client's own coverage, attendance summaries, patrol compliance, incidents, reports, invoices and payments.

## Technical notes
- TanStack Start + React + TypeScript (strict) + Tailwind, Supabase (Auth, Postgres, Storage) on the existing connected project.
- Tenant isolation via row-level security keyed to organization membership; role checks server-side. All privileged logic (payroll, billing, pricing, attendance corrections, platform admin) runs in server functions — never in the browser.
- Confidential files in private storage with signed access, type and size validated on upload.
- Numeric/decimal columns for all money; no floating-point arithmetic in financial calculations.
- Feature-based folder structure, shared business logic centralized, no `any`, no hard-coded pricing or regulatory rules.
- A separate verification pass after the build tests workflows, permissions, tenant isolation and mobile.
