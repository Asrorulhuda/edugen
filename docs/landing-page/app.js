(() => {
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const navPanel = document.getElementById('navPanel');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  navToggle?.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!open));
    navPanel?.classList.toggle('is-open', !open);
  });
  navPanel?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navToggle?.setAttribute('aria-expanded', 'false');
    navPanel?.classList.remove('is-open');
  }));

  const reveals = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  }

  const steps = [
    {
      status: 'CP siap digunakan',
      title: 'Guru memilih CP yang sudah dipublikasikan.',
      copy: 'Tidak ada kolom bebas untuk menulis ulang CP resmi. Guru memilih mapel, fase, dan elemen; sistem menampilkan sumber yang sudah diverifikasi.',
      source: 'Sumber CP resmi terkunci'
    },
    {
      status: 'Konteks terkunci',
      title: 'AI bekerja setelah konteks kurikulum lengkap.',
      copy: 'Generator menerima CP resmi, tujuan, karakteristik kelas, kurikulum, dan kebutuhan dokumen sebagai konteks terstruktur—bukan prompt bebas tanpa sumber.',
      source: 'Generator memakai snapshot sumber'
    },
    {
      status: 'Validator aktif',
      title: 'Hasil diperiksa sebelum difinalisasi guru.',
      copy: 'Validator memeriksa fase, keterhubungan TP, struktur dokumen, integrasi KBC bila dipakai, serta keselarasan asesmen dengan tujuan.',
      source: 'Validasi domain sebelum final'
    },
    {
      status: 'Siap export',
      title: 'Guru finalisasi lalu memilih format dokumen.',
      copy: 'Dokumen final mempertahankan jejak sumber dan dapat diekspor ke format yang diizinkan paket tanpa mengubah master CP.',
      source: 'Sumber tetap melekat pada dokumen'
    }
  ];

  const tabs = [...document.querySelectorAll('.workflow-tab')];
  const stepEl = document.getElementById('previewStep');
  const statusEl = document.getElementById('previewStatus');
  const titleEl = document.getElementById('previewTitle');
  const copyEl = document.getElementById('previewCopy');
  const sourceEl = document.querySelector('.preview-source');

  const renderStep = index => {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    const data = steps[index];
    if (stepEl) stepEl.textContent = `${String(index + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}`;
    if (statusEl) statusEl.textContent = data.status;
    if (titleEl) titleEl.textContent = data.title;
    if (copyEl) copyEl.textContent = data.copy;
    if (sourceEl) sourceEl.innerHTML = `<span aria-hidden="true"></span>${data.source}`;
  };

  tabs.forEach((tab, index) => tab.addEventListener('click', () => renderStep(index)));
  renderStep(0);
})();
