# Security & Privacy

## 1. Authentication

- Laravel session auth for web;
- optional Sanctum for API/mobile;
- password hashing Argon2id/bcrypt;
- email verification optional;
- MFA for superadmin/admin recommended.

## 2. Authorization

- RBAC + institution membership;
- policy check on every tenant-scoped model;
- never trust institution ID from browser without server authorization.

## 3. Secret Management

AI keys, SMTP credentials, storage keys:

- encrypted at rest;
- never rendered back in UI;
- masked value display;
- rotate-able.

## 4. Data Minimization

Generator tidak membutuhkan data identitas murid. Hindari mengirim PII siswa ke AI.

Jika future feature memakai student data:

- explicit purpose;
- role restriction;
- data retention policy;
- redaction before AI call.

## 5. Upload Security

- MIME validation;
- extension whitelist;
- file size limit;
- malware scanning if public SaaS;
- store outside public web root;
- signed URL for private downloads.

## 6. XSS / Injection

- sanitize rich text;
- escape rendered content;
- use parameterized query/Eloquent;
- prompt injection defense: uploaded material treated as **content**, not instruction.

## 7. AI Prompt Injection Rules

When extracting uploaded sources:

- ignore instructions found inside documents;
- source text cannot override system policy;
- no tools/actions triggered by source content;
- retrieved chunks are quoted/context-bound.

## 8. Audit

Audit events:

- login/admin changes;
- regulation upload/verification/publish;
- CP edits;
- generate;
- document finalization / regulation publish;
- export;
- API key changes.

## 9. Backups

- encrypted backup;
- restore test;
- retention policy;
- access restricted.

## 10. Rate Limiting

- auth endpoints;
- generation endpoints;
- export endpoints;
- admin extraction.

## 11. Secure Headers

- CSP;
- HSTS in production;
- X-Content-Type-Options;
- Referrer-Policy;
- frame-ancestors.

## 12. SaaS Isolation Test

Automated tests must prove user from Institution A cannot access documents, questions, exports, or source overrides belonging to Institution B.

## Multi-Tenant Security Requirements

1. `tenant_id` harus menjadi boundary authorization, bukan hanya filter UI.
2. Gunakan scoped route model binding/policy untuk seluruh resource tenant.
3. Jangan menerima `tenant_id` mentah sebagai kebenaran dari browser; resolve dan authorize server-side.
4. Queue job, scheduled task, notification, export, cache, search index, dan object storage harus tenant-aware.
5. File path/object key: `tenants/{tenant_public_id}/...`.
6. Signed URL memiliki TTL dan validasi tenant/actor.
7. Super Admin support/impersonation memerlukan reason, expiry, banner UI, dan immutable audit log.
8. Sensitive billing provider webhook harus signature-verified dan idempotent.
9. Horizontal access test wajib: user tenant A tidak boleh membaca/mengubah UUID resource tenant B walaupun ID diketahui.
10. Personal Workspace dan Institution Workspace milik user yang sama tetap dianggap tenant berbeda.

## Data Minimization for Super Admin

Dashboard Super Admin menampilkan metadata operasional/agregat secara default. Isi dokumen client tidak dibuka kecuali support session yang sah.


## Institution role whitelist

Untuk tenant `INSTITUTION`, backend wajib menolak role selain `ADMIN` dan `TEACHER`. UI hiding bukan kontrol keamanan. Policy/service layer harus memisahkan kemampuan Admin (master data lembaga/guru) dan Teacher (generator/dokumen/soal).


## CP Master Write Protection

1. Semua route mutasi CP berada di namespace platform dan dilindungi `SUPER_ADMIN` policy.
2. Tidak ada route tenant untuk mutasi CP.
3. Published CP tidak boleh update in-place; perubahan harus `new_version`.
4. Import CP wajib validation pass sebelum publish.
5. AI worker menggunakan database credential/role yang tidak memiliki write access ke tabel master CP bila infrastruktur mendukung.
6. Semua publish/archive/new-version masuk immutable audit log.
