<?php

namespace App\Services\Curriculum;

use App\Models\AssessmentMatrix;
use App\Models\AssessmentPackage;
use App\Models\AssessmentQuestion;
use App\Models\Institution;
use App\Services\TenantContext;
use Illuminate\Support\Facades\DB;

class AssessmentService
{
    /**
     * Store new assessment package, matrices, and questions
     */
    public function savePackage(array $validated, int $tenantId, int $userId): AssessmentPackage
    {
        return DB::transaction(function () use ($validated, $tenantId, $userId) {
            $pkg = AssessmentPackage::create([
                'tenant_id' => $tenantId,
                'user_id' => $userId,
                'subject_id' => $validated['subject_id'],
                'phase_id' => $validated['phase_id'],
                'grade_id' => $validated['grade_id'],
                'academic_year_id' => $validated['academic_year_id'] ?? null,
                'semester_id' => $validated['semester_id'] ?? null,
                'curriculum_code' => $validated['curriculum_code'],
                'title' => $validated['title'],
                'assessment_type' => $validated['assessment_type'],
                'total_questions' => $validated['total_questions'],
                'duration_minutes' => $validated['duration_minutes'],
                'instructions' => $validated['instructions'] ?? null,
                'settings' => $validated['settings'] ?? null,
                'status' => $validated['status'],
            ]);

            foreach ($validated['items'] as $item) {
                $matrix = AssessmentMatrix::create([
                    'assessment_package_id' => $pkg->id,
                    'learning_goal_id' => $item['learning_goal_id'] ?? null,
                    'question_number' => $item['question_number'],
                    'indicator_text' => $item['indicator_text'],
                    'bloom_level' => $item['bloom_level'],
                    'cognitive_tier' => $item['cognitive_tier'],
                    'difficulty_level' => $item['difficulty_level'],
                    'question_type' => $item['question_type'],
                    'score_weight' => $item['score_weight'] ?? 1,
                ]);

                AssessmentQuestion::create([
                    'assessment_package_id' => $pkg->id,
                    'assessment_matrix_id' => $matrix->id,
                    'question_number' => $item['question_number'],
                    'question_type' => $item['question_type'],
                    'stimulus_text' => $item['stimulus_text'] ?? null,
                    'image_prompt' => $item['image_prompt'] ?? null,
                    'image_path' => $item['image_path'] ?? null,
                    'question_text' => $item['question_text'],
                    'options_data' => $item['options_data'] ?? null,
                    'correct_answer' => $item['correct_answer'] ?? null,
                    'explanation' => $item['explanation'] ?? null,
                    'score_weight' => $item['score_weight'] ?? 1,
                ]);
            }

            return $pkg;
        });
    }

    /**
     * Update existing assessment package, matrices, and questions
     */
    public function updatePackage(AssessmentPackage $assessmentPackage, array $validated): AssessmentPackage
    {
        return DB::transaction(function () use ($assessmentPackage, $validated) {
            $assessmentPackage->update([
                'subject_id' => $validated['subject_id'],
                'phase_id' => $validated['phase_id'],
                'grade_id' => $validated['grade_id'],
                'academic_year_id' => $validated['academic_year_id'] ?? null,
                'semester_id' => $validated['semester_id'] ?? null,
                'curriculum_code' => $validated['curriculum_code'],
                'title' => $validated['title'],
                'assessment_type' => $validated['assessment_type'],
                'total_questions' => $validated['total_questions'],
                'duration_minutes' => $validated['duration_minutes'],
                'instructions' => $validated['instructions'] ?? null,
                'status' => $validated['status'],
            ]);

            $assessmentPackage->questions()->delete();
            $assessmentPackage->matrices()->delete();

            foreach ($validated['items'] as $item) {
                $matrix = AssessmentMatrix::create([
                    'assessment_package_id' => $assessmentPackage->id,
                    'learning_goal_id' => $item['learning_goal_id'] ?? null,
                    'question_number' => $item['question_number'],
                    'indicator_text' => $item['indicator_text'],
                    'bloom_level' => $item['bloom_level'],
                    'cognitive_tier' => $item['cognitive_tier'],
                    'difficulty_level' => $item['difficulty_level'],
                    'question_type' => $item['question_type'],
                    'score_weight' => $item['score_weight'] ?? 1,
                ]);

                AssessmentQuestion::create([
                    'assessment_package_id' => $assessmentPackage->id,
                    'assessment_matrix_id' => $matrix->id,
                    'question_number' => $item['question_number'],
                    'question_type' => $item['question_type'],
                    'stimulus_text' => $item['stimulus_text'] ?? null,
                    'image_prompt' => $item['image_prompt'] ?? null,
                    'image_path' => $item['image_path'] ?? null,
                    'question_text' => $item['question_text'],
                    'options_data' => $item['options_data'] ?? null,
                    'correct_answer' => $item['correct_answer'] ?? null,
                    'explanation' => $item['explanation'] ?? null,
                    'score_weight' => $item['score_weight'] ?? 1,
                ]);
            }

            return $assessmentPackage;
        });
    }

