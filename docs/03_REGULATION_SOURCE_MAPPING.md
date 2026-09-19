# Regulation & Source Mapping

## 1. Tujuan

Dokumen ini mendefinisikan cara aplikasi memilih dan menyimpan sumber kurikulum/CP. Ini adalah bagian kritis karena generator tidak boleh menggunakan pengetahuan model sebagai pengganti dokumen resmi.

## 2. Sumber Terlampir

### A. KMA 1503 Tahun 2025

Fungsi yang terlihat dari dokumen terlampir:

- perubahan atas KMA 450 Tahun 2024;
- pedoman implementasi kurikulum pada RA, MI, MTs, MA, MAK;
- menekankan **Pembelajaran Mendalam** dan **Kurikulum Berbasis Cinta**.

**Project policy:** user meminta mapel agama mengambil CP dari KMA 1503. Sistem harus menyediakan routing policy tersebut, tetapi CP hanya boleh diaktifkan bila teks CP sudah masuk ke master dan diverifikasi.

### B. BSKAP 046/H/KR/2025

Digunakan sebagai **master source CP mapel umum**. Dokumen menetapkan CP untuk jenjang pendidikan dan fase, termasuk SD/MI, SMP/MTs, SMA/MA.

Aplikasi harus menyimpan struktur:

`Regulation → Jenjang → Subject → Phase → Element → CP text`

### C. Panduan Kurikulum Berbasis Cinta — Dirjen Pendis 6077 Tahun 2025

Menjadi sumber implementasi KBC. Panca Cinta:

1. Cinta Allah dan Rasul-Nya
2. Cinta Ilmu
3. Cinta Lingkungan
4. Cinta Diri dan Sesama Manusia
5. Cinta Tanah Air

### D. Panduan Pembelajaran dan Asesmen Madrasah 2025

Digunakan untuk:

- pembelajaran mendalam;
- DPL;
- prinsip berkesadaran, bermakna, menggembirakan;
- perencanaan pembelajaran;
- integrasi Panca Cinta;
- asesmen formatif/sumatif/autentik;
- kerangka RPP/Modul Ajar madrasah.

### E. Format RPP KBC yang diberikan

Digunakan sebagai baseline template institusi. Struktur yang teridentifikasi:

- A. Spesifikasi
- B. Identifikasi
- C. Desain Pembelajaran
- D. Pengalaman Belajar
- E. Asesmen Pembelajaran
- blok tanda tangan

## 3. Important Source Validation Note

Panduan Pembelajaran dan Asesmen Madrasah yang terlampir menyebut **secara terpisah** suatu Keputusan Dirjen Pendis tentang **Capaian Pembelajaran Pendidikan Agama Islam dan Bahasa Arab**. Pada copy panduan yang tersedia, nomor keputusan tersebut belum terisi/ditampilkan pada bagian referensinya.

Karena itu:

- jangan mengekstrak CP agama dari model AI;
- jangan menganggap paragraf umum KMA 1503 sebagai CP;
- sediakan `CP Source Verification Workflow`;
- production sebaiknya menambahkan dokumen CP PAI & Bahasa Arab resmi yang final bila tersedia.

## 4. Routing Matrix

| Curriculum Mode | Subject Category | Source Policy | Required Status |
|---|---|---|---|
| MERDEKA | GENERAL | BSKAP_046_2025 | VERIFIED_PUBLISHED |
| MADRASAH_KBC | GENERAL | BSKAP_046_2025 | VERIFIED_PUBLISHED |
| MADRASAH_KBC | RELIGION | KMA_1503_2025 (project policy) | VERIFIED_PUBLISHED_CP_DATA |
| MADRASAH_KBC | ARABIC | KMA_1503_2025 (project policy) | VERIFIED_PUBLISHED_CP_DATA |

Hanya **Super Admin** boleh mengubah `source_policy` jika terdapat regulasi CP agama yang lebih spesifik/final, tanpa mengubah kode generator.

## 5. Subject Categories

`GENERAL` contoh:

- Bahasa Indonesia
- Matematika
- IPA/IPAS
- IPS
- PPKn/Pendidikan Pancasila
- Bahasa Inggris
- Informatika
- PJOK
- Seni

`RELIGION` madrasah contoh:

- Al-Qur'an Hadis
- Akidah Akhlak
- Fikih
- SKI

`ARABIC`:

- Bahasa Arab

Mapping harus configurable melalui admin, bukan hard-coded di prompt.

## 6. Provenance Model

Setiap CP menyimpan:

```json
{
  "regulation_code": "BSKAP_046_2025",
  "document_version": "2025-07-16",
  "subject": "Matematika",
  "phase": "A",
  "element": "Bilangan",
  "cp_text": "...",
  "source_page": 0,
  "source_locator": "Lampiran II / Matematika / Fase A / Bilangan",
  "verification_status": "VERIFIED_PUBLISHED",
  "verified_by": 123,
  "verified_at": "...",
  "checksum": "sha256:..."
}
```

## 7. Regulation Lifecycle

Status:

- `DRAFT`
- `EXTRACTED`
- `NEEDS_REVIEW`
- `VERIFIED`
- `PUBLISHED`
- `SUPERSEDED`
- `ARCHIVED`

Jika regulasi baru menggantikan yang lama:

- dokumen lama tidak dihapus;
- source lama menjadi `SUPERSEDED`;
- dokumen guru lama tetap menunjuk source snapshot lama;
- generator baru menggunakan source published terbaru sesuai effective date.

## 8. CP Import Workflow — Super Admin Only

1. Super Admin upload sumber.
2. Sistem ekstrak kandidat struktur.
3. Super Admin pilih jenjang/mapel/fase.
4. Sistem menunjukkan teks kandidat + source page.
5. Super Admin mengoreksi jika parsing rusak.
6. Super Admin melakukan verifikasi akhir atau menetapkan petugas verifikasi platform.
7. Publish.
8. CP berstatus `PUBLISHED` tersedia read-only bagi guru.

> OCR/AI extraction hanya alat bantu. `VERIFIED` harus diverifikasi manusia pada level platform, bukan oleh role Admin sekolah.

## 9. Source Display Rules

Di dokumen hasil generate tampil metadata:

- Sumber CP;
- nomor regulasi;
- fase;
- tanggal versi;
- opsi menampilkan catatan sumber di footer/lampiran.

## 10. Rule: KBC Is Integration, Not CP Replacement

Untuk mapel umum di madrasah:

1. CP tetap dari source CP mapel umum;
2. KBC dipetakan pada TP/aktivitas/asesmen yang relevan;
3. CP resmi tidak ditambahi kalimat Panca Cinta;
4. integrasi KBC disimpan pada field terpisah.
