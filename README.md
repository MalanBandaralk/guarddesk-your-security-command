# GuardDesk: Your Security Command

Build a complete, production-quality, multi-tenant SaaS web application called GuardDesk for private security companies.

The primary market is Sri Lanka, but the architecture must be flexible enough to support other markets later.

GuardDesk must be modern-looking, professional, simple to understand, easy to use, responsive, secure, and operationally practical.

Do not make GuardDesk feel like an old enterprise ERP. It should feel like a polished modern SaaS product that a security company can learn and use quickly.

The product should be powerful internally but intentionally simple at the user interface level.

1. PRODUCT VISION

GuardDesk is the central operating system for a private security company.

It helps security companies:

manage clients

manage sites and posts

manage guards

deploy guards

schedule shifts

verify attendance

verify patrols

report incidents

produce daily reports

manage supervisors

manage guard documents

prepare payroll

bill clients

track expenses

understand contract profitability

The main operational chain is:

Clients & Contracts → Sites & Posts → Scheduling → Deployment → Attendance → Patrols → Incidents / Reports → Payroll → Billing → Profitability

The application should make this chain feel connected.

Core promise:

Know who is deployed, where they should be, whether they showed up, what happened, what the client was billed, and whether the contract is profitable.

2. BRAND & PRODUCT IDENTITY

Product name:

GuardDesk

GuardDesk should communicate:

professional security operations

operational control

simplicity

reliability

visibility

accountability

The brand should feel suitable for both a small security company and a growing professional security provider.

Do not make the branding overly militaristic, aggressive or cliché.

Avoid excessive use of shields, police-style graphics, tactical imagery or generic security stock visuals.

The product should feel like a modern business software platform.

3. PRODUCT DESIGN PRINCIPLE

The most important design goal is:

Make complex security operations feel simple.

Do not build every feature as a separate complicated module.

Users should be able to complete common tasks quickly without understanding the entire system.

Prioritize:

Deployment

Attendance proof

Patrol proof

Incident reporting

Daily reporting

Payroll preparation

Client billing

Client transparency

Profitability

Avoid unnecessary enterprise complexity.

Do not add advanced functionality merely to make the product appear larger.

4. USER ROLES

Support these roles:

Company Owner / Admin

Full company access and configuration.

Operations Manager

Manages deployment, schedules, guards, attendance, patrols and incidents.

Supervisor

Manages assigned sites, guards, inspections, incidents and operational exceptions.

Guard

Only sees their assigned work and field actions.

Finance

Manages payroll, billing, payments, expenses and financial reporting.

Client

Secure client portal with access only to their own information.

Platform Administrator

Separate SaaS-level administrator. Never treat this as a normal company user.

5. MAIN NAVIGATION

Keep navigation focused.

Primary:

Dashboard

Operations

Guards

Clients & Sites

Patrols

Incidents

Payroll

Billing

Reports

Documents

Secondary:

Team

Equipment

Leave & Availability

Expenses

Settings

Audit Log

Do not put every database entity in the main sidebar.

Use contextual actions inside relevant pages.

6. VISUAL DESIGN SYSTEM

GuardDesk must look like a premium modern B2B SaaS product.

Use Inter or another highly readable professional sans-serif.

Preferred visual direction:

clean neutral/white backgrounds

dark readable typography

restrained brand accent

subtle borders

soft shadows

excellent spacing

controlled corner radius

strong visual hierarchy

clean cards

polished tables

polished forms

professional badges

simple useful charts

consistent icons

Use:

green for success

amber for warning

red for critical/urgent

neutral colors for ordinary information

Avoid:

excessive gradients

glassmorphism

neon colors

excessive shadows

huge cards

oversized headings

excessive pill-shaped UI

overly rounded interfaces

unnecessary animation

decorative charts

dashboard clutter

excessive icons

dense old-style enterprise tables

large empty areas with little useful content

The visual identity should feel modern, refined, trustworthy and operationally serious.

7. INFORMATION HIERARCHY

Every page should answer:

What am I looking at?

What needs attention?

What can I do next?

Use:

clear page titles

short descriptions where useful

obvious primary actions

useful filters

compact secondary controls

consistent status indicators

meaningful empty states

useful loading states

