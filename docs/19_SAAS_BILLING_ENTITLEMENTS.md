# SaaS Billing & Entitlements

## 1. Principle

Paket bukan sekumpulan `if plan == pro`. Semua fitur dan limit diterjemahkan menjadi **entitlements** agar plan dapat diubah dari Super Admin tanpa redeploy.

## 2. Client Catalog

Plan memiliki `client_model`: INDIVIDUAL, INSTITUTION, atau BOTH. Harga final sengaja tidak dikunci dalam PRD ini agar dapat ditentukan bisnis kemudian.

## 3. Recommended Meter Types

- AI generation requests;
- AI token/cost equivalent;
- generated question items;
- exports;
- storage;
- active member seats;
- custom templates;
- regulation custom upload;
- analytics/API access.

## 4. Individual Packaging

Cocok dibedakan berdasarkan generation quota, export, storage, template, dan advanced tools. Seat selalu 1 pengguna pada model dasar.

## 5. Institution Packaging

Cocok menggunakan base plan + included seats + optional extra seats/usage. Institution features dapat meliputi teacher seat management, shared template/kop, usage reports, custom template, dan advanced admin. Role tetap hanya Admin dan Teacher.

## 6. Enforcement

```text
Action Request
  ↓
Tenant Active?
  ↓
Subscription Allows?
  ↓
Entitlement Enabled?
  ↓
Remaining Quota/Seat?
  ↓
Reserve Usage
  ↓
Execute
  ↓
Commit/Release Usage
```

Gunakan atomic counter/transaction untuk mencegah quota race condition.

## 7. Billing Provider Adapter

Domain billing tidak bergantung langsung pada Midtrans/Xendit/Stripe. Implement interface:

- createCustomer;
- createCheckout;
- verifyWebhook;
- getPaymentStatus;
- cancelSubscription (jika recurring native);
- refund (future).

MVP dapat memakai manual invoice terlebih dahulu.

## 8. Grace Policy

Contoh configurable:

- Active: full access.
- Past Due: warning + payment retry.
- Grace: create/generate bisa dibatasi; read/export existing masih diizinkan.
- Suspended: read-only atau blocked sesuai policy.
- Cancelled: retention window lalu delete/anonymize sesuai policy.

## 9. Super Admin Metrics

- total clients;
- individual vs institution;
- active/trial/past due/churn;
- MRR/ARR (jika recurring);
- AI cost vs revenue;
- usage distribution;
- seat utilization.
