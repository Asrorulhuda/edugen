<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Institution;
use App\Models\Role;
use App\Models\Semester;
use App\Models\Subject;
use App\Models\TeacherProfile;
use App\Models\Tenant;
use App\Models\TenantMembership;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class InstitutionTenantSeeder extends Seeder
{
    /**
     * Seed a realistic institutional tenant (MTs Negeri 1 Jakarta Pusat)
     */
    public function run(): void
    {
        $adminRole = Role::where('name', Role::ADMIN)->firstOrFail();
        $teacherRole = Role::where('name', Role::TEACHER)->firstOrFail();
        $superAdminUser = User::where('email', 'admin@edugen.id')->first();

        // 1. Create School Admin User
        $schoolAdminUser = User::firstOrCreate(
            ['email' => 'admin.mtsn1@edugen.id'],
            [
                'name' => 'Drs. H. Ahmad Fauzi, M.Pd.',
                'password' => Hash::make('Password123!'),
                'status' => 'ACTIVE',
                'email_verified_at' => now(),
            ]
        );

        // 2. Create School Tenant
        $tenant = Tenant::firstOrCreate(
            ['slug' => 'mtsn-1-jakarta-pusat'],
            [
                'name' => 'MTs Negeri 1 Jakarta Pusat',
                'tenant_type' => 'INSTITUTION',
                'primary_admin_user_id' => $schoolAdminUser->id,
                'status' => 'ACTIVE',
                'timezone' => 'Asia/Jakarta',
                'locale' => 'id',
                'created_by_superadmin' => true,
            ]
        );

        // 3. Create Institution Record
        $institution = Institution::firstOrCreate(
            ['tenant_id' => $tenant->id],
            [
                'name' => 'MTs Negeri 1 Jakarta Pusat',
                'type' => 'MADRASAH',
                'npsn' => '20178392',
                'nsm' => '121131710001',
                'address' => 'Jl. R.P. Soeroso No. 47, Menteng, Kec. Menteng',
                'city' => 'Kota Jakarta Pusat',
                'province' => 'DKI Jakarta',
                'postal_code' => '10350',
                'phone' => '(021) 3142211',
                'email' => 'info@mtsn1jakartapusat.sch.id',
                'website' => 'https://mtsn1jakartapusat.sch.id',
                'principal_name' => 'Drs. H. Ahmad Fauzi, M.Pd.',
                'principal_id_number' => '197204151998031002',
                'default_curriculum_mode' => 'MADRASAH_KBC',
                'status' => 'ACTIVE',
                'header_style' => 'LOGO_LEFT',
                'letterhead_line_1' => 'KEMENTERIAN AGAMA REPUBLIK INDONESIA',
                'letterhead_line_2' => 'KANTOR KEMENTERIAN AGAMA KOTA JAKARTA PUSAT',
                'letterhead_line_3' => 'MADRASAH TSANAWIYAH NEGERI 1 JAKARTA PUSAT',
                'letterhead_subtext' => 'Jl. R.P. Soeroso No. 47, Menteng, Jakarta Pusat 10350. Telp: (021) 3142211 | Email: info@mtsn1jakartapusat.sch.id',
                'signature_city' => 'Jakarta',
                'signature_title' => 'Kepala Madrasah',
            ]
        );

        // 4. Assign Admin Memberships
        TenantMembership::firstOrCreate(
            [
                'tenant_id' => $tenant->id,
                'user_id' => $schoolAdminUser->id,
            ],
            [
                'role_id' => $adminRole->id,
                'membership_status' => 'ACTIVE',
                'joined_at' => now(),
                'is_default' => true,
            ]
        );

        $schoolAdminUser->update(['last_active_tenant_id' => $tenant->id]);

        // Also add superadmin user to this tenant as ADMIN for testing switcher
        if ($superAdminUser) {
            TenantMembership::firstOrCreate(
                [
                    'tenant_id' => $tenant->id,
                    'user_id' => $superAdminUser->id,
                ],
                [
                    'role_id' => $adminRole->id,
                    'membership_status' => 'ACTIVE',
                    'joined_at' => now(),
                    'is_default' => false,
                ]
            );
        }

        // 5. Create Sample Academic Year 2026/2027
        $academicYear = AcademicYear::firstOrCreate(
            [
                'tenant_id' => $tenant->id,
                'label' => '2026/2027',
            ],
            [
                'institution_id' => $institution->id,
                'starts_at' => '2026-07-01',
                'ends_at' => '2027-06-30',
                'is_active' => true,
            ]
        );

        Semester::firstOrCreate(
            [
                'academic_year_id' => $academicYear->id,
                'type' => 'ODD',
            ],
            [
                'label' => 'Semester Ganjil',
                'is_active' => true,
            ]
        );

        Semester::firstOrCreate(
            [
                'academic_year_id' => $academicYear->id,
                'type' => 'EVEN',
            ],
            [
                'label' => 'Semester Genap',
                'is_active' => false,
            ]
        );

        // 6. Create Sample Teacher User
        $teacherUser = User::firstOrCreate(
            ['email' => 'guru.pai@edugen.id'],
            [
                'name' => 'Ust. Rahmat Hidayat, S.Pd.I',
                'password' => Hash::make('Password123!'),
                'status' => 'ACTIVE',
                'email_verified_at' => now(),
                'last_active_tenant_id' => $tenant->id,
            ]
        );

        TenantMembership::firstOrCreate(
            [
                'tenant_id' => $tenant->id,
                'user_id' => $teacherUser->id,
            ],
            [
                'role_id' => $teacherRole->id,
                'membership_status' => 'ACTIVE',
                'joined_at' => now(),
                'is_default' => true,
            ]
        );

        $paiSubject = Subject::where('code', 'PAI_BP')->orWhere('code', 'LIKE', '%PAI%')->first();

        TeacherProfile::firstOrCreate(
            [
                'tenant_id' => $tenant->id,
                'user_id' => $teacherUser->id,
            ],
            [
                'institution_id' => $institution->id,
                'employee_no' => '198506122010011015',
                'nuptk' => '4538763665200023',
                'phone' => '081298765432',
                'employment_status' => 'PNS',
                'primary_subject_id' => $paiSubject?->id,
                'grade_scope' => [7, 8, 9],
                'is_active' => true,
            ]
        );
    }
}