useful error states

Avoid putting too much information above the fold.

Prioritize actionable information.

8. DASHBOARD

The GuardDesk dashboard should be operations-first.

Show actionable metrics such as:

Guards on duty

Missing check-ins

Late check-ins

Vacant posts

Upcoming shifts

Missed patrols

Open incidents

Critical incidents

Expiring documents

Expiring contracts

Pending payroll

Outstanding invoices

Revenue

Payroll cost

Expenses

Estimated profit

Estimated margin

Do not create a giant dashboard containing every metric.

Use intelligent hierarchy.

Example:

Attention Needed

“3 guards have not checked in”

“2 posts are currently vacant”

“1 patrol was missed”

“2 documents expire this week”

These should link directly to the relevant records.

The dashboard should answer:

Are all sites covered?

Who is currently working?

Who is missing or late?

What went wrong?

What needs action?

Are contracts profitable?

9. OPERATIONS COMMAND CENTER

Create a dedicated Operations page.

Core hierarchy:

Client → Site → Post → Shift → Guard → Status

Provide:

daily deployment board

weekly roster

calendar

open shifts

vacant posts

late arrivals

missing attendance

replacements

supervisor assignments

overtime warnings

leave conflicts

guard availability

Support:

one-time shifts

recurring shifts

day shifts

night shifts

custom shifts

replacement guards

reassignment

Prevent double-booking.

Use practical interactions rather than making everything drag-and-drop.

10. GUARDS

Create polished guard profiles.

Information:

full name

photograph

employee ID

NIC/passport

phone

email

address

emergency contact

joining date

employment status

supervisor

skills

training

certifications

documents

current site

current shift

attendance

patrol history

incidents

leave

payroll

performance

Statuses:

Active

On Leave

Suspended

Inactive

Use tabs or clearly separated sections instead of one crowded screen.

11. DOCUMENTS & COMPLIANCE

Create configurable document types.

Each document can contain:

document type

person/entity

reference number

issue date

expiry date

attachment

status

notes

Show:

missing

valid

expiring soon

expired

Allow administrators to create and edit document types.

Do not hard-code regulatory assumptions.

Training, certification, documentation and compliance requirements must be configurable.

12. CLIENTS

Each client should have a clean overview.

Include:

company name

primary contact

phone

email

address

billing information

status

notes

Related information:

sites

contracts

deployed guards

attendance

patrols

incidents

reports

inspections

invoices

payments

profitability

Users should be able to move naturally from a client to its site and contract information.

13. SITES

A site belongs to a client.

Fields:

site name

client

address

GPS coordinates

geofence radius

site contact

phone

supervisor

required guard count

operating hours

emergency contacts

special instructions

status

Clearly display:

Required Guards vs Scheduled Guards vs Guards Present

This is a high-value operational metric.

14. POSTS

A site can contain multiple posts.

Post information:

post name

description

required guard count

shift pattern

post orders

patrol requirements

checklist requirements

status

Clearly show coverage.

15. CONTRACTS

Contracts connect operations and finance.

Include:

client

sites

start date

end date

contract value

billing frequency

required guards

required posts

service type

overtime rules

additional services

special requirements

contract documents

renewal status

Statuses:

Draft

Active

Expiring

Expired

Cancelled

Support recurring billing.

Show contract profitability.

16. ATTENDANCE

Attendance is a core GuardDesk feature.

Guards should be able to:

view assigned shift

see site/post

clock in

clock out

view attendance status

Record:

guard

shift

site

post

timestamp

GPS

geofence verification

verification status

optional selfie/photo if enabled

relevant device information where appropriate

Flag:

late

early departure

missed check-in

outside geofence

missing clock-out

Attendance corrections must be auditable.

When a manager changes attendance:

retain original value

store new value

store reason

store user

store timestamp

Do not silently overwrite critical attendance data.

Approved attendance should feed payroll and configurable client billing.

17. GUARD MOBILE EXPERIENCE

The guard interface should be completely different from the administration experience.

Make it mobile-first.

The home screen should prominently show:

Today's Shift

Site

Post

Start time

End time

Primary actions:

Clock In

Patrol

Report Incident

Daily Report

Emergency

Clock Out

