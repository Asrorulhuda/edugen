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
     * Build dynamic lookup maps for curricula and subjects (including aliases configured in Super Admin)
     */
    protected function getDynamicLookupMaps(): array
    {
        $curricula = CurriculumFramework::where('is_active', true)->get();
        $curriculumMap = [];
        foreach ($curricula as $curr) {
            $curriculumMap[strtoupper(trim($curr->code))] = $curr;
            if (is_array($curr->aliases)) {
                foreach ($curr->aliases as $alias) {
                    $cleaned = strtoupper(trim($alias));
                    if ($cleaned !== '') {
                        $curriculumMap[$cleaned] = $curr;
                    }
                }
            }
        }

        $subjects = Subject::where('is_active', true)->get();
        $subjectMap = [];
        foreach ($subjects as $subj) {
            $subjectMap[strtoupper(trim($subj->code))] = $subj;
            if (is_array($subj->aliases)) {
                foreach ($subj->aliases as $alias) {
                    $cleaned = strtoupper(trim($alias));
                    if ($cleaned !== '') {
                        $subjectMap[$cleaned] = $subj;
                    }
                }
            }
        }

        return [$curriculumMap, $subjectMap];
    }

    /**
     * Preview and validate CSV before importing
     */
    public function preview(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'max:10240'],
        ]);

        $file = $request->file('file');
        $rawContent = file_get_contents($file->getRealPath());

        if ($rawContent === false || strlen(trim($rawContent)) === 0) {
            return response()->json(['error' => 'File kosong atau tidak dapat dibaca.'], 422);
        }

        // Clean UTF-8 BOM if present
        if (str_starts_with($rawContent, "\xEF\xBB\xBF")) {
            $rawContent = substr($rawContent, 3);
        }

        // Detect delimiter (auto-detect between comma and semicolon)
        $firstLine = strtok($rawContent, "\r\n") ?: '';
        $delimiter = (substr_count($firstLine, ';') > substr_count($firstLine, ',')) ? ';' : ',';

        $handle = fopen('php://memory', 'r+');
        fwrite($handle, $rawContent);
        rewind($handle);

        $header = fgetcsv($handle, 0, $delimiter);
        if (!$header || count($header) < 7) {
            fclose($handle);
            return response()->json(['error' => 'Format kolom CSV tidak valid. Pastikan menggunakan template resmi.'], 422);
        }

        // Clean and normalize headers (strip leading/trailing whitespace & non-printable characters)
        $header = array_map(function ($col) {
            $col = trim($col);
            return preg_replace('/^\xEF\xBB\xBF/', '', $col);
        }, $header);

        [$curriculumMap, $subjectMap] = $this->getDynamicLookupMaps();
        $regulations = Regulation::pluck('id', 'code')->toArray();
        $phases = Phase::pluck('id', 'code')->toArray();
        $levels = EducationLevel::pluck('id', 'code')->toArray();

        $rows = [];
        $errorsCount = 0;
        $warningsCount = 0;
        $rowNumber = 1;

        while (($data = fgetcsv($handle, 0, $delimiter)) !== false) {
            $rowNumber++;
            if (count(array_filter($data)) === 0) {
                continue; // Skip empty rows
            }

            $row = array_combine(array_slice($header, 0, count($data)), $data);

            $rowErrors = [];
            $rowWarnings = [];

            // Fields
            $rawCurriculum = trim($row['curriculum_code'] ?? '');
            $rawSubject = trim($row['subject_code'] ?? '');
            $phaseCode = trim($row['phase_code'] ?? '');
            $regulationCode = trim($row['regulation_code'] ?? '');
            $cpCode = trim($row['cp_code'] ?? '');
            $cpText = trim($row['cp_text'] ?? '');
            $levelCode = trim($row['level_code'] ?? '');
            $elementCode = trim($row['element_code'] ?? '');
            $sourceLocator = trim($row['source_locator'] ?? '');

            // Dynamic Curriculum Resolution via Code or Super Admin Aliases
            $curriculumObj = $curriculumMap[strtoupper($rawCurriculum)] ?? null;
            if (!$curriculumObj) {
                $rowErrors[] = "Kurikulum [{$rawCurriculum}] tidak terdaftar. Konfigurasikan di menu Super Admin.";
            }

            // Dynamic Subject Resolution via Code or Super Admin Aliases
            $subjectObj = $subjectMap[strtoupper($rawSubject)] ?? null;
            if (!$subjectObj) {
                $rowErrors[] = "Mapel [{$rawSubject}] tidak terdaftar. Konfigurasikan di menu Super Admin.";
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
                $rowWarnings[] = 'Source locator kosong (disarankan mencantumkan pasal/halaman resmi).';
            }

            if ($levelCode && !isset($levels[$levelCode])) {
                $rowWarnings[] = "Jenjang [{$levelCode}] tidak dikenali, akan dikosongkan.";
            }

            // Elemen dibebaskan: Jika belum ada di master, akan otomatis dibuatkan saat simpan tanpa ditolak/dikosongkan.

            if (count($rowErrors) > 0) {
                $errorsCount++;
            }
            if (count($rowWarnings) > 0) {
                $warningsCount++;
            }

            $rows[] = [
                'row_number' => $rowNumber,
                'data' => [
                    'curriculum_code' => $curriculumObj ? $curriculumObj->code : $rawCurriculum,
                    'level_code' => $levelCode,
                    'subject_code' => $subjectObj ? $subjectObj->code : $rawSubject,
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

        [$curriculumMap, $subjectMap] = $this->getDynamicLookupMaps();
        $regulations = Regulation::pluck('id', 'code')->toArray();
        $phases = Phase::pluck('id', 'code')->toArray();
        $levels = EducationLevel::pluck('id', 'code')->toArray();

        $userId = $request->user()->id;
        $importedCount = 0;

        foreach ($request->input('rows') as $item) {
            $data = $item['data'];

            $rawCurriculum = $data['curriculum_code'] ?? null;
            $rawSubject = $data['subject_code'] ?? null;
            $phaseCode = $data['phase_code'] ?? null;
            $regulationCode = $data['regulation_code'] ?? null;

            $curriculumObj = $curriculumMap[strtoupper($rawCurriculum)] ?? null;
            $subjectObj = $subjectMap[strtoupper($rawSubject)] ?? null;
            $phaseId = $phases[$phaseCode] ?? null;
            $regulationId = $regulations[$regulationCode] ?? null;

            if (!$curriculumObj || !$subjectObj || !$phaseId || !$regulationId) {
                continue;
            }

            // Handle Element flexibly ("dibebaskan"): auto-create per-subject if new
            $elementId = null;
            $elementCode = trim($data['element_code'] ?? '');
            if (!empty($elementCode)) {
                $element = LearningElement::where('subject_id', $subjectObj->id)
                    ->where(function ($q) use ($elementCode) {
                        $q->where('code', $elementCode)
                            ->orWhere('name', $elementCode);
                    })
                    ->first();

                if (!$element) {
                    $element = LearningElement::create([
                        'subject_id' => $subjectObj->id,
                        'code' => $elementCode,
                        'name' => ucwords(str_replace(['-', '_'], ' ', $elementCode)),
                        'description' => 'Elemen dibuat otomatis saat import CP.',
                    ]);
                }
                $elementId = $element->id;
            }

            $checksum = LearningOutcome::generateChecksum($data['cp_text']);

            $lo = LearningOutcome::create([
                'code' => $data['cp_code'],
                'curriculum_code' => $curriculumObj->code,
                'regulation_id' => $regulationId,
                'subject_id' => $subjectObj->id,
                'phase_id' => $phaseId,
                'education_level_id' => $levels[$data['level_code']] ?? null,
                'learning_element_id' => $elementId,
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
