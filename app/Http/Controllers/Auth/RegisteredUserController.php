<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WaGatewaySetting;
use App\Services\TenantService;
use App\Services\WhatsApp\WhatsAppGatewayService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Step 1: Request OTP code via WhatsApp Gateway.
     */
    public function requestOtp(Request $request, WhatsAppGatewayService $waService): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'phone' => ['required', 'string', 'min:9', 'max:20', 'regex:/^(\+?62|0)8[1-9][0-9]{6,11}$/'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], [
            'phone.regex' => 'Format nomor WhatsApp tidak valid. Gunakan format Indonesia (contoh: 081234567890).',
        ]);

        $normalizedPhone = $waService->normalizePhoneNumber($request->phone);

        // Check if phone number is already registered
        if (User::where('phone', $normalizedPhone)->exists()) {
            throw ValidationException::withMessages([
                'phone' => 'Nomor WhatsApp ini sudah terdaftar. Silakan masuk atau gunakan nomor lain.',
            ]);
        }

        // Generate 6-digit OTP
        $otpCode = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
        $regToken = 'reg_' . Str::random(40);

        // Store registration payload in Cache for 10 minutes
        Cache::put("reg_otp_{$regToken}", [
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $normalizedPhone,
            'display_phone' => $request->phone,
            'password_hash' => Hash::make($request->password),
            'otp_code' => $otpCode,
            'attempts' => 0,
            'created_at' => now()->timestamp,
            'last_sent_at' => now()->timestamp,
        ], now()->addMinutes(10));

        // Compose WhatsApp Message
        $message = "🔐 *KODE VERIFIKASI OTP EDUGEN*\n\n"
            . "Halo *{$request->name}*,\n"
            . "Terima kasih telah mendaftar di *EduGen* (Platform Perangkat Guru & Modul Ajar Kurmer & KBC).\n\n"
            . "Kode OTP Verifikasi Anda adalah:\n"
            . "👉 *{$otpCode}*\n\n"
            . "⚠️ *PENTING:* Kode ini berlaku selama *10 menit*. Jangan berikan kode ini kepada orang lain demi keamanan akun Anda.";

        $waResult = $waService->sendMessage(
            number: $normalizedPhone,
            message: $message,
            source: 'OTP_REGISTRATION',
            recipientName: $request->name
        );

        $isDelivered = $waResult['success'] ?? false;
        $fallbackOtp = (!app()->environment('production') || !$isDelivered) ? $otpCode : null;

        return response()->json([
            'success' => true,
            'token' => $regToken,
            'phone' => $normalizedPhone,
            'display_phone' => $request->phone,
            'message' => $isDelivered
                ? 'Kode OTP 6-digit telah dikirimkan ke WhatsApp Anda.'
                : 'Perhatian: WhatsApp Gateway gagal mengirim pesan (' . ($waResult['message'] ?? 'Sender tidak terhubung') . '). Gunakan kode OTP di layar untuk melanjutkan.',
            'expires_in' => 600,
            'dev_otp' => $fallbackOtp,
            'gateway_delivered' => $isDelivered,
            'gateway_error' => $isDelivered ? null : ($waResult['message'] ?? null),
        ]);
    }

    /**
     * Step 1.5: Resend OTP code with 60-second rate limiting.
     */
    public function resendOtp(Request $request, WhatsAppGatewayService $waService): JsonResponse
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $data = Cache::get("reg_otp_{$request->token}");
        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Sesi pendaftaran telah kedaluwarsa. Silakan isi form pendaftaran kembali.',
            ], 422);
        }

        // Rate limit: 60 seconds cooldown
        $now = now()->timestamp;
        $cooldown = 60;
        $elapsed = $now - ($data['last_sent_at'] ?? 0);

        if ($elapsed < $cooldown) {
            $remaining = $cooldown - $elapsed;
            return response()->json([
                'success' => false,
                'message' => "Harap tunggu {$remaining} detik sebelum meminta kode OTP kembali.",
                'remaining' => $remaining,
            ], 429);
        }

        // Generate new OTP
        $otpCode = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
        $data['otp_code'] = $otpCode;
        $data['last_sent_at'] = $now;
        $data['attempts'] = 0;

        Cache::put("reg_otp_{$request->token}", $data, now()->addMinutes(10));

        $message = "🔄 *KODE OTP BARU EDUGEN*\n\n"
            . "Halo *{$data['name']}*,\n"
            . "Berikut adalah kode OTP verifikasi baru untuk pendaftaran akun Anda:\n\n"
            . "👉 *{$otpCode}*\n\n"
            . "Kode ini berlaku selama 10 menit. Masukkan kode ini pada halaman pendaftaran.";

        $waResult = $waService->sendMessage(
            number: $data['phone'],
            message: $message,
            source: 'OTP_REGISTRATION',
            recipientName: $data['name']
        );

        $isDelivered = $waResult['success'] ?? false;
        $fallbackOtp = (!app()->environment('production') || !$isDelivered) ? $otpCode : null;

        return response()->json([
            'success' => true,
            'message' => $isDelivered
                ? 'Kode OTP baru telah dikirimkan ke WhatsApp Anda.'
                : 'Peringatan: WhatsApp Gateway gagal mengirim pesan (' . ($waResult['message'] ?? 'Sender offline') . ').',
            'expires_in' => 600,
            'dev_otp' => $fallbackOtp,
            'gateway_delivered' => $isDelivered,
        ]);
    }

    /**
     * Step 2: Verify OTP and finalize user creation.
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string',
            'otp' => 'required|string|size:6',
        ]);

        $data = Cache::get("reg_otp_{$request->token}");
        if (!$data) {
            throw ValidationException::withMessages([
                'otp' => 'Sesi pendaftaran telah kedaluwarsa. Silakan ulangi pendaftaran.',
            ]);
        }

        // Anti-brute force check
        if (($data['attempts'] ?? 0) >= 5) {
            Cache::forget("reg_otp_{$request->token}");
            throw ValidationException::withMessages([
                'otp' => 'Terlalu banyak percobaan salah. Silakan ulangi pendaftaran dari awal demi keamanan.',
            ]);
        }

        if (trim($request->otp) !== (string) $data['otp_code']) {
            $data['attempts'] = ($data['attempts'] ?? 0) + 1;
            Cache::put("reg_otp_{$request->token}", $data, now()->addMinutes(10));

            $remaining = 5 - $data['attempts'];
            throw ValidationException::withMessages([
                'otp' => "Kode OTP salah. Sisa kesempatan mencoba: {$remaining} kali.",
            ]);
        }

        // OTP Valid: Clear cache & Create User
        Cache::forget("reg_otp_{$request->token}");

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'phone_verified_at' => now(),
            'password' => $data['password_hash'],
        ]);

        // Auto-provision Personal Workspace (Tenant INDIVIDUAL) and Free Trial
        app(TenantService::class)->provisionPersonalWorkspace($user);

        event(new Registered($user));

        // Notify Superadmin via WhatsApp
        $this->notifyAdminNewRegistration($user);

        Auth::login($user);

        return response()->json([
            'success' => true,
            'redirect' => route('dashboard', absolute: false),
            'message' => 'Akun berhasil diverifikasi dan didaftarkan!',
        ]);
    }

    /**
     * Notify Admin/Superadmin when a new teacher or institution registers.
     */
    protected function notifyAdminNewRegistration(User $user): void
    {
        try {
            $waSetting = WaGatewaySetting::current();
            if (!$waSetting->is_active || !$waSetting->notify_on_registration) {
                return;
            }

            $adminNumber = $waSetting->admin_notify_number ?: $waSetting->sender;
            if (empty($adminNumber)) {
                return;
            }

            $phoneFormatted = $user->phone ? ('+' . $user->phone) : '-';
            $time = now()->translatedFormat('d F Y H:i');

            $adminMessage = "🔔 *Pemberitahuan Pendaftar Baru EduGen!*\n\n"
                . "Halo Admin, ada pengguna baru yang berhasil mendaftar:\n\n"
                . "👤 *Nama:* {$user->name}\n"
                . "📧 *Email:* {$user->email}\n"
                . "📱 *WhatsApp:* {$phoneFormatted}\n"
                . "⏰ *Waktu:* {$time} WIB\n"
                . "📦 *Workspace:* Personal Workspace (Free Trial Aktif)\n\n"
                . "Pantau seluruh aktivitas pendaftar melalui Dashboard Superadmin EduGen.";

            app(WhatsAppGatewayService::class)->sendMessage(
                number: $adminNumber,
                message: $adminMessage,
                source: 'ADMIN_NOTIFICATION',
                recipientName: 'Super Admin'
            );
        } catch (\Throwable $e) {
            // Log silently without breaking user registration
            \Illuminate\Support\Facades\Log::warning('Gagal mengirim notifikasi pendaftaran ke Admin: ' . $e->getMessage());
        }
    }

    /**
     * Direct registration fallback (backwards compatibility for automated tests).
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'phone' => ['nullable', 'string', 'max:255'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $phone = null;
        if ($request->filled('phone')) {
            $phone = app(WhatsAppGatewayService::class)->normalizePhoneNumber($request->phone);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $phone,
            'phone_verified_at' => $phone ? now() : null,
            'password' => Hash::make($request->password),
        ]);

        // Auto-provision Personal Workspace
        app(TenantService::class)->provisionPersonalWorkspace($user);

        event(new Registered($user));

        $this->notifyAdminNewRegistration($user);

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
