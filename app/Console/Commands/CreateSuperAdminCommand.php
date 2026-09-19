<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\Tenant;
use App\Models\TenantMembership;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateSuperAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-superadmin 
                            {--name= : Nama Lengkap Super Admin}
                            {--email= : Alamat Email Super Admin}
                            {--password= : Password akun}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Membuat akun Super Admin platform EduGen KBC';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('=== Inisialisasi Akun Super Admin EduGen KBC ===');

        // Pastikan role seeder sudah jalan
        $superAdminRole = Role::where('name', Role::SUPER_ADMIN)->first();
        if (!$superAdminRole) {
            $this->warn('Role SUPER_ADMIN belum ditemukan, menjalankan seeder...');
            $seeder = new RoleAndPermissionSeeder();
            $seeder->run();
            $superAdminRole = Role::where('name', Role::SUPER_ADMIN)->firstOrFail();
        }

        $name = $this->option('name') ?: $this->ask('Nama Super Admin', 'Super Admin EduGen');
        $email = $this->option('email') ?: $this->ask('Email Super Admin', 'admin@edugen.id');
        $password = $this->option('password') ?: $this->secret('Password');

        if (!$password) {
            $this->error('Password tidak boleh kosong!');
            return Command::FAILURE;
        }

        $user = User::firstOrNew(['email' => $email]);
        $user->name = $name;
        $user->password = Hash::make($password);
        $user->status = 'ACTIVE';
        $user->email_verified_at = now();
        $user->save();

        // Buat platform system tenant khusus jika belum ada
        $systemTenant = Tenant::firstOrCreate(
            ['slug' => 'platform-core'],
            [
                'name' => 'EduGen KBC Platform Control',
                'tenant_type' => 'INDIVIDUAL',
                'primary_admin_user_id' => $user->id,
                'status' => 'ACTIVE',
                'timezone' => 'Asia/Jakarta',
                'locale' => 'id',
                'created_by_superadmin' => true,
            ]
        );

        TenantMembership::updateOrCreate(
            [
                'tenant_id' => $systemTenant->id,
                'user_id' => $user->id,
            ],
            [
                'role_id' => $superAdminRole->id,
                'membership_status' => 'ACTIVE',
                'is_default' => true,
                'joined_at' => now(),
            ]
        );

        $user->update(['last_active_tenant_id' => $systemTenant->id]);

        $this->info("Akun Super Admin berhasil dibuat/diperbarui: {$user->email}");
        $this->table(
            ['Field', 'Nilai'],
            [
                ['Nama', $user->name],
                ['Email', $user->email],
                ['Role', 'SUPER_ADMIN'],
                ['Tenant Default', $systemTenant->name],
                ['Status', 'ACTIVE'],
            ]
        );

        return Command::SUCCESS;
    }
}
