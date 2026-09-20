<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>403 - Akses Dibatasi | EduGen AI</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="alternate icon" type="image/x-icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/favicon.png">
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700,800&display=swap" rel="stylesheet" />
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { min-height: 100vh; background: #090d16; color: #f8fafc; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
        .card { max-width: 540px; width: 100%; background: #111827; border: 1px solid #1f2937; border-radius: 24px; padding: 2.5rem; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6); position: relative; overflow: hidden; }
        .glow { position: absolute; top: -50px; left: 50%; transform: translateX(-50%); width: 220px; height: 220px; background: radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, rgba(0,0,0,0) 70%); pointer-events: none; }
        .badge { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 1rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 700; background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); margin-bottom: 1.25rem; }
        h1 { font-size: 1.75rem; font-weight: 800; color: #ffffff; margin-bottom: 0.75rem; letter-spacing: -0.02em; }
        p { font-size: 0.925rem; color: #94a3b8; line-height: 1.6; margin-bottom: 1.5rem; }
        .user-box { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 0.85rem 1rem; font-size: 0.825rem; color: #cbd5e1; margin-bottom: 1.75rem; text-align: left; }
        .user-box strong { color: #f8fafc; }
        .actions { display: flex; flex-direction: column; gap: 0.75rem; }
        .btn-primary { display: block; padding: 0.85rem 1.5rem; border-radius: 12px; background: #10b981; color: #ffffff; font-weight: 700; font-size: 0.875rem; text-decoration: none; transition: all 0.2s; border: none; cursor: pointer; }
        .btn-primary:hover { background: #059669; transform: translateY(-1px); }
        .btn-secondary { display: block; padding: 0.85rem 1.5rem; border-radius: 12px; background: #1f2937; color: #94a3b8; font-weight: 600; font-size: 0.875rem; text-decoration: none; transition: all 0.2s; }
        .btn-secondary:hover { background: #374151; color: #ffffff; }
    </style>
</head>
<body>
    <div class="card">
        <div class="glow"></div>
        <div class="badge">
            <span>🔒</span> Akses Super Admin Diperlukan
        </div>
        <h1>Area Terbatas Platform EduGen</h1>
        <p>
            Halaman ini (CRM, Pengaturan Gateway, dan Pengelolaan Klien) memerlukan hak akses <strong>Super Administrator Platform</strong>.
        </p>

        @auth
            <div class="user-box">
                <div>Anda sedang login sebagai: <strong>{{ auth()->user()->name }}</strong></div>
                <div style="font-size: 0.775rem; color: #64748b; margin-top: 0.25rem;">Email: {{ auth()->user()->email }} (Bukan akun Super Admin)</div>
            </div>
        @endauth

        <div class="actions">
            <a href="/dashboard" class="btn-primary">Kembali ke Dashboard Utama ➔</a>
            @auth
                <form method="POST" action="/logout" style="margin: 0;">
                    @csrf
                    <button type="submit" class="btn-secondary" style="width: 100%;">Keluar & Ganti Akun Super Admin</button>
                </form>
            @else
                <a href="/login" class="btn-secondary">Login dengan Akun Super Admin</a>
            @endauth
        </div>
    </div>
</body>
</html>
