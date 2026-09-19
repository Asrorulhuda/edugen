<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Define all permissions grouped by module
        $permissions = [
            // Platform / Super Admin
            ['name' => 'platform.manage_all_tenants', 'display_name' => 'Kelola Semua Tenant', 'module' => 'platform'],
            ['name' => 'platform.manage_plans', 'display_name' => 'Kelola Paket & Entitlement', 'module' => 'platform'],
            ['name' => 'platform.manage_regulations', 'display_name' => 'Kelola Master Regulasi & CP', 'module' => 'platform'],
            ['name' => 'platform.manage_ai_providers', 'display_name' => 'Kelola Konfigurasi Provider AI', 'module' => 'platform'],
            ['name' => 'platform.view_system_analytics', 'display_name' => 'Lihat Analitik & Audit Log', 'module' => 'platform'],
            ['name' => 'platform.impersonate_tenant', 'display_name' => 'Support Session / Impersonate', 'module' => 'platform'],

            // Institution Admin
            ['name' => 'institution.manage_profile', 'display_name' => 'Kelola Profil Lembaga', 'module' => 'institution'],
            ['name' => 'institution.manage_branding', 'display_name' => 'Kelola Logo & Kop Lembaga', 'module' => 'institution'],
            ['name' => 'institution.manage_academic_years', 'display_name' => 'Kelola Tahun Ajaran & Semester', 'module' => 'institution'],
            ['name' => 'institution.manage_teachers', 'display_name' => 'Kelola Data & Akun Guru', 'module' => 'institution'],
            ['name' => 'tenants.view_institution_usage', 'display_name' => 'Lihat Penggunaan Lembaga', 'module' => 'institution'],

            // Academic / Teacher (both Personal & Institution)
            ['name' => 'teaching_docs.view_cp', 'display_name' => 'Lihat CP Resmi Terpublikasi', 'module' => 'academic'],
            ['name' => 'teaching_docs.generate_tp_atp', 'display_name' => 'Generate TP & Alur Tujuan Pembelajaran', 'module' => 'generator'],
            ['name' => 'teaching_docs.generate_rpp_modul', 'display_name' => 'Generate RPP / Modul Ajar', 'module' => 'generator'],
            ['name' => 'teaching_docs.generate_perangkat_guru', 'display_name' => 'Generate Perangkat Guru Lengkap', 'module' => 'generator'],
            ['name' => 'questions.generate', 'display_name' => 'Generate Soal & Kisi-Kisi', 'module' => 'generator'],
            ['name' => 'questions.manage_bank', 'display_name' => 'Kelola Bank Soal & Paket Soal', 'module' => 'question_bank'],
            ['name' => 'teaching_docs.manage_own', 'display_name' => 'Kelola Dokumen Pembelajaran Sendiri', 'module' => 'teaching_docs'],
            ['name' => 'documents.export', 'display_name' => 'Export Dokumen (DOCX/PDF/XLSX)', 'module' => 'export'],
            ['name' => 'tenants.view_own_usage', 'display_name' => 'Lihat Penggunaan AI & Storage Sendiri', 'module' => 'tenant'],
            ['name' => 'tenants.manage_own_plan', 'display_name' => 'Kelola Paket Berlangganan Pribadi', 'module' => 'billing'],
        ];

        foreach ($permissions as $p) {
            Permission::firstOrCreate(['name' => $p['name']], $p);
        }

        // 2. Define 4 Core Roles
        $superAdminRole = Role::firstOrCreate(
            ['name' => Role::SUPER_ADMIN],
            [
                'display_name' => 'Super Admin Platform',
                'scope' => 'SYSTEM',
                'description' => 'Akses penuh ke seluruh control plane SaaS, master regulasi CP, tenant, dan billing.',
            ]
        );

        $personalTeacherRole = Role::firstOrCreate(
            ['name' => Role::PERSONAL_TEACHER],
            [
                'display_name' => 'Guru Individu',
                'scope' => 'TENANT_INDIVIDUAL',
                'description' => 'Akses ke personal workspace, generator perangkat pembelajaran, bank soal, dan export dokumen.',
            ]
        );

        $adminRole = Role::firstOrCreate(
            ['name' => Role::ADMIN],
            [
                'display_name' => 'Admin Lembaga / Sekolah',
                'scope' => 'TENANT_INSTITUTION',
                'description' => 'Pengelola profil lembaga, kop surat/logo, tahun ajaran, dan data/akun guru di sekolah.',
            ]
        );

        $teacherRole = Role::firstOrCreate(
            ['name' => Role::TEACHER],
            [
                'display_name' => 'Guru Lembaga / Sekolah',
                'scope' => 'TENANT_INSTITUTION',
                'description' => 'Guru di instansi sekolah yang membuat perangkat pembelajaran dan soal beridentitas sekolah.',
            ]
        );

        // 3. Assign Permissions to Roles deterministically
        // Super admin gets all permissions
        $superAdminRole->permissions()->sync(Permission::all());

        // Personal Teacher permissions
        $personalTeacherPermissions = Permission::whereIn('name', [
            'teaching_docs.view_cp',
            'teaching_docs.generate_tp_atp',
            'teaching_docs.generate_rpp_modul',
            'teaching_docs.generate_perangkat_guru',
            'questions.generate',
            'questions.manage_bank',
            'teaching_docs.manage_own',
            'documents.export',
            'tenants.view_own_usage',
            'tenants.manage_own_plan',
        ])->get();
        $personalTeacherRole->permissions()->sync($personalTeacherPermissions);

        // Institution Admin permissions (No direct document generation as principal role, strictly school admin)
        $adminPermissions = Permission::whereIn('name', [
            'institution.manage_profile',
            'institution.manage_branding',
            'institution.manage_academic_years',
            'institution.manage_teachers',
            'tenants.view_institution_usage',
        ])->get();
        $adminRole->permissions()->sync($adminPermissions);

        // Institution Teacher permissions
        $teacherPermissions = Permission::whereIn('name', [
            'teaching_docs.view_cp',
            'teaching_docs.generate_tp_atp',
            'teaching_docs.generate_rpp_modul',
            'teaching_docs.generate_perangkat_guru',
            'questions.generate',
            'questions.manage_bank',
            'teaching_docs.manage_own',
            'documents.export',
            'tenants.view_own_usage',
        ])->get();
        $teacherRole->permissions()->sync($teacherPermissions);

        // 4. Create Platform Core Tenant & Default Super Admin User
        $platformTenant = \App\Models\Tenant::firstOrCreate(
            ['slug' => 'platform-core'],
            [
                'name' => 'EduGen Platform Core',
                'tenant_type' => 'INDIVIDUAL',
                'status' => 'ACTIVE',
            ]
        );

        $superAdminUser = \App\Models\User::firstOrCreate(
            ['email' => 'admin@edugen.id'],
            [
                'name' => 'Super Administrator',
                'password' => \Illuminate\Support\Facades\Hash::make('Password123!'),
                'status' => 'ACTIVE',
                'email_verified_at' => now(),
                'last_active_tenant_id' => $platformTenant->id,
            ]
        );

        \App\Models\TenantMembership::firstOrCreate(
            [
                'tenant_id' => $platformTenant->id,
                'user_id' => $superAdminUser->id,
            ],
            [
                'role_id' => $superAdminRole->id,
                'membership_status' => 'ACTIVE',
                'is_default' => true,
            ]
        );
    }
}
