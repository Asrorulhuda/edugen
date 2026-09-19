# API Specification — Draft

Prefix: `/api/v1`

## Auth

- `POST /auth/login`
- `POST /auth/logout`
- `GET /me`

## Academic Context

- `GET /institutions`
- `GET /institutions/{id}/academic-context`
- `GET /subjects?level=&grade=&curriculum_mode=`
- `GET /phases/resolve?level=&grade=`

## Regulation & CP

### Super Admin CP Management

Platform-only routes:

- `GET /api/platform/cp`
- `POST /api/platform/cp`
- `POST /api/platform/cp/import`
- `GET /api/platform/cp/{id}`
- `PATCH /api/platform/cp/{id}` — draft metadata/content only
- `POST /api/platform/cp/{id}/publish`
- `POST /api/platform/cp/{id}/archive`
- `POST /api/platform/cp/{id}/versions` — clone as new version
- `GET /api/platform/cp/{id}/audit`

Authorization: `SUPER_ADMIN` only. Published CP cannot be overwritten.

Tenant read-only routes:

- `GET /api/cp?subject=&phase=&curriculum=`
- `GET /api/cp/{id}`

Tenant routes only return `PUBLISHED` records and never expose mutation actions.


- `GET /regulations`
- `GET /regulations/{id}`
- `POST /admin/regulations`
- `POST /admin/regulations/{id}/documents`
- `POST /admin/regulation-documents/{id}/extract`
- `GET /learning-outcomes?subject_id=&phase=&curriculum_mode=`
- `GET /learning-outcomes/{id}`
- `POST /admin/learning-outcomes/{id}/verify`
- `POST /admin/learning-outcomes/{id}/publish`

## TP / ATP

- `POST /generators/tp/preview`
- `POST /generators/tp/generate`
- `POST /learning-objectives`
- `POST /generators/atp/generate`
- `PATCH /atp/{id}/reorder`

## RPP / Module

- `POST /generators/lesson-plan/validate-input`
- `POST /generators/lesson-plan/generate`
- `GET /documents/{id}`
- `PATCH /documents/{id}`
- `POST /documents/{id}/regenerate-section`
- `POST /documents/{id}/mark-final`
- `POST /documents/{id}/archive`

## Question Generator

- `POST /question-blueprints/generate`
- `POST /question-blueprints/{id}/generate-questions`
- `GET /questions`
- `POST /questions/{id}/regenerate`
- `PATCH /questions/{id}`
- `POST /question-packages`

## Export

- `POST /documents/{id}/exports`
- `POST /question-packages/{id}/exports`
- `GET /exports/{id}`

## AI Job

- `GET /generation-jobs/{id}`
- `POST /generation-jobs/{id}/retry`

## Example: generate lesson plan

```json
POST /api/v1/generators/lesson-plan/generate
{
  "curriculum_mode": "MADRASAH_KBC",
  "institution_id": 1,
  "academic_year_id": 3,
  "semester_id": 5,
  "grade_id": 8,
  "subject_id": 10,
  "learning_outcome_id": 221,
  "topic": "Greeting",
  "total_jp": 2,
  "student_context": {
    "readiness": "heterogeneous",
    "notes": "Murid aktif berdiskusi dan menyukai kerja kelompok"
  },
  "kbc_topic_ids": [4],
  "dpl_ids": [3,4,5,8],
  "detail_level": "STANDARD"
}
```

Response:

```json
{
  "job_id": "gen_01...",
  "status": "QUEUED",
  "source_snapshot": {
    "learning_outcome_id": 221,
    "checksum": "..."
  }
}
```

## API Rules

- Mutating endpoints require CSRF/session or token auth.
- All tenant-scoped IDs validated against membership and role. Institution roles are restricted to `ADMIN` and `TEACHER`.
- Generation endpoint idempotent.
- CP endpoint never allows teacher overwrite of official text.
- Validation errors use machine code + human message.

## SaaS / Tenant APIs

### Workspace

- `GET /api/workspaces`
- `POST /api/workspaces/switch`
- `GET /api/workspaces/current`

### Individual onboarding

- `POST /api/onboarding/individual`

### Institution onboarding & Admin APIs

- `POST /api/onboarding/institution`
- `GET /api/institution/profile`
- `PATCH /api/institution/profile`
- `POST /api/institution/logo`
- `POST /api/institution/letterhead`
- `GET /api/institution/teachers`
- `POST /api/institution/teachers`
- `GET /api/institution/teachers/{teacher}`
- `PATCH /api/institution/teachers/{teacher}`
- `POST /api/institution/teachers/{teacher}/activate`
- `POST /api/institution/teachers/{teacher}/suspend`
- `POST /api/tenants/{tenant}/invitations`

Authorization: seluruh endpoint institution setup di atas hanya untuk role `ADMIN`. Endpoint generator hanya untuk `TEACHER` pada institution tenant.

### Subscription

- `GET /api/billing/subscription`
- `GET /api/billing/usage`
- `GET /api/billing/invoices`
- `POST /api/billing/checkout`
- `POST /api/billing/change-plan`
- `POST /api/billing/cancel`

### Super Admin

- `GET /api/superadmin/tenants`
- `POST /api/superadmin/tenants`
- `PATCH /api/superadmin/tenants/{tenant}`
- `POST /api/superadmin/tenants/{tenant}/suspend`
- `POST /api/superadmin/tenants/{tenant}/reactivate`
- `GET /api/superadmin/plans`
- `POST /api/superadmin/plans`
- `PATCH /api/superadmin/plans/{plan}`
- `GET /api/superadmin/subscriptions`
- `GET /api/superadmin/usage`
- `POST /api/superadmin/support-sessions`
- `DELETE /api/superadmin/support-sessions/{session}`

## Mandatory API Context

Untuk API client, active tenant harus resolve dari session/header server-trusted dan divalidasi terhadap membership. Jangan mempercayai `tenant_id` dari body tanpa authorization. Semua resource lookup menggunakan pasangan `tenant_id + resource_id` atau scoped route binding.
