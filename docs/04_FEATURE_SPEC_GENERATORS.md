# Feature Specification — Generators

## 1. Generator Soal

### 1.1 Generation modes

- `QUICK` — cepat, sedikit input.
- `GUIDED` — wizard lengkap.
- `BLUEPRINT_FIRST` — buat kisi-kisi dahulu, kemudian soal; **default direkomendasikan**.
- `FROM_DOCUMENT` — menggunakan dokumen/materi yang diupload sebagai konteks tambahan, tetap terikat CP.

### 1.2 Jenis soal

- Pilihan Ganda
- Pilihan Ganda Kompleks
- Benar/Salah
- Menjodohkan
- Isian Singkat
- Uraian/Esai
- Studi Kasus
- Praktik/Proyek

### 1.3 Difficulty profile

Contoh distribusi:

- Mudah 30%
- Sedang 50%
- Sulit 20%

Dapat diubah per paket.

### 1.4 Cognitive profile

Aplikasi tidak harus memaksakan satu taksonomi tunggal. Sediakan profile:

- recall/understand/apply/analyze/evaluate/create;
- low/middle/high order;
- custom institution profile.

### 1.5 Blueprint item schema

```json
{
  "number": 1,
  "tp_id": 10,
  "indicator": "...",
  "material": "...",
  "question_type": "MCQ",
  "difficulty": "MEDIUM",
  "cognitive_level": "APPLY",
  "stimulus_required": true,
  "kbc_topic_ids": [4],
  "score": 2
}
```

### 1.6 Question output schema

```json
{
  "stem": "...",
  "stimulus": "...",
  "options": [
    {"key":"A","text":"..."},
    {"key":"B","text":"..."},
    {"key":"C","text":"..."},
    {"key":"D","text":"..."}
  ],
  "answer": "B",
  "explanation": "...",
  "rubric": null,
  "alignment": {
    "cp_id": 1,
    "tp_id": 10,
    "indicator": "..."
  }
}
```

### 1.7 Validators

- answer exists in options;
- no duplicate option;
- no giveaway answer pattern;
- no contradictory explanation;
- stem has sufficient context;
- question aligns with TP;
- difficulty justification;
- duplicate similarity threshold;
- sensitive/unsafe content screening;
- source is present.

### 1.8 Package outputs

- Student version — tanpa kunci.
- Teacher version — kunci + pembahasan.
- Kisi-kisi.
- Answer sheet optional.
- Rubric sheet.

## 2. Generator TP

Input: CP + subject + phase + class + semester + context.

Rules:

- TP harus mengandung kompetensi dan konten;
- jangan mengubah teks CP master;
- hindari TP terlalu luas untuk satu unit;
- dapat diurutkan per semester;
- hasil AI ditandai `AI_DRAFT` hingga guru menyetujui.

Output:

- TP statement;
- rationale;
- suggested evidence;
- linked CP elements.

## 3. Generator ATP

ATP menyusun TP menjadi urutan logis berdasarkan:

- prasyarat;
- kompleksitas;
- konkret → abstrak;
- scope & sequence;
- estimasi JP.

Guru dapat drag-drop urutan.

## 4. Generator RPP / Modul Ajar Kurmer

Sections minimum:

- identitas;
- CP;
- TP;
- asesmen awal/kesiapan;
- kegiatan pembelajaran;
- asesmen formatif/sumatif;
- media/sumber;
- diferensiasi bila relevan;
- refleksi/tindak lanjut.

Template harus configurable.

## 5. Generator RPP KBC / Pembelajaran Mendalam

Baseline mengikuti struktur template yang diberikan.

### A. Spesifikasi

- nama satuan pendidikan;
- mapel;
- fase/kelas/semester;
- topik;
- alokasi waktu.

### B. Identifikasi

- kesiapan murid;
- asesmen diagnostik awal;
- DPL;
- topik Panca Cinta;
- materi integrasi KBC.

### C. Desain Pembelajaran

- CP read-only;
- TP;
- kerangka pembelajaran;
- praktik pedagogis;
- kemitraan;
- lingkungan;
- pemanfaatan digital.

### D. Pengalaman Belajar

- Kegiatan awal: prinsip pembelajaran mendalam;
- Inti: memahami → mengaplikasi → merefleksi;
- Penutup;
- alokasi menit per blok.

### E. Asesmen

- awal;
- formatif/proses;
- sumatif/akhir;
- evidence;
- rubrik;
- Panca Cinta yang diamati bila relevan.

## 6. KBC Relevance Engine

Rekomendasi Panca Cinta bukan random.

Pseudo-rule:

```text
score(kbc_topic) =
  semantic_relevance(material, kbc_topic.materials)
  + subject_prior
  + teacher_context
  - forced_integration_penalty
```

Jika relevance rendah, UI boleh menampilkan `Tidak perlu dipaksakan`.

## 7. DPL Recommendation

Delapan DPL yang disediakan:

- Keimanan dan Ketakwaan terhadap Tuhan YME
- Kewargaan
- Penalaran Kritis
- Kreativitas
- Kolaborasi
- Kemandirian
- Kesehatan
- Komunikasi

Guru memilih 1–4 yang paling relevan; sistem boleh merekomendasikan, bukan memaksa semua.

## 8. Assessment Builder

Asesmen harus dapat menghubungkan:

`TP → indikator/evidence → teknik → instrumen → kriteria/rubrik → tindak lanjut`

Teknik:

- tes tulis;
- tes lisan;
- observasi;
- praktik;
- produk;
- proyek;
- portofolio;
- refleksi/self assessment/peer assessment.

## 9. KKTP / IKTP Builder

Sediakan pilihan model:

- deskripsi kriteria;
- rubrik 4 level;
- interval nilai (opsional lembaga);
- checklist indikator.

Jangan menetapkan angka ambang nasional yang tidak ada di source; angka merupakan kebijakan lembaga/template.

## 10. Remedial & Enrichment

Generated from assessment evidence:

- misconception;
- target TP;
- aktivitas remedial;
- asesmen ulang;
- aktivitas pengayaan.

## 11. Prota & Promes — Phase 2

Input:

- tahun ajaran;
- mapel/kelas;
- ATP;
- JP/minggu;
- calendar/pekan efektif.

Output:

- distribusi TP per semester;
- alokasi JP;
- timeline.

## 12. Regenerate Strategy

Setiap section memiliki:

- `Improve`
- `Shorten`
- `Make more contextual`
- `Make more student-centered`
- `Adjust for class characteristics`
- `Regenerate`

CP tidak pernah menjadi target regenerate.
