<?php

namespace App\Http\Controllers\Institution;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\TeacherProfile;
use App\Models\TenantInvitation;
use App\Models\TenantMembership;
use App\Models\User;
use App\Services\TenantContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TeacherInvitationController extends Controller
{
    /**
     * List invitations for current institution
     */
    public function index(TenantContext $tenantContext): Response
    {
        $tenantId = $tenantContext->id();

        $invitations = TenantInvitation::with(['role', 'inviter:id,name'])
            ->where('tenant_id', $tenantId)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($inv) {
                return [
                    'id' => $inv->id,
                    'email' => $inv->email,
                    'phone' => $inv->phone,
                    'otp_code' => $inv->otp_code,
                    'role_name' => $inv->role?->display_name,
                    'invitation_url' => url("/invitations/{$inv->token_hash}"),
                    'expires_at' => $inv->expires_at->toIso8601String(),
                    'is_expired' => $inv->isExpired(),
                    'is_accepted' => $inv->isAccepted(),
                    'accepted_at' => $inv->accepted_at?->toIso8601String(),
                    'inviter_name' => $inv->inviter?->name,
                ];
            });

        return Inertia::render('Institution/Invitations', [
            'invitations' => $invitations,
        ]);
    }

    /**
     * Send invitation to teacher email with OTP verification code
     */
    public function store(Request $request, TenantContext $tenantContext): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
        ]);

        $tenantId = $tenantContext->id();
        $email = strtolower(trim($validated['email']));
        $phone = !empty($validated['phone']) ? preg_replace('/[^0-9]/', '', $validated['phone']) : null;

        // Check if user is already an active member in this tenant
        $alreadyMember = TenantMembership::where('tenant_id', $tenantId)
            ->whereHas('user', fn($q) => $q->where('email', $email))
            ->exists();

        if ($alreadyMember) {
            return back()->with('error', "Guru dengan email {$email} sudah menjadi anggota aktif di sekolah ini.");
        }

        $teacherRole = Role::where('name', Role::TEACHER)->firstOrFail();
        $tokenHash = Str::random(40);
        $otpCode = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);

        TenantInvitation::create([
            'tenant_id' => $tenantId,
            'email' => $email,
            'phone' => $phone,
            'role_id' => $teacherRole->id,
            'token_hash' => $tokenHash,
            'otp_code' => $otpCode,
            'expires_at' => now()->addDays(7),
            'invited_by' => $request->user()->id,
        ]);

        $waNotice = '';
        if (!empty($phone) && app(\App\Services\WhatsApp\WhatsAppGatewayService::class)->isActive()) {
            $institutionName = $tenantContext->get()?->name ?? 'Sekolah / Madrasah';
            $inviteUrl = url("/invitations/{$tokenHash}");
            $waService = app(\App\Services\WhatsApp\WhatsAppGatewayService::class);
            $template = \App\Models\WaTemplate::where('code', 'INVITATION_OTP')->first();

            $message = $template
                ? $waService->renderTemplate($template->content, [
                    'nama_guru' => $email,
                    'nama_sekolah' => $institutionName,
                    'otp_code' => $otpCode,
                    'link_undangan' => $inviteUrl,
                ])
                : "Halo Bapak/Ibu Guru ({$email}),\n\nAnda telah diundang untuk bergabung dengan *{$institutionName}* di platform EduGen AI.\n\n🔐 *Kode OTP Verifikasi:* *{$otpCode}*\n\nSilakan klik tautan berikut untuk aktivasi:\n🔗 {$inviteUrl}\n\nKode berlaku 7 hari.";

            $res = $waService->sendMessage(
                number: $phone,
                message: $message,
                footer: $template?->footer,
                source: 'INVITATION_OTP',
                recipientName: $email,
                tenantId: $tenantId,
                userId: $request->user()->id
            );

            if ($res['success']) {
                $waNotice = " & notifikasi WhatsApp otomatis terkirim ke {$phone}.";
            }
        }

        return back()->with('success', "Undangan guru berhasil dibuat dengan Kode OTP [{$otpCode}]{$waNotice}.");
    }

    /**
     * Resend / refresh invitation with new OTP
     */
    public function resend(TenantInvitation $invitation, TenantContext $tenantContext): RedirectResponse
    {
        if ($invitation->tenant_id !== $tenantContext->id()) {
            abort(403);
        }

        $tokenHash = Str::random(40);
        $otpCode = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);

        $invitation->update([
            'token_hash' => $tokenHash,
            'otp_code' => $otpCode,
            'expires_at' => now()->addDays(7),
        ]);

        $waNotice = '';
        if (!empty($invitation->phone) && app(\App\Services\WhatsApp\WhatsAppGatewayService::class)->isActive()) {
            $institutionName = $tenantContext->get()?->name ?? 'Sekolah / Madrasah';
            $inviteUrl = url("/invitations/{$tokenHash}");
            $waService = app(\App\Services\WhatsApp\WhatsAppGatewayService::class);
            $template = \App\Models\WaTemplate::where('code', 'INVITATION_OTP')->first();

            $message = $template
                ? $waService->renderTemplate($template->content, [
                    'nama_guru' => $invitation->email,
                    'nama_sekolah' => $institutionName,
                    'otp_code' => $otpCode,
                    'link_undangan' => $inviteUrl,
                ])
                : "Halo Bapak/Ibu Guru ({$invitation->email}),\n\nUndangan bergabung dengan *{$institutionName}* telah diperbarui.\n\n🔐 *Kode OTP Baru:* *{$otpCode}*\n\nSilakan klik tautan aktivasi:\n🔗 {$inviteUrl}";

            $res = $waService->sendMessage(
                number: $invitation->phone,
                message: $message,
                footer: $template?->footer,
                source: 'INVITATION_OTP',
                recipientName: $invitation->email,
                tenantId: $invitation->tenant_id,
                userId: auth()->id()
            );

            if ($res['success']) {
                $waNotice = " & notifikasi WhatsApp otomatis terkirim ke {$invitation->phone}.";
            }
        }

        return back()->with('success', "Undangan untuk {$invitation->email} berhasil diperbarui. Kode OTP baru: [{$otpCode}]{$waNotice}.");
    }

    /**
     * Revoke / cancel invitation
     */
    public function destroy(TenantInvitation $invitation, TenantContext $tenantContext): RedirectResponse
    {
        if ($invitation->tenant_id !== $tenantContext->id()) {
            abort(403);
        }

        $invitation->delete();

        return back()->with('success', 'Undangan berhasil dibatalkan.');
    }

    /**
     * Public page to view and accept invitation
     */
    public function showAccept(string $token): Response|RedirectResponse
    {
        $invitation = TenantInvitation::with(['tenant.institution', 'role'])
            ->where('token_hash', $token)
            ->first();

        if (!$invitation || $invitation->isExpired() || $invitation->isAccepted()) {
            return Inertia::render('Auth/InvitationInvalid', [
                'reason' => !$invitation
                    ? 'Tautan undangan tidak valid atau tidak ditemukan.'
                    : ($invitation->isAccepted() ? 'Undangan ini sudah pernah diterima sebelumnya.' : 'Tautan undangan telah kedaluwarsa.'),
            ]);
        }

        $existingUser = User::where('email', $invitation->email)->first();

        return Inertia::render('Auth/AcceptInvitation', [
            'invitation' => [
                'token' => $invitation->token_hash,
                'email' => $invitation->email,
                'tenant_name' => $invitation->tenant->name,
                'institution' => $invitation->tenant->institution ? [
                    'name' => $invitation->tenant->institution->name,
                    'type' => $invitation->tenant->institution->type,
                    'city' => $invitation->tenant->institution->city,
                ] : null,
                'role_name' => $invitation->role->display_name,
            ],
            'is_existing_user' => !!$existingUser,
        ]);
    }

    /**
     * Process accepting invitation with OTP verification
     */
    public function processAccept(Request $request, string $token): RedirectResponse
    {
        $invitation = TenantInvitation::with(['tenant.institution', 'role'])
            ->where('token_hash', $token)
            ->firstOrFail();

        if ($invitation->isExpired() || $invitation->isAccepted()) {
            return redirect()->route('login')->with('error', 'Undangan tidak valid atau sudah kedaluwarsa.');
        }

        $user = User::where('email', $invitation->email)->first();

        $rules = [
            'otp' => ['required', 'string', 'size:6'],
        ];

        if (!$user) {
            $rules['name'] = ['required', 'string', 'max:255'];
            $rules['password'] = ['required', 'string', 'min:8', 'confirmed'];
        }

        $validated = $request->validate($rules);

        // Verify OTP Code
        if (!$invitation->verifyOtp($validated['otp'])) {
            return back()->withErrors(['otp' => 'Kode OTP verifikasi tidak valid atau salah. Silakan periksa kembali atau hubungi Administrator Sekolah Anda.']);
        }

        if (!$user) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $invitation->email,
                'password' => Hash::make($validated['password']),
                'status' => 'ACTIVE',
                'email_verified_at' => now(),
                'last_active_tenant_id' => $invitation->tenant_id,
            ]);
        }

        // Add tenant membership
        TenantMembership::updateOrCreate(
            [
                'tenant_id' => $invitation->tenant_id,
                'user_id' => $user->id,
            ],
            [
                'role_id' => $invitation->role_id,
                'membership_status' => 'ACTIVE',
                'joined_at' => now(),
                'is_default' => true,
            ]
        );

        // Create teacher profile if institution
        TeacherProfile::firstOrCreate(
            [
                'tenant_id' => $invitation->tenant_id,
                'user_id' => $user->id,
            ],
            [
                'institution_id' => $invitation->tenant->institution?->id,
                'employment_status' => 'GTY',
                'is_active' => true,
            ]
        );

        $invitation->update(['accepted_at' => now()]);

        auth()->login($user);

        return redirect()->route('dashboard')
            ->with('success', "Selamat datang di ruang kerja {$invitation->tenant->name}!");
    }
}