The guard should complete the core workflow with very few taps.

Do not expose administrative functions to guards.

Use large touch targets.

Keep text clear.

Minimize typing.

18. GPS & GEOFENCING

GPS is used primarily for:

attendance verification

patrol verification

incident location

operational visibility

Allow configurable site geofences.

Do not force continuous live tracking by default.

Continuous tracking should only be available where operationally necessary and explicitly enabled.

Protect employee privacy and minimize unnecessary location collection.

19. PATROLS

Create a professional but simple guard-tour system.

A site may have:

patrol routes

checkpoints

expected patrol times

required sequence

checklists

Verification options:

QR

NFC where supported

GPS/geofence

Record:

guard

site

route

checkpoint

timestamp

GPS

status

optional photograph

optional note

Flag:

missed

late

invalid location

out of order

Display:

Expected vs Completed

Make patrol exceptions highly visible to supervisors.

20. INCIDENTS

Create structured incident reporting.

Fields:

site

post

date/time

reporter

incident type

severity

description

people involved

photographs

location

immediate action

follow-up action

notes

status

Severity:

Low

Medium

High

Critical

Status:

Reported

Under Review

Action Required

Resolved

Critical incidents should produce prominent alerts.

The reporting form should be fast to complete on mobile.

21. DAILY ACTIVITY REPORTS

Replace paper-based daily activity reports.

Include:

site

guard

shift

activities

observations

issues

incidents

photographs

notes

supervisor review

approval

Allow configurable report templates and checklists.

Automatically reuse attendance, patrol and incident data where possible.

Do not ask users to repeatedly enter information already recorded elsewhere.

22. POST ORDERS

Allow administrators to create site and post instructions.

Examples:

opening procedure

closing procedure

visitor procedure

restricted areas

emergency instructions

key handling

important contacts

escalation process

special client instructions

Guards must acknowledge relevant instructions.

Record acknowledgement date/time.

23. SUPERVISORS

Supervisors should have a practical operations workspace.

Show:

assigned sites

assigned guards

current coverage

attendance exceptions

patrol exceptions

incidents

daily reports

inspections

vacant posts

Provide configurable site inspection checklists.

Inspection information:

site

supervisor

date/time

checklist

score

findings

photographs

notes

corrective action

24. LEAVE & AVAILABILITY

Support:

leave requests

approval

leave types

availability

scheduling conflict warnings

Do not silently schedule unavailable guards.

25. EQUIPMENT & UNIFORMS

Keep this intentionally simple.

Track:

uniforms

radios

torches

keys

IDs

PPE

other equipment

Record:

item

assigned guard

issued date

returned date

condition

notes

Do not turn this into a full enterprise asset-management system.

26. PAYROLL

Payroll should use approved attendance.

Support configurable:

normal hours

overtime

night work

holiday work

allowances

deductions

advances

bonuses

Never hard-code wage assumptions.

Administrators must be able to configure pay rules.

Flow:

Attendance → Review → Adjustment → Approval → Payroll

Every payroll amount should be explainable.

Sensitive payroll adjustments must be auditable.

27. BILLING

Generate client invoices using:

contract

site

billing period

required service

approved attendance/billable hours

overtime

additional services

agreed rates

Invoice states:

Draft

Sent

Partially Paid

Paid

Overdue

Cancelled

Track:

invoice date

due date

amount

payments

balance

notes

Pricing and billing rules must be configurable.

28. EXPENSES

Keep expense management simple.

Include:

date

category

client/site

amount

description

attachment

user

status

Categories should be configurable.

29. PROFITABILITY

Profitability is a key GuardDesk differentiator.

Show:

Revenue − Guard Payroll − Expenses = Estimated Gross Profit

Display by:

client

site

contract

period

Show:

revenue

payroll

expenses

profit

margin %

Warn about:

low-margin contracts

excessive overtime

unexpected expenses

unbilled approved work

The information must be understandable to a business owner without accounting expertise.

30. CLIENT PORTAL

Create an optional secure client portal.

Clients may view:

current coverage

assigned guards

attendance summaries

patrol compliance

incidents

daily reports

site inspections

contracts

invoices

payments

approved documents

Never expose:

internal payroll

employee-private information

internal profitability

