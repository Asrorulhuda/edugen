# Acceptance Criteria / Definition of Done

## Epic: Source Registry

- [ ] Admin dapat upload sumber.
- [ ] CP dapat dipetakan ke mapel/fase/elemen.
- [ ] CP tidak terlihat guru sebelum published.
- [ ] Source locator tersedia.
- [ ] Source dapat disupersede tanpa menghapus histori.

## Epic: Super Admin Master CP

- [ ] Hanya `SUPER_ADMIN` dapat membuka halaman Master CP management.
- [ ] Super Admin dapat input CP manual.
- [ ] Super Admin dapat import CP XLSX/CSV dan melihat baris invalid sebelum publish.
- [ ] Super Admin dapat mapping Kurikulum → Jenjang → Mapel → Fase → Elemen → CP.
- [ ] Super Admin dapat menyimpan source regulation + locator.
- [ ] CP draft tidak terlihat guru.
- [ ] CP published tidak dapat di-overwrite; koreksi membuat versi baru.
- [ ] Publish/archive/versioning tercatat audit log.
- [ ] Institution Admin mendapat 403 jika memanggil endpoint mutasi CP langsung.
- [ ] Teacher/Personal Teacher mendapat 403 jika memanggil endpoint mutasi CP langsung.

## Epic: CP Browser

- [ ] Guru dapat filter mapel/fase.
- [ ] Hanya CP published muncul.
- [ ] CP read-only.
- [ ] Source badge jelas.
- [ ] Copy CP tidak mengubah text master.

## Epic: RPP/Modul Generator

- [ ] Wizard context lengkap.
- [ ] Phase auto-resolve.
- [ ] CP source locked.
- [ ] KBC fields muncul hanya pada mode terkait.
- [ ] Output terstruktur.
- [ ] Time validator berjalan.
- [ ] Regenerate section tidak mengubah CP.
- [ ] Guru dapat edit manual.
- [ ] Source panel terlihat.
- [ ] Export DOCX/PDF berhasil.

## Epic: Question Generator

- [ ] Blueprint-first flow tersedia.
- [ ] Jumlah soal akurat.
- [ ] Key valid.
- [ ] Explanation konsisten.
- [ ] Student/teacher export berbeda.
- [ ] Question bank dapat filter.

## Epic: Review

- [ ] Guru dapat menandai dokumen dari DRAFT menjadi FINAL.
- [ ] Comment.
- [ ] Request revision.
- [ ] Approve.
- [ ] Approved revision immutable.

## Epic: AI

- [ ] Provider adapter interface.
- [ ] Structured JSON schema.
- [ ] Generation async.
- [ ] Usage logging.
- [ ] Missing source blocks generation.
- [ ] Prompt/version recorded.

## Security

- [ ] Tenant isolation automated test passes.
- [ ] Secret encryption.
- [ ] Upload validation.
- [ ] Authorization policies.
- [ ] Audit on critical actions.

## Pilot Success

A pilot teacher can create one KBC RPP and one 20-question package from a verified CP, edit them, mark them final, and export without developer intervention.

## Multi-SaaS Acceptance Criteria

- [ ] Super Admin dapat melihat dan memfilter client individu vs instansi.
- [ ] Registrasi individu otomatis membuat Personal Workspace tenant `INDIVIDUAL`.
- [ ] Registrasi instansi membuat tenant `INSTITUTION` + membership `ADMIN` pertama.
- [ ] Satu user dapat menjadi member beberapa tenant dan berpindah lewat Workspace Switcher.
- [ ] Data dokumen/bank soal antar tenant tidak pernah bercampur.
- [ ] Institution Admin dapat input/mengundang Teacher dan seat limit berlaku.
- [ ] Subscription/entitlement berbeda per tenant dan diterapkan server-side.
- [ ] AI usage dan cost tercatat per tenant.
- [ ] Personal Workspace tetap ada ketika user masuk/keluar tenant instansi.
- [ ] Super Admin support access menghasilkan immutable audit log.
- [ ] Semua cross-tenant authorization tests lulus.

- [ ] Tenant institution menolak role selain `ADMIN` dan `TEACHER`.
- [ ] Admin dapat mengubah nama lembaga, logo, NPSN/NSM, alamat, kontak, kop/template, dan tahun ajaran.
- [ ] Admin dapat CRUD/aktif/nonaktif data guru.
- [ ] Admin tidak dapat menggunakan generator sebagai fungsi normal.
- [ ] Teacher dapat membuat TP/ATP, RPP/Modul Ajar, perangkat guru, soal, bank soal, dan export.
- [ ] Teacher tidak dapat mengubah profil sekolah atau data guru lain.
- [ ] Tidak ada menu atau endpoint approval/reviewer pada MVP.


## Epic: Landing Page

- [ ] Hero menyampaikan value proposition spesifik: perangkat guru berbasis CP terverifikasi.
- [ ] Bento grid tidak pecah pada 360px, 768px, 1024px, dan 1440px.
- [ ] CTA Individual dan Institution jelas dan tidak membingungkan.
- [ ] Tidak ada testimoni, logo pelanggan, atau statistik yang tidak berasal dari data nyata.
- [ ] Semua animasi berhenti/diminimalkan ketika `prefers-reduced-motion: reduce`.
- [ ] Navigasi mobile dapat dioperasikan keyboard dan touch.
- [ ] Fokus keyboard terlihat.
- [ ] Tidak ada horizontal overflow pada mobile.
- [ ] Landing page tetap dapat dipahami ketika JavaScript dimatikan; enhancement interaktif boleh hilang.

## No-Dummy-Data Acceptance Criteria

- [ ] Fresh install menghasilkan database operasional kosong: tidak ada tenant, sekolah, guru, CP, dokumen, soal, invoice, subscription, usage, atau statistik buatan.
- [ ] First Super Admin dibuat melalui setup eksplisit, bukan kredensial default.
- [ ] CP hanya muncul setelah Super Admin input/import dan publish.
- [ ] Jika AI provider belum dikonfigurasi, tombol generate nonaktif dan tidak mengeluarkan konten simulasi.
- [ ] Dashboard/list kosong menampilkan empty state.
- [ ] Automated test factory hanya berjalan pada environment test terisolasi.
