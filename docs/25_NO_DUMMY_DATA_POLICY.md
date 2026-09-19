# No Dummy Data Policy

## Status

**Hard requirement for all environments except isolated automated tests.**

## Prohibited application data

Do not prefill or auto-create:

- tenant/client;
- institution/school/madrasah;
- teacher/admin accounts;
- CP records;
- regulation records presented as verified;
- RPP/modul/perangkat documents;
- questions/question banks;
- subscriptions/invoices/payments;
- AI usage records;
- analytics/dashboard metrics;
- customer logos/testimonials/ratings;
- pricing values that have not been configured by Super Admin.

## Allowed initial data

Only deterministic system/domain definitions may exist at bootstrap, such as enum values, permission keys, status definitions, Panca Cinta labels, DPL labels, and feature-key identifiers. These are product definitions, not user/business records.

## First-run behavior

1. Run migration.
2. Create first Super Admin through an explicit secure setup command/wizard.
3. Super Admin configures platform settings, AI provider, plans/entitlements, and billing provider if used.
4. Super Admin inputs/imports and verifies official regulation/CP data.
5. Users/tenants appear only through real onboarding or explicit Super Admin creation.

## Empty state rule

If no real data exists, show an empty state. Never manufacture records or metrics to make a dashboard look populated.

## Development/test rule

Automated tests may use factories only in an isolated test database. Test data must never be part of normal seeders, migrations, staging public data, or production deployment.

## AI rule

If no real provider credential is configured, generation is unavailable. The application must not return placeholder AI content as though it were generated output.
