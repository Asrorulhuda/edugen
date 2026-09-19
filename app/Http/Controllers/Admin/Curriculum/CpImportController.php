<?php

namespace App\Http\Controllers\Admin\Curriculum;

use App\Http\Controllers\Controller;
use App\Models\CpAuditLog;
use App\Models\CurriculumFramework;
use App\Models\EducationLevel;
use App\Models\LearningElement;
use App\Models\LearningOutcome;
use App\Models\LearningOutcomeVersion;
use App\Models\Phase;
use App\Models\Regulation;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class CpImportController extends Controller
{
    /**
     * Show import form
     */
    public function index(): InertiaResponse
    {
        return Inertia::render('Admin/Curriculum/LearningOutcomes/Import');
    }

    /**
     * Download standard CSV template
     */
    public function template(): Response
    {
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="template_import_cp_edugen.csv"',
        ];

        $columns = [
            'curriculum_code',
            'level_code',
            'subject_code',
            'phase_code',
            'element_code',
            'cp_code',
            'cp_text',
            'regulation_code',
            'source_locator',
            'notes',
        ];

        $sampleRow = [
            'MERDEKA',
            'SD',
            'BIN',
            'FASE_A',
            'BIN-SIMAK',
            'CP-BIN-FA-01',
            'Peserta didik mampu bersikap menjadi pendengar yang penuh perhatian...',
            'BSKAP_046_2025',
            'BSKAP 046/2025 Hal. 48',
            'Contoh input resmi',
        ];

        $output = fopen('php://temp', 'r+');
        fputcsv($output, $columns);
        fputcsv($output, $sampleRow);
        rewind($output);
        $csvContent = stream_get_contents($output);
        fclose($output);

        return response($csvContent, 200, $headers);
    }

    /**
     * Preview and validate CSV before importing
     */
    public function preview(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:5120'],
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');
        if (!$handle) {
            return response()->json(['error' => 'Gagal membaca file CSV.'], 422);
        }

        $header = fgetcsv($handle);
        if (!$header || count($header) < 7) {
            fclose($handle);
            return response()->json(['error' => 'Format kolom CSV tidak valid. Gunakan template resmi.'], 422);
        }

        // Clean headers
        $header = array_map('trim', $header);

        $curricula = CurriculumFramework::pluck('id', 'code')->toArray();
        $regulations = Regulation::pluck('id', 'code')->toArray();
        $subjects = Subject::pluck('id', 'code')->toArray();
        $phases = Phase::pluck('id', 'code')->toArray();
        $levels = EducationLevel::pluck('id', 'code')->toArray();
        $elements = LearningElement::pluck('id', 'code')->toArray();

        $rows = [];
        $errorsCount = 0;
        $warningsCount = 0;
        $rowNumber = 1;

        while (($data = fgetcsv($handle)) !== false) {
            $rowNumber++;
            if (count(array_filter($data)) === 0) {
                continue; // Skip empty rows
            }

            $row = array_combine(array_slice($header, 0, count($data)), $data);

            $rowErrors = [];
            $rowWarnings = [];

            // Validation
            $curriculumCode = trim($row['curriculum_code'] ?? '');
            $subjectCode = trim($row['subject_code'] ?? '');
            $phaseCode = trim($row['phase_code'] ?? '');
            $regulationCode = trim($row['regulation_code'] ?? '');
            $cpCode = trim($row['cp_code'] ?? '');
            $cpText = trim($row['cp_text'] ?? '');
            $levelCode = trim($row['level_code'] ?? '');
            $elementCode = trim($row['element_code'] ?? '');
            $sourceLocator = trim($row['source_locator'] ?? '');

            if (!isset($curricula[$curriculumCode])) {
                $rowErrors[] = "Kurikulum [{$curriculumCode}] tidak terdaftar.";
            }

            if (!isset($subjects[$subjectCode])) {
                $rowErrors[] = "Mapel [{$subjectCode}] tidak terdaftar.";
            }

            if (!isset($phases[$phaseCode])) {
                $rowErrors[] = "Fase [{$phaseCode}] tidak terdaftar.";
            }

            if (!isset($regulations[$regulationCode])) {
                $rowErrors[] = "Regulasi [{$regulationCode}] tidak terdaftar atau belum diverifikasi.";
            }

            if (empty($cpCode)) {
                $rowErrors[] = 'Kode CP wajib diisi.';
            }

            if (empty($cpText) || mb_strlen($cpText) < 10) {
                $rowErrors[] = 'Teks CP kosong atau terlalu pendek (min 10 karakter).';
            }

            // Warnings
            if (empty($sourceLocator)) {
                $rowWarnings[] = 'Source locator kosong (sangat disarankan mencantumkan pasal/halaman resmi).';
            }

            if ($levelCode && !isset($levels[$levelCode])) {
                $rowWarnings[] = "Jenjang [{$levelCode}] tidak dikenali, akan dikosongkan.";
            }

            if ($elementCode && !isset($elements[$elementCode])) {
                $rowWarnings[] = "Elemen [{$elementCode}] tidak terdaftar, akan dikosongkan.";
            }

            if (count($rowErrors) > 0) {
                $errorsCount++;
            }
            if (count($rowWarnings) > 0) {
                $warningsCount++;
            }

            $rows[] = [
                'row_number' => $rowNumber,
                'data' => [
                    'curriculum_code' => $curriculumCode,
                    'level_code' => $levelCode,
                    'subject_code' => $subjectCode,
                    'phase_code' => $phaseCode,
                    'element_code' => $elementCode,
                    'cp_code' => $cpCode,
                    'cp_text' => $cpText,
                    'regulation_code' => $regulationCode,
                    'source_locator' => $sourceLocator,
                    'notes' => trim($row['notes'] ?? ''),
                ],
                'errors' => $rowErrors,
                'warnings' => $rowWarnings,
                'is_valid' => count($rowErrors) === 0,
            ];
        }

        fclose($handle);

        return response()->json([
            'total_rows' => count($rows),
            'valid_rows' => count($rows) - $errorsCount,
            'errors_count' => $errorsCount,
            'warnings_count' => $warningsCount,
            'preview_rows' => array_slice($rows, 0, 50),
            'all_rows' => $rows,
        ]);
    }

    /**
     * Commit validated rows into database as DRAFT
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'rows' => ['required', 'array', 'min:1'],
            'rows.*.data' => ['required', 'array'],
        ]);

        $curricula = CurriculumFramework::pluck('id', 'code')->toArray();
        $regulations = Regulation::pluck('id', 'code')->toArray();
        $subjects = Subject::pluck('id', 'code')->toArray();
        $phases = Phase::pluck('id', 'code')->toArray();
        $levels = EducationLevel::pluck('id', 'code')->toArray();
        $elements = LearningElement::pluck('id', 'code')->toArray();

        $userId = $request->user()->id;
        $importedCount = 0;

        foreach ($request->input('rows') as $item) {
            $data = $item['data'];

            $curriculumCode = $data['curriculum_code'] ?? null;
            $subjectCode = $data['subject_code'] ?? null;
            $phaseCode = $data['phase_code'] ?? null;
            $regulationCode = $data['regulation_code'] ?? null;

            if (!isset($curricula[$curriculumCode], $subjects[$subjectCode], $phases[$phaseCode], $regulations[$regulationCode])) {
                continue;
            }

            $checksum = LearningOutcome::generateChecksum($data['cp_text']);

            $lo = LearningOutcome::create([
                'code' => $data['cp_code'],
                'curriculum_code' => $curriculumCode,
                'regulation_id' => $regulations[$regulationCode],
                'subject_id' => $subjects[$subjectCode],
                'phase_id' => $phases[$phaseCode],
                'education_level_id' => $levels[$data['level_code']] ?? null,
                'learning_element_id' => $elements[$data['element_code']] ?? null,
                'cp_text' => $data['cp_text'],
                'source_locator' => $data['source_locator'] ?: null,
                'checksum' => $checksum,
                'version' => 1,
                'status' => LearningOutcome::STATUS_DRAFT, // Always starts as DRAFT per spec
                'notes' => $data['notes'] ?: 'Imported via CSV.',
                'updated_by' => $userId,
            ]);

            LearningOutcomeVersion::create([
                'learning_outcome_id' => $lo->id,
                'version' => 1,
                'cp_text' => $lo->cp_text,
                'change_summary' => 'Initial import from CSV.',
                'changed_by' => $userId,
                'created_at' => now(),
            ]);

            CpAuditLog::create([
                'learning_outcome_id' => $lo->id,
                'actor_id' => $userId,
                'action' => 'IMPORT',
                'reason' => 'Import batch dari CSV ke DRAFT.',
                'after_payload' => $lo->toArray(),
                'created_at' => now(),
            ]);

            $importedCount++;
        }

        return response()->json([
            'message' => "Berhasil mengimpor {$importedCount} data CP sebagai DRAFT untuk ditinjau.",
            'imported_count' => $importedCount,
        ]);
    }
}