internal notes not intended for clients

Client users must only see their own organization's data.

31. REPORTS

Provide useful reports:

attendance

absenteeism

late arrivals

overtime

coverage

patrol compliance

incidents

site performance

guard performance

client performance

revenue

payroll cost

expenses

profitability

outstanding invoices

expiring documents

Support:

date range

client filter

site filter

supervisor filter

guard filter

CSV export where appropriate

Create polished PDF client reports where useful.

32. NOTIFICATIONS

Notifications must be useful rather than excessive.

Examples:

missing check-in

late check-in

vacant post

missed patrol

critical incident

expiring document

expiring contract

leave approval

overdue invoice

Allow configurable notification preferences.

33. GLOBAL SEARCH

Provide fast search across:

guards

clients

sites

posts

contracts

incidents

reports

invoices

Make search easy to access from the main application.

34. PLATFORM ADMIN

Create a separate secure platform administrator area.

Platform Admin can manage:

security companies

company users

plans

pricing

discounts

trials

subscriptions

payments

usage

activation

suspension

deactivation

reactivation

Track usage such as:

users

guards

clients

sites

attendance

storage

activity

Deactivation must disable access without deleting tenant data.

Pricing must be database/config driven.

Support:

monthly pricing

annual pricing

trial periods

discounts

custom pricing

plan limits

feature availability

pricing history

Never hard-code platform pricing into frontend components.

35. MULTI-TENANCY

GuardDesk is a true multi-tenant SaaS.

All company-owned records must belong to an organization/tenant.

Use database-level tenant isolation.

Never rely on frontend filtering for security.

36. SECURITY

Use:

Supabase Auth

PostgreSQL

Row Level Security

Supabase Storage

Supabase Edge Functions

Treat the browser as untrusted.

Never expose:

service-role keys

secrets

privileged credentials

Sensitive logic must be server-side.

Use server-side validation for:

permission checks

role checks

tenant ownership

payroll calculations

billing calculations

pricing changes

attendance corrections

sensitive file operations

platform-admin actions

Protect against:

IDOR

privilege escalation

cross-tenant data leakage

manipulated attendance

manipulated payroll

manipulated invoices

unauthorized client access

unsafe uploads

Use private storage for confidential files.

Validate upload type and size.

Use signed access where appropriate.

37. AUDIT LOG

Log important actions:

user creation

deactivation

role changes

guard changes

schedule changes

attendance corrections

payroll changes

invoice changes

payment changes

contract changes

incident changes

document changes

pricing changes

platform-admin actions

Record:

actor

action

entity

entity ID

timestamp

old value where practical

new value where practical

Normal users must not be able to delete or alter audit history.

38. DATABASE

Use a well-structured PostgreSQL relational model.

Core entities should include:

organizations
profiles
organization_members
clients
sites
posts
contracts
guards
guard_documents
document_types
shifts
shift_assignments
attendance_records
patrol_routes
patrol_checkpoints
patrol_runs
patrol_scans
incidents
daily_reports
post_orders
post_order_acknowledgements
site_inspections
inspection_templates
leave_types
leave_requests
availability
equipment
equipment_assignments
pay_rules
payroll_periods
payroll_records
payroll_adjustments
invoices
invoice_items
payments
expenses
notifications
notification_preferences
audit_logs
subscription_plans
subscriptions
discounts
platform_payment_records

Use:

UUIDs

foreign keys

constraints

indexes

normalized relationships

consistent timestamps

Use numeric/decimal types for money.

Do not use floating-point arithmetic for financial calculations.

39. CODE QUALITY

Use the current Lovable-supported architecture and conventions.

Use:

TypeScript

strict typing

React/current Lovable framework conventions

Tailwind

reusable components

feature-based modular structure

Supabase

Edge Functions where appropriate

Keep the application compatible with:

GitHub

Vercel

Supabase

Avoid:

giant components

duplicate logic

unnecessary dependencies

unsafe any

frontend-only authorization

hard-coded pricing

hard-coded regulatory rules

tightly coupled features

Centralize reusable business logic.

40. RESPONSIVE DESIGN

GuardDesk must work exceptionally well across:

desktop

laptop

tablet

Android phones

iPhones

Desktop

Optimize for:

