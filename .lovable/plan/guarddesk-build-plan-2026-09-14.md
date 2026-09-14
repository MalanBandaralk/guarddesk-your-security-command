# GuardDesk — Build Plan

A multi-tenant SaaS for running a private security company. Sri Lanka first, other markets later. The product is large, so it is built in four phases; each phase ends with a genuinely working app, not placeholder screens.

The chain the product must make feel connected:
Clients & Contracts → Sites & Posts → Scheduling → Deployment → Attendance → Patrols → Incidents & Reports → Payroll → Billing → Profitability

## Phase 1 — Foundation, operations and attendance

**Brand and design system**
- Calm, professional B2B look: neutral surfaces, dark readable text, one restrained accent, subtle borders, soft shadows, controlled radius, Inter typography. Green = success, amber = warning, red = critical, neutral = normal. No gradients, glass, neon, decorative charts or clutter. No shields or tactical imagery.
- Shared shell: sidebar (Dashboard, Operations, Guards, Clients & Sites, Patrols, Incidents, Payroll, Billing, Reports, Documents) plus a secondary group (Team, Equipment, Leave & Availability, Expenses, Settings, Audit Log). Top bar with global search and account menu.
- Reusable pieces built once: page header, stat card, data table (search, filter, sort, pagination, card layout on phones), status badges, detail drawer, form fields with inline validation, skeletons, empty states, error states, toasts, confirmation dialogs. Every page answers: what is this, what needs attention, what can I do next.

**Public marketing site**
- Landing page at `/`: hero, product overview, the workflow chain, key features, pricing, security, FAQ, demo request, sign in. Honest claims only, same brand as the app.

**Accounts, roles and tenancy**
- Sign up, sign in, password reset. Every company record belongs to an organization, isolated at the database level.
- Roles: Owner/Admin, Operations Manager, Supervisor, Guard, Finance, Client. Platform Administrator is a separate area with its own access model.

**Data foundation**
- Organizations, profiles, organization members, clients, sites, posts, contracts, guards, document types, guard documents, shifts, shift assignments, attendance records, notifications, audit logs. Money as exact decimal values.
- Demo company: a realistic Sri Lankan security firm with clients, sites, posts, guards, supervisors, shifts, attendance, contracts, documents and LKR figures, so the product is understandable on first open.

**Working in Phase 1**
- Dashboard, operations-first: an "Attention needed" list (missing check-ins, late arrivals, vacant posts, expiring documents, expiring contracts) where each item links to the record, plus guards on duty, coverage and upcoming shifts. Hierarchy over volume.
- Clients & Sites: clients with contacts, billing details, status and notes; sites with address, coordinates, geofence radius, contact, supervisor, required guards, operating hours, emergency contacts and instructions; posts with required count, shift pattern and coverage. Required vs Scheduled vs Present shown clearly.
- Contracts: client, sites, dates, value, billing frequency, required guards and posts, service type, overtime rules, documents, renewal status (Draft, Active, Expiring, Expired, Cancelled).
- Guards: tabbed profiles (details, documents, schedule, attendance, incidents, leave) with photo, employee ID, NIC/passport, contacts, emergency contact, supervisor, skills, status.
- Operations command center: daily deployment board and weekly roster over Client → Site → Post → Shift → Guard → Status. One-time and recurring shifts, day/night/custom, open shifts, vacant posts, replacements, reassignment, supervisor assignment, double-booking prevention, overtime and availability warnings.
- Attendance: guard clock in and out with location checked against the site geofence; flags for late, early departure, missed check-in, outside geofence, missing clock-out. Manager corrections keep the original value, the new value, the reason, the actor and the timestamp — nothing is silently overwritten. Approved attendance is what later feeds payroll and billing.
- Documents & compliance: configurable document types, expiry tracking as missing / valid / expiring soon / expired. No regulatory rules hard-coded.
- Guard mobile experience: a separate mobile-first home showing today's shift, site, post and times, with large Clock In, Patrol, Report Incident, Daily Report, Emergency and Clock Out actions. No admin functions exposed to guards.
- Audit log covering the sensitive actions above, not editable by ordinary users.

