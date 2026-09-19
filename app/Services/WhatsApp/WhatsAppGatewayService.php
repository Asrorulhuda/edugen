<?php

namespace App\Services\WhatsApp;

use App\Models\WaGatewaySetting;
use App\Models\WaMessageLog;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class WhatsAppGatewayService
{
    /**
     * Normalize phone number to standard international format (e.g. 628123456789)
     */
    public function normalizePhoneNumber(string $phone): string
    {
        $clean = preg_replace('/[^0-9]/', '', $phone);

        if (str_starts_with($clean, '0')) {
            $clean = '62' . substr($clean, 1);
        } elseif (str_starts_with($clean, '8')) {
            $clean = '62' . $clean;
        }

        return $clean;
    }

    /**
     * Check whether WhatsApp Gateway is active and properly configured
     */
    public function isActive(): bool
    {
        $setting = WaGatewaySetting::current();
        return (bool) ($setting->is_active && !empty($setting->api_key) && !empty($setting->sender));
    }

    /**
     * Send a single WhatsApp message via the configured gateway endpoint
     */
    public function sendMessage(
        string $number,
        string $message,
        ?string $footer = null,
        string $source = 'MANUAL',
        ?string $recipientName = null,
        ?int $tenantId = null,
        ?int $userId = null
    ): array {
        $setting = WaGatewaySetting::current();
        $normalizedNumber = $this->normalizePhoneNumber($number);
        $finalFooter = $footer !== null ? $footer : $setting->default_footer;

        if (empty($setting->api_key) || empty($setting->sender)) {
            $log = WaMessageLog::create([
                'recipient_number' => $normalizedNumber,
                'recipient_name' => $recipientName,
                'message' => $message,
                'footer' => $finalFooter,
                'status' => 'FAILED',
                'source' => $source,
                'error_message' => 'API Key atau Sender WhatsApp belum dikonfigurasi di Super Admin.',
                'tenant_id' => $tenantId,
                'user_id' => $userId,
            ]);

            return [
                'success' => false,
                'message' => 'Gateway WhatsApp belum dikonfigurasi lengkap (API Key / Sender kosong).',
                'log_id' => $log->id,
            ];
        }

        // Create log record with PENDING status
        $log = WaMessageLog::create([
            'recipient_number' => $normalizedNumber,
            'recipient_name' => $recipientName,
            'message' => $message,
            'footer' => $finalFooter,
            'status' => 'PENDING',
            'source' => $source,
            'tenant_id' => $tenantId,
            'user_id' => $userId,
        ]);

        $endpoint = $setting->endpoint_url ?: 'https://gateway.asr-desain.my.id/send-message';

        $payload = [
            'api_key' => $setting->api_key,
            'sender' => $setting->sender,
            'number' => $normalizedNumber,
            'message' => $message,
            'footer' => $finalFooter,
            'full' => $setting->full_response ? 1 : 0,
        ];

        try {
            $response = Http::timeout(15)
                ->asJson()
                ->acceptJson()
                ->post($endpoint, $payload);

            $responseData = $response->json();
            $isHttpOk = $response->successful();

            // Some WhatsApp gateway endpoints return status inside json body
            $isGatewaySuccess = $isHttpOk;
            if (is_array($responseData)) {
                if (isset($responseData['status']) && ($responseData['status'] === false || $responseData['status'] === 'false' || $responseData['status'] === 0)) {
                    $isGatewaySuccess = false;
                }
            }

            if ($isGatewaySuccess) {
                $log->update([
                    'status' => 'SENT',
                    'sent_at' => now(),
                    'response_payload' => $responseData,
                    'error_message' => null,
                ]);

                return [
                    'success' => true,
                    'message' => 'Pesan WhatsApp berhasil dikirim.',
                    'log_id' => $log->id,
                    'data' => $responseData,
                ];
            }

            $errorMessage = is_array($responseData) && isset($responseData['msg']) 
                ? $responseData['msg'] 
                : (is_array($responseData) && isset($responseData['message']) ? $responseData['message'] : 'Respon gateway gagal (HTTP ' . $response->status() . ')');

            $log->update([
                'status' => 'FAILED',
                'response_payload' => $responseData,
                'error_message' => $errorMessage,
            ]);

            return [
                'success' => false,
                'message' => 'Gagal mengirim pesan: ' . $errorMessage,
                'log_id' => $log->id,
                'data' => $responseData,
            ];
        } catch (Throwable $e) {
            Log::error('WhatsApp Gateway Exception: ' . $e->getMessage(), [
                'number' => $normalizedNumber,
                'endpoint' => $endpoint,
            ]);

            $log->update([
                'status' => 'FAILED',
                'error_message' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Terjadi kesalahan koneksi ke server gateway: ' . $e->getMessage(),
                'log_id' => $log->id,
            ];
        }
    }

    /**
     * Test gateway connection by sending a verification ping to a test number
     */
    public function testConnection(string $testNumber, ?string $customMessage = null): array
    {
        $setting = WaGatewaySetting::current();
        $message = $customMessage ?: "🔔 *Tes Koneksi EduGen AI WhatsApp Gateway*\n\nKoneksi berhasil terhubung dari server EduGen AI ke WhatsApp Gateway.\nWaktu: " . now()->translatedFormat('d F Y H:i:s') . ' WIB';

        $result = $this->sendMessage(
            number: $testNumber,
            message: $message,
            footer: $setting->default_footer,
            source: 'SYSTEM',
            recipientName: 'Super Admin Test'
        );

        $setting->update([
            'last_tested_at' => now(),
            'last_test_status' => $result['success'] ? 'SUCCESS' : 'FAILED',
            'last_test_message' => $result['message'],
        ]);

        return $result;
    }

    /**
     * Render template by replacing variable placeholders with dynamic data
     */
    public function renderTemplate(string $templateContent, array $variables = []): string
    {
        $rendered = $templateContent;
        foreach ($variables as $key => $value) {
            $rendered = str_replace('{' . $key . '}', (string) $value, $rendered);
        }
        return $rendered;
    }
}