operations

dashboards

tables

scheduling

reporting

administration

Mobile

Optimize for:

guards

supervisors

attendance

patrols

incidents

reports

Do not simply shrink the desktop layout.

Create genuinely responsive layouts.

Tables should become usable mobile views/cards where necessary.

Forms should be comfortable on small screens.

Touch targets should be appropriately sized.

41. UX INTERACTION QUALITY

The app should feel polished.

Use:

subtle hover states

focused states

consistent transitions

skeleton/loading states

empty states

inline validation

contextual confirmation

clear success feedback

useful error messages

Avoid unnecessary animation.

Do not use browser alert() for ordinary application feedback.

Use:

inline messages

toast notifications

confirmation dialogs

appropriate application UI

Never leave the user wondering whether an action succeeded.

42. EMPTY / LOADING / ERROR STATES

Every major page and data-driven component should have:

useful loading state

useful empty state

graceful error state

Empty states should explain what the user can do next.

Example:

“No patrol routes have been created for this site yet.”

Then provide:

Create Patrol Route

Do not show blank screens.

43. FORMS

Forms must be:

simple

logically grouped

clearly labelled

mobile friendly

validated

easy to scan

Do not create huge forms unless genuinely necessary.

Use progressive disclosure for advanced fields.

Show only what is needed initially.

44. TABLES

Tables should be clean and practical.

Support:

search

filtering

sorting where useful

pagination for large datasets

clear status indicators

row actions

Do not put 15+ columns into ordinary views.

Use detail drawers, detail pages or tabs for secondary information.

45. DEMO / SAMPLE DATA

Create realistic demo data representing a Sri Lankan security company using GuardDesk.

Include:

company

several clients

several sites

multiple posts

guards

supervisors

shifts

attendance

patrol routes

incidents

reports

contracts

invoices

payments

expenses

payroll records

documents

Use realistic Sri Lankan-style names, business names, locations and LKR amounts.

The sample environment should make GuardDesk immediately understandable.

46. PUBLIC MARKETING WEBSITE

Create a polished public landing page for GuardDesk.

Position GuardDesk around:

simpler security operations

deployment visibility

attendance proof

patrol accountability

incident reporting

client reporting

payroll accuracy

profitability

Do not use exaggerated claims.

Include:

hero section

product overview

workflow

major features

pricing

security

FAQ

contact/demo CTA

sign-in

The marketing website and application should feel like the same brand.

Use GuardDesk consistently throughout the public site, application, page titles, metadata and messaging.

47. FINAL PRODUCT QUALITY

Before considering the application complete:

all pages must be connected

all major forms must save real data

edit/delete flows must work appropriately

loading/empty/error states must exist

authentication must work

permissions must work

tenant isolation must work

responsive layouts must work

sensitive data must be protected

no secrets may be exposed

no fake functionality may be presented as complete

no major placeholder screens should remain

no obvious TypeScript/build errors should remain

database relationships must work correctly

financial calculations must be reliable

core workflows must be coherent

The application should not feel like a collection of generated screens.

It should feel like one carefully designed product.

48. BUILD PHILOSOPHY

Build the core architecture and user experience cohesively.

Do not unnecessarily over-engineer.

Do not introduce complex libraries unless they solve a real need.

Prefer implementations that are:

secure

simple

maintainable

Vercel-friendly

Supabase-friendly

easy for Lovable to continue modifying

Prioritize quality over feature count.

49. FINAL EXPERIENCE TARGET

The finished product should feel like:

A modern command center for running a professional security company.

It must be:

Modern + Professional + Simple + Secure + Fast + Responsive + Easy to Learn

The interface should hide complexity rather than expose it.

Quality is more important than feature count.

Build connected workflows, not disconnected screens.

Build GuardDesk with production-quality code and a unified visual system.

After implementation, verify that the application builds successfully and fix obvious compilation, routing, type and runtime issues.

Do not spend this main build prompt on exhaustive browser testing. Build GuardDesk first.

A separate verification pass should then test the complete user workflows, permissions, tenant isolation, mobile experience, attendance, scheduling, patrols, incidents, payroll, billing, reporting and platform administration.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/22212464-f95a-49bb-b168-5f78aeda77ef).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
