<?php

namespace App\Http\Controllers\Admin\Crm;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use App\Models\WaGatewaySetting;
use App\Models\WaMessageLog;
use App\Models\WaTemplate;
use App\Services\WhatsApp\WhatsAppGatewayService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminWhatsAppController extends Controller
{
    /**
     * Display CRM & WhatsApp Gateway Dashboard
     */
    public function index(Request $request): Response
    {
        $setting = WaGatewaySetting::current();
        $templates = WaTemplate::orderByDesc('is_system')->orderBy('title')->get();

        // Query message logs with filters
        $logsQuery = WaMessageLog::with(['tenant:id,name,tenant_type', 'user:id,name,email'])
            ->orderByDesc('id');

        if ($request->filled('status')) {
            $logsQuery->where('status', $request->input('status'));
        }

        if ($request->filled('source')) {
            $logsQuery->where('source', $request->input('source'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $logsQuery->where(function ($q) use ($search) {
                $q->where('recipient_number', 'like', "%{$search}%")
                  ->orWhere('recipient_name', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $logs = $logsQuery->paginate(15)->withQueryString();

        // Compute CRM Metrics
        $totalSent = WaMessageLog::where('status', 'SENT')->count();
        $totalFailed = WaMessageLog::where('status', 'FAILED')->count();
        $totalPending = WaMessageLog::where('status', 'PENDING')->count();
        $totalAll = $totalSent + $totalFailed + $totalPending;
        $successRate = $totalAll > 0 ? round(($totalSent / $totalAll) * 100, 1) : 100;

        // CRM Audience Segments count
        $teachersCount = Tenant::where('tenant_type', 'INDIVIDUAL')->count();
        $schoolsCount = Tenant::where('tenant_type', 'INSTITUTION')->count();
        $expiringCount = Tenant::whereHas('subscriptions', function ($q) {
            $q->where('status', 'ACTIVE')
              ->whereBetween('ends_at', [now(), now()->addDays(7)]);
        })->count();
        $lowQuotaCount = Tenant::whereHas('subscriptions', function ($q) {
            $q->where('status', 'ACTIVE')
              ->whereRaw('(ai_quota_limit - ai_quota_used) <= ?', [5]);
        })->count();

        // Clients list for direct target selector dropdown
        $clientRecipients = Tenant::with([
            'primaryAdmin:id,name,email',
            'institution:id,tenant_id,name,phone',
            'teacherProfiles:id,tenant_id,phone',
            'subscriptions' => fn($q) => $q->where('status', 'ACTIVE')->latest(),
        ])
            ->select('id', 'name', 'tenant_type', 'slug', 'primary_admin_user_id')
            ->get()
            ->map(function ($tenant) {
                $sub = $tenant->subscriptions->first();
                $phone = $tenant->institution?->phone ?? $tenant->teacherProfiles->first()?->phone;
                return [
                    'id' => $tenant->id,
                    'name' => $tenant->name,
                    'type' => $tenant->tenant_type,
                    'contact_name' => $tenant->primaryAdmin?->name,
                    'phone' => $phone,
                    'remaining_quota' => $sub ? $sub->remainingAiQuota() : 0,
                    'expires_at' => $sub?->ends_at?->translatedFormat('d M Y'),
                ];
            });

        return Inertia::render('Admin/Crm/Index', [
            'setting' => $setting,
            'templates' => $templates,
            'logs' => $logs,
            'filters' => $request->only(['status', 'source', 'search']),
            'stats' => [
                'total_sent' => $totalSent,
                'total_failed' => $totalFailed,
                'total_pending' => $totalPending,
                'success_rate' => $successRate,
                'total_templates' => $templates->count(),
            ],
            'audiences' => [
                'teachers_count' => $teachersCount,
                'schools_count' => $schoolsCount,
                'expiring_count' => $expiringCount,
                'low_quota_count' => $lowQuotaCount,
            ],
            'clientRecipients' => $clientRecipients,
        ]);
    }

    /**
     * Update WhatsApp Gateway Configuration
     */
    public function updateSettings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'endpoint_url' => ['required', 'url', 'max:255'],
            'api_key' => ['nullable', 'string', 'max:255'],
            'sender' => ['nullable', 'string', 'max:30'],
            'default_footer' => ['nullable', 'string', 'max:100'],
            'is_active' => ['required', 'boolean'],
            'full_response' => ['required', 'boolean'],
        ]);

        $setting = WaGatewaySetting::current();
        $setting->update($validated);

        return back()->with('success', 'Pengaturan WhatsApp Gateway berhasil diperbarui.');
    }

    /**
     * Test gateway connection to a recipient number
     */
    public function testConnection(Request $request, WhatsAppGatewayService $service): RedirectResponse
    {
        $validated = $request->validate([
            'test_number' => ['required', 'string', 'max:30'],
            'custom_message' => ['nullable', 'string', 'max:500'],
        ]);

        $result = $service->testConnection(
            testNumber: $validated['test_number'],
            customMessage: $validated['custom_message'] ?? null
        );

        if ($result['success']) {
            return back()->with('success', 'Tes koneksi WhatsApp Gateway berhasil! Pesan telah terkirim.');
        }

        return back()->with('error', 'Tes koneksi WhatsApp Gateway gagal: ' . $result['message']);
    }

    /**
     * Send direct message to a single number
     */
    public function sendMessage(Request $request, WhatsAppGatewayService $service): RedirectResponse
    {
        $validated = $request->validate([
            'recipient_number' => ['required', 'string', 'max:30'],
            'recipient_name' => ['nullable', 'string', 'max:100'],
            'message' => ['required', 'string', 'max:3000'],
            'footer' => ['nullable', 'string', 'max:100'],
            'tenant_id' => ['nullable', 'exists:tenants,id'],
        ]);

        $result = $service->sendMessage(
            number: $validated['recipient_number'],
            message: $validated['message'],
            footer: $validated['footer'] ?? null,
            source: 'MANUAL',
            recipientName: $validated['recipient_name'] ?? null,
            tenantId: $validated['tenant_id'] ?? null,
            userId: $request->user()->id
        );

        if ($result['success']) {
            return back()->with('success', 'Pesan WhatsApp berhasil dikirim ke ' . $validated['recipient_number']);
        }

        return back()->with('error', 'Gagal mengirim pesan: ' . $result['message']);
    }

    /**
     * Broadcast bulk message to filtered audience segment
     */
    public function broadcast(Request $request, WhatsAppGatewayService $service): RedirectResponse
    {
        $validated = $request->validate([
            'audience_segment' => ['required', 'in:ALL_TEACHERS,ALL_SCHOOLS,EXPIRING_SOON,LOW_QUOTA,CUSTOM'],
            'message_template' => ['required', 'string', 'max:3000'],
            'footer' => ['nullable', 'string', 'max:100'],
            'custom_numbers' => ['nullable', 'string'],
        ]);

        $targets = collect();

        if ($validated['audience_segment'] === 'CUSTOM') {
            $rawLines = preg_split('/[\r\n,]+/', $validated['custom_numbers'] ?? '');
            foreach ($rawLines as $line) {
                $trimmed = trim($line);
                if (!empty($trimmed)) {
                    $targets->push([
                        'name' => 'Klien EduGen',
                        'phone' => $trimmed,
                        'sekolah' => '-',
                        'paket' => '-',
                        'sisa_kuota' => '-',
                        'hari_tersisa' => '-',
                        'tanggal_expired' => '-',
                        'tenant_id' => null,
                    ]);
                }
            }
        } else {
            $query = Tenant::with([
                'primaryAdmin',
                'institution:id,tenant_id,name,phone',
                'teacherProfiles:id,tenant_id,phone',
                'subscriptions' => fn($q) => $q->where('status', 'ACTIVE')->latest(),
            ]);

            if ($validated['audience_segment'] === 'ALL_TEACHERS') {
                $query->where('tenant_type', 'INDIVIDUAL');
            } elseif ($validated['audience_segment'] === 'ALL_SCHOOLS') {
                $query->where('tenant_type', 'INSTITUTION');
            } elseif ($validated['audience_segment'] === 'EXPIRING_SOON') {
                $query->whereHas('subscriptions', fn($q) => $q->where('status', 'ACTIVE')->whereBetween('ends_at', [now(), now()->addDays(7)]));
            } elseif ($validated['audience_segment'] === 'LOW_QUOTA') {
                $query->whereHas('subscriptions', fn($q) => $q->where('status', 'ACTIVE')->whereRaw('(ai_quota_limit - ai_quota_used) <= ?', [5]));
            }

            $tenants = $query->get();
            foreach ($tenants as $tenant) {
                $phone = $tenant->institution?->phone ?? $tenant->teacherProfiles->first()?->phone;
                if (!empty($phone)) {
                    $sub = $tenant->subscriptions->first();
                    $daysLeft = $sub && $sub->ends_at ? max(0, (int) now()->diffInDays($sub->ends_at, false)) : 0;
                    $targets->push([
                        'name' => $tenant->primaryAdmin?->name ?? $tenant->name,
                        'phone' => $phone,
                        'sekolah' => $tenant->name,
                        'paket' => $sub?->plan?->name ?? 'Paket Klien',
                        'sisa_kuota' => (string) ($sub ? $sub->remainingAiQuota() : 0),
                        'hari_tersisa' => (string) $daysLeft,
                        'tanggal_expired' => $sub?->ends_at ? $sub->ends_at->translatedFormat('d M Y') : '-',
                        'tenant_id' => $tenant->id,
                    ]);
                }
            }
        }

        if ($targets->isEmpty()) {
            return back()->with('error', 'Tidak ada nomor tujuan valid yang ditemukan pada segmen terpilih.');
        }

        $sentCount = 0;
        $failCount = 0;

        foreach ($targets as $target) {
            $renderedMessage = $service->renderTemplate($validated['message_template'], [
                'nama' => $target['name'],
                'sekolah' => $target['sekolah'],
                'paket' => $target['paket'],
                'sisa_kuota' => $target['sisa_kuota'],
                'hari_tersisa' => $target['hari_tersisa'],
                'tanggal_expired' => $target['tanggal_expired'],
                'link_perpanjang' => url('/billing'),
            ]);

            $res = $service->sendMessage(
                number: $target['phone'],
                message: $renderedMessage,
                footer: $validated['footer'] ?? null,
                source: 'BROADCAST',
                recipientName: $target['name'],
                tenantId: $target['tenant_id'],
                userId: $request->user()->id
            );

            if ($res['success']) {
                $sentCount++;
            } else {
                $failCount++;
            }
        }

        return back()->with('success', "Broadcast selesai! {$sentCount} pesan terkirim, {$failCount} gagal.");
    }

    /**
     * Store new message template
     */
    public function storeTemplate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:100'],
            'code' => ['required', 'string', 'max:50', 'unique:wa_templates,code'],
            'category' => ['required', 'in:TRANSACTIONAL,MARKETING,REMINDER'],
            'content' => ['required', 'string', 'max:2000'],
            'footer' => ['nullable', 'string', 'max:100'],
        ]);

        WaTemplate::create([
            ...$validated,
            'is_active' => true,
            'is_system' => false,
        ]);

        return back()->with('success', 'Template pesan WhatsApp berhasil ditambahkan.');
    }

    /**
     * Update message template
     */
    public function updateTemplate(Request $request, WaTemplate $template): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:100'],
            'category' => ['required', 'in:TRANSACTIONAL,MARKETING,REMINDER'],
            'content' => ['required', 'string', 'max:2000'],
            'footer' => ['nullable', 'string', 'max:100'],
            'is_active' => ['required', 'boolean'],
        ]);

        $template->update($validated);

        return back()->with('success', 'Template pesan WhatsApp berhasil diperbarui.');
    }

    /**
     * Delete message template (only non-system templates)
     */
    public function destroyTemplate(WaTemplate $template): RedirectResponse
    {
        if ($template->is_system) {
            return back()->with('error', 'Template sistem tidak dapat dihapus.');
        }

        $template->delete();

        return back()->with('success', 'Template pesan WhatsApp berhasil dihapus.');
    }

    /**
     * Retry sending failed message log
     */
    public function retryLog(WaMessageLog $log, WhatsAppGatewayService $service): RedirectResponse
    {
        $result = $service->sendMessage(
            number: $log->recipient_number,
            message: $log->message,
            footer: $log->footer,
            source: $log->source,
            recipientName: $log->recipient_name,
            tenantId: $log->tenant_id,
            userId: auth()->id()
        );

        if ($result['success']) {
            return back()->with('success', 'Pesan berhasil dikirim ulang.');
        }

        return back()->with('error', 'Gagal mengirim ulang pesan: ' . $result['message']);
    }
}
