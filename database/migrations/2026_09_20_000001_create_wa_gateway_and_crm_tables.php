<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('wa_gateway_settings', function (Blueprint $table) {
            $table->id();
            $table->string('endpoint_url')->default('https://gateway.asr-desain.my.id/send-message');
            $table->string('api_key')->nullable();
            $table->string('sender', 30)->nullable();
            $table->string('default_footer')->nullable()->default('EduGen AI - Platform Perangkat Ajar Modern');
            $table->boolean('is_active')->default(false);
            $table->boolean('full_response')->default(true);
            $table->timestamp('last_tested_at')->nullable();
            $table->string('last_test_status', 20)->nullable();
            $table->text('last_test_message')->nullable();
            $table->timestamps();
        });

        Schema::create('wa_templates', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('code')->unique();
            $table->string('category', 30)->default('TRANSACTIONAL'); // TRANSACTIONAL, MARKETING, REMINDER
            $table->text('content');
            $table->string('footer')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_system')->default(false);
            $table->timestamps();
        });

        Schema::create('wa_message_logs', function (Blueprint $table) {
            $table->id();
            $table->string('recipient_number', 30)->index();
            $table->string('recipient_name')->nullable();
            $table->text('message');
            $table->string('footer')->nullable();
            $table->string('status', 20)->default('PENDING')->index(); // PENDING, SENT, FAILED
            $table->string('source', 30)->default('MANUAL')->index(); // MANUAL, BROADCAST, INVITATION_OTP, SYSTEM
            $table->json('response_payload')->nullable();
            $table->text('error_message')->nullable();
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
        });

        // Insert initial gateway settings record
        DB::table('wa_gateway_settings')->insert([
            'endpoint_url' => 'https://gateway.asr-desain.my.id/send-message',
            'api_key' => null,
            'sender' => null,
            'default_footer' => 'EduGen AI - Platform Kurikulum & Perangkat Ajar Terpadu',
            'is_active' => false,
            'full_response' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Seed core system templates
        DB::table('wa_templates')->insert([
            [
                'title' => 'Undangan Guru & Kode OTP',
                'code' => 'INVITATION_OTP',
                'category' => 'TRANSACTIONAL',
                'content' => "Halo {nama_guru},\n\nAnda telah diundang untuk bergabung dengan *{nama_sekolah}* di platform EduGen AI.\n\n🔐 *Kode OTP Verifikasi:* *{otp_code}*\n\nSilakan klik tautan berikut untuk melengkapi aktivasi akun Anda:\n🔗 {link_undangan}\n\nKode OTP ini berlaku selama 7 hari. Mohon jangan bagikan kode ini kepada orang lain demi keamanan.",
                'footer' => 'EduGen AI - Otomasi Perangkat Ajar & RPP',
                'is_active' => true,
                'is_system' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Pengingat Masa Aktif Langganan',
                'code' => 'SUBSCRIPTION_EXPIRING',
                'category' => 'REMINDER',
                'content' => "Halo {nama},\n\nKami menginformasikan bahwa paket langganan *{paket}* Anda di EduGen AI akan berakhir dalam *{hari_tersisa} hari* (pada tanggal {tanggal_expired}).\n\nUntuk memastikan pembuatan RPP, Modul Ajar, dan Soal Ujian tidak terganggu, silakan lakukan perpanjangan melalui tautan berikut:\n🔗 {link_perpanjang}\n\nTerima kasih telah mempercayai EduGen AI!",
                'footer' => 'EduGen AI Customer Care',
                'is_active' => true,
                'is_system' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Pemberitahuan Kuota RPP Menipis',
                'code' => 'QUOTA_LOW',
                'category' => 'REMINDER',
                'content' => "Halo {nama},\n\nSisa kuota pembuatan dokumen cerdas Anda di EduGen AI tersisa *{sisa_kuota} dokumen*.\n\nSegera lakukan top up atau upgrade paket untuk menikmati akses tanpa batas:\n🔗 {link_perpanjang}\n\nSalam hangat,\nTim EduGen AI",
                'footer' => 'EduGen AI Support',
                'is_active' => true,
                'is_system' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Sambutan Klien Baru',
                'code' => 'WELCOME_CLIENT',
                'category' => 'TRANSACTIONAL',
                'content' => "Selamat Datang di EduGen AI, {nama}! 🎉\n\nAkun Anda telah aktif dengan paket *{paket}* ({kuota} kuota dokumen).\n\nAnda sekarang dapat mulai merancang modul ajar, rubrik, dan asesmen kurikulum merdeka secara instan.\n\nPortal: https://edugen.my.id/login\nButuh bantuan? Tim support kami siap melayani Anda.",
                'footer' => 'EduGen AI - Teman Mengajar Terbaik',
                'is_active' => true,
                'is_system' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wa_message_logs');
        Schema::dropIfExists('wa_templates');
        Schema::dropIfExists('wa_gateway_settings');
    }
};
