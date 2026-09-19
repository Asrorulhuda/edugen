# Export & Template Specification

## 1. Output Types

### DOCX

Primary editable output for teachers.

Requirements:

- A4;
- editable text/tables;
- institution logo/header optional;
- signature block;
- stable page breaks;
- Unicode/Arabic support;
- style definitions instead of inline ad-hoc formatting where possible.

### PDF

Primary archival/print output.

- identical content with current revision;
- page numbers;
- optional QR/document verification code;
- metadata footer.

### XLSX/CSV

For:

- bank soal;
- kisi-kisi;
- question blueprint;
- TP/ATP table;
- future Prota/Promes.

## 2. Template Engine

Templates have:

- type;
- institution scope;
- curriculum mode;
- version;
- blocks;
- styles;
- locked headings;
- optional sections;
- signature configuration.

## 3. RPP KBC Default Block Order

1. Header institution
2. Title
3. A. Spesifikasi
4. B. Identifikasi
5. C. Desain Pembelajaran
6. D. Pengalaman Belajar
7. E. Asesmen Pembelajaran
8. Refleksi/Tindak Lanjut (optional/configurable)
9. Signature block
10. Source notes (optional)

## 4. Question Package

Student copy:

- title;
- identity fields;
- instructions;
- questions;
- no answer/explanation.

Teacher copy:

- questions;
- key;
- explanation;
- score;
- alignment metadata optional.

## 5. Source Footer

Configurable:

```text
Sumber CP: Keputusan Kepala BSKAP No. 046/H/KR/2025 — [Mapel/Fase/Elemen]
Dokumen dibuat dengan bantuan generator; telah ditinjau oleh pendidik.
```

For religious CP source, display actual verified source configured in the master database, not a hardcoded statement if source is unresolved.

## 6. Filename Convention

```text
{DOC_TYPE}_{LEVEL}_{GRADE}_{SUBJECT}_{TOPIC}_{YYYYMMDD}_v{REV}.docx
```

Example:

```text
RPP_MTS_8_BAHASA-INGGRIS_GREETING_20260914_v1.docx
```
