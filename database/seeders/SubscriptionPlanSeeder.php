<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use App\Models\Tenant;
use App\Models\TenantSubscription;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Guru Mandiri (Uji Coba)',
                'slug' => 'guru-mandiri-trial',
                'client_model' => 'INDIVIDUAL',
                'price' => 0,
                'duration_days' => 14,
                'max_seats' => 1,
                'ai_generation_quota' => 25,
                'features' => [
                    'Katalog Resmi CP BSKAP 046 & KMA 1503',
                    'Generator TP & Alur TP Dasar',
                    'Maksimal 25 request AI KBC per periode',
                    'Cetak RPP & Asesmen format standar',
                ],
                'is_active' => true,
                'is_popular' => false,
                'order_index' => 1,
            ],
            [
                'name' => 'Guru Mandiri (Pro)',
                'slug' => 'guru-mandiri-pro',
                'client_model' => 'INDIVIDUAL',
                'price' => 49000,
                'duration_days' => 30,
                'max_seats' => 1,
                'ai_generation_quota' => 250,
                'features' => [
                    'Semua fitur Guru Mandiri Uji Coba',
                    'Generator Modul Ajar KBC Berbasis Panca Cinta Lengkap',
                    'Bank Soal HOTS & Kisi-kisi Asesmen Otomatis',
                    'Rubrik Sikap Panca Cinta 4 Skala Deskriptif',
                    '250 kuota generasi AI cerdas setiap bulan',
                    'Cetak Lembar Ujian & Kunci Jawaban Resmi',
                ],
                'is_active' => true,
                'is_popular' => true,
                'order_index' => 2,
            ],
            [
                'name' => 'Madrasah / Sekolah (Standar)',
                'slug' => 'sekolah-madrasah-standar',
                'client_model' => 'INSTITUTION',
                'price' => 299000,
                'duration_days' => 30,
                'max_seats' => 15,
                'ai_generation_quota' => 1500,
                'features' => [
                    'Termasuk 15 Lisensi Guru Madrasah / Sekolah',
                    'Kop Surat & Logo Resmi Lembaga Otomatis',
                    'Pengaturan Kalender Akademik & Semester',
                    '1.500 kuota bersama generasi AI per bulan',
                    'Dukungan 4 AI Provider (Gemini, Grok, DeepSeek, OpenRouter)',
                    'Dashboard Pantauan Perangkat Ajar Guru',
                ],
                'is_active' => true,
                'is_popular' => false,
                'order_index' => 3,
            ],
            [
                'name' => 'Madrasah / Sekolah (Unggulan)',
                'slug' => 'sekolah-madrasah-unggulan',
                'client_model' => 'INSTITUTION',
                'price' => 699000,
                'duration_days' => 30,
                'max_seats' => 50,
                'ai_generation_quota' => 5000,
                'features' => [
                    'Termasuk 50 Lisensi Guru Aktif',
                    'Semua fitur Sekolah Standar',
                    '5.000 kuota bersama generasi AI per bulan',
                    'Prioritas Kecepatan Generasi AI Server EduGen',
                    'Arsip & Export Portofolio Kurikulum KBC untuk Akreditasi',
                    'Layanan Bantuan Prioritas via WhatsApp VIP',
                ],
                'is_active' => true,
                'is_popular' => true,
                'order_index' => 4,
            ],
        ];

        foreach ($plans as $p) {
            SubscriptionPlan::updateOrCreate(['slug' => $p['slug']], $p);
        }

        // Attach active subscription to default tenant MTsN 1 Jakarta Pusat
        $institutionTenant = Tenant::where('slug', 'mtsn-1-jakarta-pusat')->first();
        $schoolPlan = SubscriptionPlan::where('slug', 'sekolah-madrasah-standar')->first();

        if ($institutionTenant && $schoolPlan) {
            TenantSubscription::updateOrCreate(
                ['tenant_id' => $institutionTenant->id],
                [
                    'subscription_plan_id' => $schoolPlan->id,
                    'status' => 'ACTIVE',
                    'starts_at' => Carbon::now()->subDays(5),
                    'ends_at' => Carbon::now()->addDays(25),
                    'ai_quota_used' => 18,
                    'ai_quota_limit' => $schoolPlan->ai_generation_quota,
                    'seats_limit' => $schoolPlan->max_seats,
                    'auto_renew' => true,
                ]
            );
        }
    }
}
