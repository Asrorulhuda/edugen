# System Architecture

## 1. Recommended Architecture

Modular monolith untuk MVP, siap dipecah bila trafik tinggi.

```text
Browser
  │
  ▼
Laravel + Inertia/React
  ├── Platform Control Plane (Super Admin)
  │   ├── Tenants/Clients
  │   ├── Plans/Subscriptions/Entitlements
  │   ├── Global Regulation/CP
  │   ├── AI Providers & Feature Flags
  │   └── Audit/Operations
  ├── Tenant Data Plane
  │   ├── Auth, Membership & RBAC
  │   ├── Workspace/Tenant Context
  │   ├── Institution/Academic Context
  │   ├── Curriculum Registry
  │   ├── Generator Orchestrator
  │   ├── Document Workspace
  │   ├── Question Bank
  │   ├── Review/Approval
  │   └── Export Service
  │
  ├── MySQL
  ├── Redis Queue/Cache
  ├── Object Storage
  └── AI Provider Adapters
```

## 2. Modules

### Identity Module

- users;
- institutions;
- memberships;
- roles/permissions (`ADMIN`, `TEACHER` untuk tenant institution);
- academic contexts.

### Curriculum Module

- curriculum modes;
- grades/phases;
- subjects/categories;
- regulation routing.

### Regulation Module

- source documents;
- extracted chunks;
- CP masters (write/publish hanya oleh Super Admin);
- verification;
- source versioning.

### Planning Module

- TP;
- ATP;
- RPP/modul;
- assessment plans;
- rubrics;
- related documents.

### Question Module

- blueprint;
- items;
- packages;
- answers;
- rubrics;
- tags.

### AI Module

- providers;
- prompt templates;
- generation jobs;
- usage;
- validators.

### Export Module

- DOCX;
- PDF;
- XLSX/CSV.

## 3. Tenancy

Aplikasi wajib **multi-tenant dari hari pertama** dengan dua tipe tenant:

- `INDIVIDUAL`: Personal Workspace milik guru;
- `INSTITUTION`: client sekolah/madrasah/yayasan/lembaga.

Gunakan `tenant_id` sebagai boundary utama data, bukan `institution_id`. `institution_id` dipakai sebagai unit akademik di dalam tenant lembaga. Ini memungkinkan satu tenant yayasan memiliki MI, MTs, MA sekaligus.

### Request lifecycle tenant-aware

```text
Authenticated User
   ↓
Resolve Active Workspace/Tenant
   ↓
Validate Membership / SuperAdmin Scope
   ↓
Load Subscription + Entitlements
   ↓
Apply Tenant Scope
   ↓
Execute Domain Action
   ↓
Write Usage + Audit
```

### Isolation requirements

- domain query default scope = active `tenant_id`;
- queue job selalu membawa `tenant_id`;
- cache key prefix menyertakan tenant;
- object storage key menyertakan tenant;
- export dan signed URL divalidasi tenant;
- audit log merekam tenant asal dan actor;
- background scheduler tidak boleh memproses data tanpa tenant context eksplisit.

Master global seperti regulation catalog, phase, global subjects, dan CP verified boleh bersifat system-wide. Tenant hanya menyimpan konfigurasi/override yang diizinkan.

## 3A. SaaS Control Plane

Control Plane hanya dapat diakses Super Admin dan dipisahkan route, middleware, policy, navigation, serta audit dari area client.

Komponen:

- Tenant Registry;
- Plan Catalog;
- Subscription Lifecycle;
- Entitlement Resolver;
- Usage Metering;
- Billing Provider Adapter;
- Feature Flag Service;
- AI Cost Metering;
- Support/Impersonation Service.

## 3B. Workspace Model

`tenant` adalah boundary billing dan security. `workspace` pada UI pada MVP dapat dipetakan 1:1 ke tenant. Untuk tenant instansi multi-unit, unit akademik dipilih setelah workspace atau menjadi filter context.

Satu user dapat memiliki banyak memberships. Pada tenant institution membership hanya boleh ber-role `ADMIN` atau `TEACHER`. Personal Workspace tetap independen saat user bergabung ke tenant institution.

## 4. Async Jobs

Gunakan queue untuk:

- AI generation;
- PDF export;
- DOCX rendering;
- source extraction/indexing;
- similarity scan;
- bulk question generation.

Job harus idempotent dengan `idempotency_key`.

## 5. Document Storage

Generated document content disimpan structured JSON + rendered HTML. File export adalah derivative.

```text
canonical = structured JSON
editable render = HTML/editor state
export = DOCX/PDF snapshot
```

Jangan menjadikan DOCX sebagai database utama.

## 6. Source Index

Untuk retrieval:

MVP sederhana:

- MySQL full text / chunk keyword index.

Production optional:

- pgvector/Qdrant/Weaviate atau provider vector store.

Tetap simpan deterministic relational mapping untuk CP.

## 7. Observability

- structured logs;
- Sentry/error tracking;
- generation job dashboard;
- AI latency/token/cost metrics;
- export failures;
- source validation errors.

## 8. Backup

- DB daily + weekly retained;
- object storage versioning;
- offsite backup;
- restore test berkala.

## 9. Scalability

Tahap awal satu Laravel app dapat menangani banyak sekolah dengan horizontal scaling bila session/cache di Redis dan file di object storage.

Bottleneck utama yang dipisahkan lebih dulu jika perlu:

1. AI generation workers;
2. export workers;
3. source ingestion workers.


## 13. Institution Role Boundary

Untuk tenant `INSTITUTION`, authorization client hanya mengenal dua role:

- `ADMIN`: school profile/settings, teacher CRUD/invitation, academic-year setup, template/kop, tenant usage.
- `TEACHER`: generator, personal-in-tenant documents, question bank, export.

Tidak ada service approval/reviewer pada MVP. Status dokumen cukup `DRAFT` dan `FINAL` (serta `ARCHIVED` bila dibutuhkan). Super Admin tetap berada di control plane terpisah.

## Zero-Dummy Bootstrap

Arsitektur bootstrap harus menghasilkan aplikasi operasional yang kosong. Migration hanya membangun schema dan deterministic domain definitions. Tidak ada seeder operasional untuk tenant, institution, user, CP, plan berharga, subscription, dokumen, soal, usage, atau statistik. First Super Admin dibuat melalui command/wizard eksplisit. Semua data bisnis berikutnya masuk melalui workflow aplikasi yang memiliki authorization dan audit trail.

