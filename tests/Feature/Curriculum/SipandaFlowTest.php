<?php

namespace Tests\Feature\Curriculum;

use App\Models\AssessmentPackage;
use App\Models\LearningGoalSequence;
use App\Models\TeachingModule;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class SipandaFlowTest extends TestCase
{
    use DatabaseTransactions;

    protected User $teacher;
    protected Tenant $tenant;

    protected function setUp(): void
    {
        parent::setUp();
        $this->teacher = User::where('email', 'guru.pai@edugen.id')->firstOrFail();
        $this->tenant = Tenant::where('slug', 'mtsn-1-jakarta-pusat')->firstOrFail();
    }

    public function test_atp_index_and_create_pages_load_successfully(): void
    {
        $resIndex = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->get(route('curriculum.atp.index'));
        $resIndex->assertStatus(200);

        $resCreate = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->get(route('curriculum.atp.create'));
        $resCreate->assertStatus(200);
    }

    public function test_teaching_module_print_and_word_download(): void
    {
        $module = TeachingModule::where('tenant_id', $this->tenant->id)->first();
        if (!$module) {
            $module = TeachingModule::create([
                'tenant_id' => $this->tenant->id,
                'user_id' => $this->teacher->id,
                'subject_id' => 1,
                'phase_id' => 1,
                'grade_id' => 1,
                'title' => 'Modul Ajar Uji Coba KBC',
                'topic_name' => 'Menyayangi Alam Semesta',
                'total_hours' => 2,
                'meeting_count' => 1,
                'learning_model' => 'Problem Based Learning',
                'target_students' => 'Kesiapan awal murid baik.',
                'learning_goal_ids' => [1],
                'learning_steps' => [
                    'awal_berkesadaran' => 'Berdoa dan hening sejenak.',
                    'awal_apersepsi' => 'Pertanyaan pemantik.',
                    'inti_memahami' => 'Literasi interaktif.',
                    'inti_mengaplikasi' => 'Diskusi kelompok.',
                    'inti_merefleksi' => 'Refleksi cinta.',
                    'penutup' => 'Doa penutup.',
                ],
                'status' => 'FINAL',
            ]);
        }

        // Test Print View
        $resPrint = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->get(route('curriculum.modules.print', $module->id));
        $resPrint->assertStatus(200);
        $resPrint->assertSee('MODUL AJAR / RENCANA PELAKSANAAN PEMBELAJARAN');

        // Test Word Download
        $resWord = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->get(route('curriculum.modules.download-word', $module->id));
        $resWord->assertStatus(200);
        $resWord->assertHeader('Content-Type', 'application/vnd.ms-word; charset=utf-8');
    }

    public function test_assessment_package_prints_soal_kisi_kunci(): void
    {
        $pkg = AssessmentPackage::where('tenant_id', $this->tenant->id)->first();
        if (!$pkg) {
            $pkg = AssessmentPackage::create([
                'tenant_id' => $this->tenant->id,
                'user_id' => $this->teacher->id,
                'subject_id' => 1,
                'phase_id' => 1,
                'grade_id' => 1,
                'title' => 'Paket Asesmen Uji Coba',
                'assessment_type' => 'SUMATIF_LINGKUP_MATERI',
                'total_questions' => 1,
                'duration_minutes' => 60,
                'status' => 'FINAL',
            ]);
        }

        // Test Print Soal
        $resSoal = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->get(route('curriculum.assessments.print-soal', $pkg->id));
        $resSoal->assertStatus(200);
        $resSoal->assertSee('Naskah Soal');

        // Test Print Kisi
        $resKisi = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->get(route('curriculum.assessments.print-kisi', $pkg->id));
        $resKisi->assertStatus(200);
        $resKisi->assertSee('KISI-KISI PENULISAN SOAL');

        // Test Print Kunci
        $resKunci = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->get(route('curriculum.assessments.print-kunci', $pkg->id));
        $resKunci->assertStatus(200);
        $resKunci->assertSee('LEMBAR KUNCI JAWABAN');
    }

    public function test_atp_print_and_word_download(): void
    {
        $seq = LearningGoalSequence::where('tenant_id', $this->tenant->id)->first();
        if (!$seq) {
            $seq = LearningGoalSequence::create([
                'tenant_id' => $this->tenant->id,
                'user_id' => $this->teacher->id,
                'subject_id' => 1,
                'phase_id' => 1,
                'grade_id' => 1,
                'title' => 'ATP Dummy Test',
                'total_hours_allocated' => 36,
                'sequence_data' => [
                    [
                        'nomor_urut' => 1,
                        'semester' => 'Ganjil',
                        'tp_code' => 'TP-01',
                        'deskripsi_tp' => 'Memahami teks deskriptif.',
                        'materi_pokok' => 'Teks Deskripsi',
                        'alokasi_jp' => 4,
                        'indikator_ketercapaian' => 'Mampu menjelaskan gagasan utama.',
                        'dimensi_profil' => 'Bernalar Kritis',
                    ],
                ],
                'status' => 'FINAL',
            ]);
        }

        // Test Print
        $resPrint = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->get(route('curriculum.atp.print', $seq->id));
        $resPrint->assertStatus(200);
        $resPrint->assertSee('ALUR TUJUAN PEMBELAJARAN');

        // Test Word Download
        $resWord = $this->actingAs($this->teacher)
            ->withSession(['current_tenant_id' => $this->tenant->id])
            ->get(route('curriculum.atp.download-word', $seq->id));
        $resWord->assertStatus(200);
        $resWord->assertHeader('Content-Type', 'application/vnd.ms-word');
    }
}