    /**
     * Resolve official institution profile with intelligent fallbacks
     */
    public function resolveInstitution(?AssessmentPackage $package, TenantContext $tenantContext): ?Institution
    {
        $inst = $tenantContext->institution();
        if (!$inst && $tenantContext->tenant()?->institution) {
            $inst = $tenantContext->tenant()->institution;
        }

        if (!$inst && $package?->tenant_id) {
            $inst = Institution::where('tenant_id', $package->tenant_id)->first();
        }

        if (!$inst && auth()->check()) {
            $profile = auth()->user()->teacherProfiles()->with('institution')->first();
            if ($profile && $profile->institution) {
                $inst = $profile->institution;
            }
        }

        if (!$inst && $tenantContext->id()) {
            $inst = Institution::where('tenant_id', $tenantContext->id())->first();
        }

        $isMerdeka = $package && $package->curriculum_code === 'MERDEKA';

        if (!$inst) {
            $tenant = $tenantContext->tenant();
            $schoolName = $tenant && !in_array($tenant->name, ['Personal', 'Individu']) ? $tenant->name : 'SDN SIMANALAGI 2';

            $fallback = new Institution();
            $fallback->name = $schoolName;
            $fallback->type = $isMerdeka ? 'SD' : 'MADRASAH';
            $fallback->letterhead_line_1 = $isMerdeka ? 'PEMERINTAH KOTA / DINAS PENDIDIKAN' : 'KEMENTERIAN AGAMA REPUBLIK INDONESIA';
            $fallback->letterhead_line_2 = $schoolName;
            $fallback->letterhead_subtext = 'Jl. Pendidikan No. 1. Telp / Email resmi satuan pendidikan';
            $fallback->signature_title = $isMerdeka ? 'Kepala Sekolah' : 'Kepala Madrasah';
            $fallback->signature_city = 'Kota';
            return $fallback;
        }

        $inst = clone $inst;

        if (!$inst->isMadrasah() && (empty($inst->letterhead_line_1) || str_contains(strtoupper($inst->letterhead_line_1), 'KEMENTERIAN AGAMA'))) {
            $cityName = strtoupper($inst->city ?: 'KOTA');
            $inst->letterhead_line_1 = "PEMERINTAH {$cityName} / DINAS PENDIDIKAN";
        }

        if (empty($inst->letterhead_subtext) || str_contains($inst->letterhead_subtext, 'Jl. Raya Pendidikan No. 123')) {
            $inst->letterhead_subtext = $inst->effective_subtext;
        }

        if (!empty($inst->city) && (empty($inst->signature_city) || $inst->signature_city === 'Jakarta')) {
            $inst->signature_city = $inst->city;
        }

        return $inst;
    }
}
