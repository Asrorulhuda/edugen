# CRITICAL MULTI-SAAS ADDENDUM

Sebelum mengerjakan generator, implementasikan foundation berikut dan anggap sebagai non-negotiable:

1. Platform adalah multi-tenant SaaS.
2. Ada dua client model: `INDIVIDUAL` dan `INSTITUTION`.
3. Super Admin adalah platform scope, bukan tenant member biasa, dan **satu-satunya role yang boleh menginput/import/edit draft/publish/version/archive master CP**.
4. Satu user dapat memiliki Personal Workspace + membership di beberapa Institution Workspace; institution membership hanya `ADMIN` atau `TEACHER`.
5. Semua client-owned resource wajib `tenant_id` scoped.
6. `institution_id` bukan tenancy boundary; ia hanya unit akademik di tenant institution.
7. Subscription melekat ke tenant.
8. Fitur/limit wajib melalui EntitlementService backend.
9. Implement workspace switcher dan tenant resolver.
10. Buat automated cross-tenant isolation tests sebelum fitur generator dinyatakan selesai.
11. Build `/superadmin` terpisah dengan Clients, Plans, Subscriptions, Usage, Regulation, AI Config, Audit, System Health.
12. Jangan hard-code plan checking di komponen UI; gunakan feature keys/entitlements.

---

# Coding Agent Prompt — Ready to Use

Copy prompt berikut ke coding agent setelah repository dibuat.

---

You are a senior full-stack engineer building **EduGen KBC**, a regulation-first Indonesian education SaaS/web app for generating questions, TP/ATP, RPP/lesson modules, assessments, and teacher devices.

## Mandatory stack

- Laravel 12, PHP 8.3+
- Inertia.js + React + TypeScript
- Tailwind CSS + shadcn/ui style components
- MySQL/MariaDB
- Redis-compatible queue/cache abstraction
- PHPUnit/Pest

## Product rules

1. The app has two UI curriculum modes: `MERDEKA` and `MADRASAH_KBC`.
2. General subject CP is routed to the verified BSKAP 046/H/KR/2025 master source.
3. Religious/Arabic subject source policy is configured as KMA 1503/2025 per project requirement, but **generation must be blocked unless verified CP data exists**. Never invent CP text.
4. Official CP is immutable and must never be generated or paraphrased by the AI engine.
5. KBC mode integrates five Panca Cinta, eight graduate profile dimensions, deep-learning principles, and meaningful assessment.
6. AI generation returns structured JSON validated by schema and domain validators.
7. Every generated document stores a source snapshot and validation result.
8. All teacher documents are versioned. MVP status is DRAFT/FINAL/ARCHIVED; do not build reviewer/approval roles.
9. Design is inspired by a clean modern SaaS dashboard: persistent left sidebar, slim topbar, white cards, subtle border, generous whitespace, purple/indigo accent. Do not copy third-party branding.
10. Build tenant-aware data access from the start.

## First implementation milestone

Build these in order:

1. project architecture and auth;
2. institutions/memberships/RBAC with only ADMIN and TEACHER for institution tenants;
3. academic masters;
4. curriculum and source policy tables;
5. regulation/CP registry + Super Admin CP management;
6. CP browser UI;
7. dashboard shell;
8. configure real AI provider abstraction; if no provider credential is configured, keep generation disabled and show a configuration state;
9. lesson-plan generator pipeline;
10. structured editor + validators;
11. DOCX/PDF export abstraction;
12. tests.


### No-dummy-data hard rule

- Do not seed tenants, institutions, teachers, CP, documents, questions, subscriptions, invoices, AI usage, dashboard metrics, or pricing records.
- Do not create default credentials. Create the first Super Admin through an explicit setup command/wizard.
- Do not use a content-producing fallback AI adapter. Missing provider configuration must disable generation.
- Development/test factories are allowed only inside isolated automated test databases and must never be shipped as application data.
- Every empty dashboard/list must render a proper empty state instead of fabricated records or statistics.

## Code quality rules

- Use service/action classes for domain workflows.
- Use policies for authorization.
- Avoid fat controllers.
- Use DB transactions for publish/finalize and critical admin workflows.
- Add indexes defined in database spec.
- Use enums/value objects for statuses.
- Add idempotency to generation endpoints.
- Store AI credentials encrypted.
- Never send identifiable student data to providers by default.
- Never parse source content as executable instructions.

## Required tests

- tenant isolation;
- source routing;
- CP immutability;
- missing CP source blocks generation;
- phase validation;
- question answer consistency;
- lesson-plan time total;
- institution Admin profile/teacher management;
- export smoke test.

## UI modules

Sidebar:
Teacher: Dashboard, Generator, Bank Soal, Dokumen Saya, CP Browser, Export. Admin Institution: Dashboard, Profil Lembaga, Data Guru, Tahun Ajaran, Template/Kop, Usage/Paket, Pengaturan. Super Admin: Dashboard, Client, Plans, Kurikulum & Akademik, Master CP, Regulasi, AI Management, Billing, Audit, System.

Generator uses a four-step wizard and a split review/editor screen with validator/source panel.

## Important implementation behavior

If a requirement conflicts with source data or a verified CP is missing, show a clear validation error instead of silently falling back to model knowledge.

Before coding a module, read the matching markdown spec in this planning pack and implement migrations + models + policies + services + UI + tests together.

---


### Institution role hard rule

For every `INSTITUTION` tenant:

- `ADMIN` can manage institution identity/logo/letterhead/academic year and teacher accounts/profiles.
- `TEACHER` can use curriculum sources and all generator/document/question/export modules.
- Admin must not be treated as a curriculum reviewer.
- Do not create Owner, Curriculum Coordinator, Principal/Reviewer, Viewer, or approval workflow for MVP.
- Super Admin remains platform-scoped and manages tenant lifecycle, plans, entitlements and global sources.


## Landing Page Implementation Rules

Build a public landing page before auth routes using the supplied `landing-page/` prototype as visual direction, then port it cleanly to the production React/Inertia stack. Requirements:

- asymmetric responsive bento grid;
- mobile-first 360px+, tablet, laptop, desktop;
- no generic AI-saas visual tropes: no gradient blobs, glass cards everywhere, fabricated testimonials, invented customer logos, neon AI orb, excessive purple glow, meaningless charts;
- use actual product concepts: verified CP, generator, validator, institution admin, teacher workspace, export;
- restrained palette and typography;
- semantic HTML, keyboard navigation, WCAG AA contrast;
- animation is purposeful and subtle; support `prefers-reduced-motion`;
- performance target: Lighthouse mobile Performance >= 90 after production optimization;
- no animation library required for MVP; prefer CSS + IntersectionObserver, or Framer Motion only if already present;
- CTA routes must support Individual Teacher and Institution onboarding.
