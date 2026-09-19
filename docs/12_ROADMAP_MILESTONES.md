# Roadmap & Milestones

## Phase 0 — Source & Product Foundation (1–2 minggu)

- finalize nomenclature;
- regulation source registry;
- subject category mapping;
- import BSKAP CP;
- verify religion CP source strategy;
- UI design tokens;
- project scaffolding.

## Phase 1 — MVP Core (3–5 minggu)

- auth/institution;
- academic context;
- CP browser;
- TP generator;
- ATP generator;
- RPP/Modul generator Kurmer + KBC;
- document editor;
- AI job orchestration;
- validators;
- DOCX/PDF export.

## Phase 2 — Assessment & Question Bank (2–4 minggu)

- blueprint-first question generator;
- bank soal;
- package builder;
- rubrics;
- answer/explanation validator;
- spreadsheet export.

## Phase 3 — Workflow & Governance (2 minggu)

- status dokumen draft/final dan validator;
- comments;
- audit;
- regulation admin workflow;
- template management.

## Phase 4 — Teacher Device Suite (3–4 minggu)

- Prota;
- Promes;
- KKTP/IKTP advanced;
- remedial/pengayaan;
- journal;
- completeness dashboard.

## Phase 5 — SaaS & Scale (optional)

- subscription/quotas;
- tenant self-onboarding;
- provider cost routing;
- object storage;
- Redis scaling;
- observability;
- billing integration.

## Release Gates

Before production:

- CP source routing tests green;
- CP agama source verified;
- 0 critical cross-tenant issues;
- golden AI evaluation passed;
- export accepted by teacher pilot;
- backup/restore tested.

## Multi-SaaS Priority Update

### Phase 0 — SaaS Foundation (WAJIB sebelum generator production)

- users/auth;
- tenants `INDIVIDUAL` + `INSTITUTION`;
- memberships (`ADMIN`/`TEACHER` untuk institution) + workspace switcher;
- scoped RBAC;
- plans, subscriptions, entitlements, usage meter;
- Super Admin console;
- tenant isolation tests;
- individual and institution onboarding;
- institution admin profile + teacher management;
- teacher-only generator authorization.

### Rule

Jangan membangun generator sebagai single-tenant lalu melakukan retrofit. Semua generator, documents, question bank, export, AI usage, template harus tenant-scoped sejak migration awal.
