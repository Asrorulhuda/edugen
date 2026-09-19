# Super Admin — Master CP Management

## 1. Ownership Rule

**Master Capaian Pembelajaran (CP) hanya dikelola oleh `SUPER_ADMIN`.**

Tidak ada permission CP mutation untuk:

- Personal Teacher;
- Institution Admin;
- Institution Teacher;
- AI worker.

## 2. Super Admin Menu

```text
Kurikulum & Akademik
├── Kurikulum
├── Jenjang
├── Fase
├── Mata Pelajaran
├── Elemen
├── Master CP
└── Regulasi
```

## 3. CP List

Columns:

- Code
- Curriculum
- Jenjang
- Mapel
- Fase
- Elemen
- Regulation
- Version
- Status
- Effective date
- Updated by
- Actions

Filters:

- curriculum;
- jenjang;
- subject;
- phase;
- element;
- regulation;
- status;
- version.

## 4. Add CP Manual

Required fields:

- curriculum_id;
- education_level_id;
- subject_id;
- phase_id;
- element_id optional depending on subject;
- official_text;
- regulation_version_id;
- source_page/source_section/source_locator;
- effective_date;
- notes internal;
- status starts as `DRAFT`.

## 5. Import CP

Supported MVP:

- XLSX
- CSV

Template columns:

```text
curriculum_code
level_code
subject_code
phase_code
element_code
cp_code
cp_text
regulation_code
source_locator
effective_date
```

Workflow:

```text
Upload
  ↓
Column Mapping
  ↓
Validation
  ↓
Preview Error/Warning
  ↓
Save Draft
  ↓
Review
  ↓
Publish
```

No direct upload-to-published shortcut.

## 6. Validation

Hard errors:

- missing subject/phase;
- unknown source regulation;
- empty CP text;
- duplicate `cp_code + version`;
- invalid phase-level relation;
- regulation version not verified.

Warnings:

- source locator kosong;
- element kosong untuk mapel yang biasanya ber-elemen;
- CP text sangat mirip existing version.

## 7. Status

- `DRAFT`
- `PUBLISHED`
- `ARCHIVED`

Only `PUBLISHED` is available in Teacher CP Browser.

## 8. Versioning

Published record is immutable.

When correction/update is needed:

```text
PUBLISHED v1
  ↓
Create New Version
  ↓
DRAFT v2
  ↓
Validate
  ↓
PUBLISH v2
  ↓
v1 remains reference for old generated documents
```

## 9. Audit

Audit event must include:

- actor;
- action;
- timestamp;
- reason;
- before/after metadata;
- source file/import job if applicable.

## 10. Teacher Experience

Teacher CP Browser:

- read-only;
- only published;
- shows source badge;
- shows phase/element/version;
- button `Gunakan CP ini`;
- no edit/publish/import controls.

If no published CP exists:

> `CP untuk kombinasi mapel dan fase ini belum tersedia pada master platform. Generator dinonaktifkan sementara.`

Do not fall back to AI knowledge.

