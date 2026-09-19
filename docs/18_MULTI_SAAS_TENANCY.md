# Multi-SaaS Tenancy Design

## 1. Objective

Mendukung dua model client dalam satu platform tanpa duplikasi aplikasi:

1. **Individual Teacher Client** → tenant `INDIVIDUAL`, satu Personal Workspace.
2. **Institution Client** → tenant `INSTITUTION`, banyak member tetapi hanya dua role internal: `ADMIN` dan `TEACHER`.

Super Admin mengoperasikan platform, bukan berada di dalam tenant client.

## 2. Core Entities

```text
User
 ├─ owns → Personal Tenant (INDIVIDUAL)
 └─ memberships → Institution Tenant A/B/...

Tenant
 ├─ Subscription
 ├─ Entitlements
 ├─ Usage
 ├─ Documents
 ├─ Questions
 ├─ Templates
 └─ (INSTITUTION only) Institution Profile + Admin + Teachers
```

## 3. Tenant vs Institution

Tenant adalah boundary security/billing. Pada MVP satu tenant `INSTITUTION` memiliki profil lembaga/sekolah utama. Jika kelak satu yayasan membutuhkan banyak unit MI/MTs/MA, unit dapat ditambahkan sebagai data akademik tanpa menambah role baru; role tetap hanya `ADMIN` dan `TEACHER`.

## 4. Active Context

Setelah login sistem menentukan `active_tenant_id`. Semua service domain mendapatkan `TenantContext` dari middleware. User tidak dapat memilih tenant hanya dengan mengirim ID; server memverifikasi membership.

## 5. Data Ownership

- Personal documents → tenant individual.
- Institution documents → tenant institution.
- Global CP/regulation → platform/global master; **mutasi CP hanya `SUPER_ADMIN`**.
- Tenant custom template/config → tenant.
- Copy antarworkspace menghasilkan record baru dengan `copied_from` provenance.

## 6. Storage Isolation

```text
tenants/{tenant_public_id}/documents/...
tenants/{tenant_public_id}/exports/...
tenants/{tenant_public_id}/uploads/...
```

Global regulation: `global/regulations/...`.

## 7. Cache & Queue

Cache key: `tenant:{tenant_id}:{domain}:{key}`. Semua queued jobs serialize tenant id dan service me-resolve tenant context sebelum eksekusi.

## 8. Search/Vector Isolation

Jika memakai vector database, setiap record harus memiliki tenant namespace/filter. Global regulation collection dipisahkan dari tenant private knowledge.

## 9. Super Admin Access

Super Admin dapat manage metadata tenant. Untuk membuka isi tenant, gunakan support session dengan:

- reason wajib;
- actor;
- tenant;
- expiry;
- banner `Support Mode`;
- full audit.

## 10. Lifecycle

Tenant: `TRIAL → ACTIVE → PAST_DUE/GRACE → SUSPENDED → CANCELLED`. Read/export policy saat grace/suspended dikonfigurasi di billing policy.


## 11. Institution Roles

- `ADMIN`: institution profile, logo/letterhead, academic year, teacher CRUD/invitation, usage/status package.
- `TEACHER`: generators, teaching documents, questions, bank soal, exports.

Tidak ada approval chain pada MVP.
