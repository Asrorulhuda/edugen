# Testing & QA Plan

## 1. Testing Pyramid

- Unit tests: domain rules, phase resolver, source router, validators.
- Feature tests: permissions, workflows, APIs.
- Integration tests: AI adapters, export, storage.
- E2E: core teacher journey.
- AI evaluation: golden datasets.

## 2. Critical Domain Tests

### Source routing

- Kurmer + Matematika → BSKAP 046.
- KBC + Matematika → BSKAP 046 + KBC integration.
- KBC + Fikih → configured religious CP policy.
- Missing verified CP → generation blocked.

### CP immutability

- AI response containing changed CP ignored/rejected.
- CP snapshot checksum equals master at generation time.

### Phase mapping

- Grade must resolve to valid phase per active source policy.
- Mismatch raises error, not auto-guess.

### KBC validation

- selected Panca Cinta appears in a concrete activity or assessment/reflection;
- no forced irrelevant religious quotation generated for general subject without user/source basis.

## 3. Lesson Plan Tests

- sum of minutes = configured total ± tolerance;
- each TP has learning activity;
- each TP has evidence/assessment;
- DPL names valid;
- source displayed;
- export maintains section order.

## 4. Question Tests

- all answers valid;
- no duplicated options;
- package item count exact;
- distribution within configured tolerance;
- explanation matches key;
- no duplicate question above threshold.

## 5. AI Golden Evaluation

For each case, reviewers score 1–4:

- alignment to CP;
- age/phase appropriateness;
- clarity;
- assessment validity;
- KBC relevance;
- practicality;
- language quality.

Release threshold can require mean ≥ 3.2 and no critical source errors.

## 6. Export Tests

- A4 portrait;
- long tables page-break correctly;
- Arabic/Unicode text works;
- header/logo optional;
- answer key can be excluded;
- PDF and DOCX content equivalence.

## 7. Security Tests

- IDOR/tenant access;
- XSS rich text;
- upload validation;
- rate limits;
- permission escalation;
- encrypted secrets.

## 8. Performance Tests

Targets MVP:

- normal CRUD p95 < 500 ms server-side excluding network;
- dashboard p95 < 1 s API response;
- generation request enqueue < 1 s;
- generation UI non-blocking;
- 20 concurrent generation jobs on worker pool benchmark.

## 9. UAT Checklist

Teacher can complete a full flow without admin assistance after source data exists.

## SaaS & Tenant Test Suite

- register individual → personal tenant created;
- register institution → institution tenant + owner membership created;
- same user can switch personal/institution workspace;
- switching workspace changes entitlements and data;
- tenant A cannot access document/question/export of tenant B;
- queue job preserves tenant context;
- cache key does not leak cross-tenant data;
- signed export URL cannot be reused by unauthorized tenant;
- member seat limit enforced server-side;
- usage quota increments atomically;
- trial expiry changes access correctly;
- past_due/grace/suspended behavior;
- support impersonation emits audit record and expires;
- institution owner can invite teacher;
- individual client cannot access institution admin route;
- superadmin client list can filter INDIVIDUAL/INSTITUTION.