## Phase 2 — Field operations
Patrol routes, checkpoints, expected times and sequence, QR scanning with GPS verification (NFC where supported), patrol runs and scans, expected vs completed, and highly visible missed / late / out-of-order / invalid-location exceptions. Incidents with type, severity, status, people, photos, location and follow-up, with prominent critical alerts and a fast mobile form. Daily activity reports from configurable templates that reuse attendance, patrol and incident data instead of re-asking. Post orders with guard acknowledgement and timestamps. Supervisor workspace with assigned sites, coverage and exceptions, plus configurable site inspection checklists with scores, findings and corrective actions. Leave types, requests, approval, availability and conflict warnings. Simple equipment and uniform issue and return.

## Phase 3 — Money and reporting
Configurable pay rules (normal, overtime, night, holiday, allowances, deductions, advances, bonuses). Payroll periods built from approved attendance: review, adjustment, approval, payroll — every amount explainable and adjustments audited. Invoices from contract, site, period, billable hours, overtime and additional services, with states Draft, Sent, Partially Paid, Paid, Overdue, Cancelled, plus payments and balances. Expenses with configurable categories. Profitability as Revenue − Payroll − Expenses by client, site, contract and period, with margin and warnings for low-margin contracts, excessive overtime and unbilled approved work. Reports with date, client, site, supervisor and guard filters, CSV export and polished PDF client reports. Notifications with per-user preferences.

## Phase 4 — Platform admin and client portal
Platform administrator area: security companies, company users, plans, pricing, discounts, trials, subscriptions, payments, usage and plan limits, with activation, suspension, deactivation and reactivation that never delete tenant data. Pricing entirely database-driven with pricing history. Client portal restricted to a client's own coverage, guards, attendance summaries, patrol compliance, incidents, daily reports, inspections, contracts, invoices, payments and approved documents — never payroll, internal notes or profitability.

## Portability — future migration to Vercel / self-hosting
You plan to migrate the app off Lovable hosting later and self-host on Vercel. The build keeps that path clean:
- Standard, portable stack: plain React + TanStack Start, so the repo deploys to Vercel with the standard framework preset — no Lovable-proprietary runtime dependencies in the application code itself.
- All configuration through environment variables (Supabase URL, keys, secrets) — never hard-coded endpoints or credentials — so moving hosts means updating env vars, not code.
- Server code uses Web-standard fetch, crypto and streams only — no host-specific filesystem or Node-only APIs — keeping server functions compatible with Vercel (Node or Edge) serverless functions.
- Database stays fully in Supabase: schema changes are plain, reviewable SQL migrations under `supabase/migrations/`, so the database and its history move independently of the web host and can later point at a self-hosted Postgres.
- Files live in Supabase Storage with signed URLs, not host-local disk, so nothing is lost on migration.
- Migration checklist when you're ready: connect the GitHub repo to Vercel, set the environment variables, keep the Supabase project unchanged, update auth redirect URLs, deploy.

## Code quality bar
- Clean, secure, migratable code throughout: strict TypeScript (no `any`), small single-purpose components, business rules in one shared place (no duplicated logic), comments where intent isn't obvious.
- Security non-negotiable: RLS on every tenant table, server-side validation for all sensitive operations, audit logging, private storage for confidential files, no secrets in the frontend.
- Every feature implemented with real, production-quality logic — no dead code, no placeholder-but-looks-live screens, no shortcuts that would need rework before going live.

## Technical notes
- TanStack Start + React + TypeScript (strict) + Tailwind on the connected Supabase project (Auth, Postgres, Storage). Feature-based modules, shared business logic centralized, no `any`, no giant components.
- Tenant isolation through row-level security keyed to organization membership; the browser is treated as untrusted and frontend role checks are for presentation only.
- Server-side enforcement for permissions, tenant ownership, payroll and billing calculations, pricing changes, attendance corrections, privileged file operations and platform-admin actions. Guards against cross-tenant reads, IDOR and privilege escalation.
- Confidential files in private storage with signed access and validated upload type and size. No service-role key or secret ever reaches the browser.
- Decimal/numeric for all money; no floating-point arithmetic in financial calculations. UUID keys, foreign keys, constraints and indexes throughout, with pagination on large lists.
- Compatible with GitHub, Vercel and Supabase. A separate verification pass after the build tests workflows, permissions, tenant isolation, mobile, attendance, scheduling, patrols, incidents, payroll, billing, reporting and platform admin.
