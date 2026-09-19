<?php

namespace App\Services\Curriculum;

use RuntimeException;

class GeneratedDocumentValidator
{
    private const MODULE_REQUIRED_FIELDS = [
        'kesiapan',
        'dimensi_dpl',
        'tujuan',
        'praktik_pedagogis',
        'kegiatan_awal_apersepsi',
        'inti_memahami',
        'inti_mengaplikasi',
        'inti_merefleksi',
        'kegiatan_penutup',
        'asesmen_awal',
        'asesmen_proses',
        'asesmen_akhir',
    ];

    private const QUESTION_TYPES = ['PG', 'PG_KOMPLEKS', 'MENJODOHKAN', 'ISIAN', 'URAIAN'];
    private const BLOOM_LEVELS = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'];
    private const COGNITIVE_TIERS = ['L1', 'L2', 'L3'];
    private const DIFFICULTY_LEVELS = ['MUDAH', 'SEDANG', 'SULIT'];

    public function module(array $data, string $curriculumCode): array
    {
        foreach (self::MODULE_REQUIRED_FIELDS as $field) {
            if (!isset($data[$field]) || !is_string($data[$field]) || trim($data[$field]) === '') {
                throw new RuntimeException("Output AI untuk modul tidak lengkap pada bagian {$field}. Silakan generate ulang.");
            }

            $data[$field] = trim($data[$field]);
        }

        $optionalText = [
            'topik_panca_cinta', 'materi_integrasi_kbc', 'kemitraan_pembelajaran',
            'lingkungan_pembelajaran', 'pemanfaatan_digital', 'kegiatan_awal_berkesadaran',
            'remedial_pengayaan', 'lkpd', 'bahan_bacaan', 'daftar_pustaka',
            'waktu_pendahuluan', 'waktu_inti', 'waktu_penutup', 'capaian_pembelajaran',
            'pertanyaan_pemantik', 'mindful', 'meaningful', 'joyful',
            'asesmen_awal_fokus', 'asesmen_proses_fokus', 'asesmen_akhir_fokus',
            'target_students', 'facilities', 'prerequisite_knowledge',
        ];

        foreach ($optionalText as $field) {
            $data[$field] = is_scalar($data[$field] ?? null) ? trim((string) $data[$field]) : '';
        }

        if ($curriculumCode === 'MERDEKA') {
            $data['topik_panca_cinta'] = '';
        }

        $data['glosarium'] = array_values(array_filter(
            is_array($data['glosarium'] ?? null) ? $data['glosarium'] : [],
            fn ($item) => is_string($item) && trim($item) !== ''
        ));
        $data['curriculum_code'] = $curriculumCode;

        return $data;
    }

    public function assessment(array $data, int $expectedCount, array $allowedGoalIds): array
    {
        if (!isset($data['items']) || !is_array($data['items']) || empty($data['items'])) {
            throw new RuntimeException('AI tidak menghasilkan butir soal yang valid. Silakan coba generate kembali.');
        }

        // Tolerant item count: if AI generated more than requested, slice cleanly; if slightly less, accept what was generated
        $rawItems = array_values($data['items']);
        if (count($rawItems) > $expectedCount) {
            $rawItems = array_slice($rawItems, 0, $expectedCount);
        }

        $seenNumbers = [];
        $items = [];

        foreach ($rawItems as $index => $item) {
            if (!is_array($item)) {
                continue;
            }

            $number = (int) ($item['question_number'] ?? ($index + 1));
            if ($number < 1 || isset($seenNumbers[$number])) {
                $number = $index + 1;
            }
            $seenNumbers[$number] = true;

            $type = strtoupper((string) ($item['question_type'] ?? 'PG'));
            $bloom = strtoupper((string) ($item['bloom_level'] ?? 'C2'));
            $tier = strtoupper((string) ($item['cognitive_tier'] ?? 'L1'));
            $difficulty = strtoupper((string) ($item['difficulty_level'] ?? 'SEDANG'));

            if (!in_array($type, self::QUESTION_TYPES, true)) {
                $type = 'PG';
            }
            if (!in_array($bloom, self::BLOOM_LEVELS, true)) {
                $bloom = 'C2';
            }
            if (!in_array($tier, self::COGNITIVE_TIERS, true)) {
                $tier = 'L1';
            }
            if (!in_array($difficulty, self::DIFFICULTY_LEVELS, true)) {
                $difficulty = 'SEDANG';
            }

            $questionText = trim((string) ($item['question_text'] ?? ''));
            if ($questionText === '') {
                $questionText = "Pertanyaan butir nomor {$number}";
            }

            $indicatorText = trim((string) ($item['indicator_text'] ?? ''));
            if ($indicatorText === '') {
                $indicatorText = "Peserta didik dapat menganalisis materi terkait pada soal nomor {$number}";
            }

            // Normalize options_data if it is a sequential list [0 => '...', 1 => '...']
            $options = is_array($item['options_data'] ?? null) ? $item['options_data'] : null;
            if ($options !== null) {
                if (array_is_list($options)) {
                    $letters = ['A', 'B', 'C', 'D', 'E'];
                    $normalizedOptions = [];
                    foreach ($options as $idx => $val) {
                        $letter = $letters[$idx] ?? chr(65 + $idx);
                        $normalizedOptions[$letter] = trim((string) $val);
                    }
                    $options = $normalizedOptions;
                } else {
                    $normalizedOptions = [];
                    foreach ($options as $k => $val) {
                        $normalizedOptions[strtoupper(trim((string) $k))] = trim((string) $val);
                    }
                    $options = $normalizedOptions;
                }
            }

            // Normalize correct answer
            $rawAnswer = trim((string) ($item['correct_answer'] ?? ''));
            if ($type === 'PG' && is_array($options) && count($options) > 0) {
                // Extract letter like "A" from "A. Pilihan" or "Opsi A"
                if (preg_match('/^([A-E])(?:\.|\:|\s|$)/i', $rawAnswer, $matches)) {
                    $answer = strtoupper($matches[1]);
                } elseif (preg_match('/\b([A-E])\b/i', $rawAnswer, $matches)) {
                    $answer = strtoupper($matches[1]);
                } else {
                    $answer = strtoupper($rawAnswer);
                }

                if (!array_key_exists($answer, $options)) {
                    // Check if rawAnswer matches option text
                    foreach ($options as $optKey => $optVal) {
                        if (mb_strtolower(trim($optVal)) === mb_strtolower($rawAnswer)) {
                            $answer = $optKey;
                            break;
                        }
                    }
                }

                if (!array_key_exists($answer, $options)) {
                    $answer = (string) array_key_first($options);
                }
            } else {
                $answer = $rawAnswer !== '' ? $rawAnswer : 'Kunci jawaban terlampir pada rubrik penskoran.';
            }

            $goalId = (int) ($item['learning_goal_id'] ?? 0);
            if (!empty($allowedGoalIds) && !in_array($goalId, $allowedGoalIds, true)) {
                $goalId = $allowedGoalIds[$index % count($allowedGoalIds)];
            }

            $items[] = array_merge($item, [
                'question_number' => $number,
                'learning_goal_id' => $goalId > 0 ? $goalId : null,
                'question_type' => $type,
                'bloom_level' => $bloom,
                'cognitive_tier' => $tier,
                'difficulty_level' => $difficulty,
                'score_weight' => max(1, (int) ($item['score_weight'] ?? 1)),
                'indicator_text' => $indicatorText,
                'stimulus_text' => trim((string) ($item['stimulus_text'] ?? '')) ?: null,
                'image_prompt' => trim((string) ($item['image_prompt'] ?? '')) ?: null,
                'image_path' => trim((string) ($item['image_path'] ?? '')) ?: null,
                'question_text' => $questionText,
                'options_data' => $options,
                'correct_answer' => $answer,
                'explanation' => trim((string) ($item['explanation'] ?? '')) ?: null,
            ]);
        }

        usort($items, fn (array $a, array $b) => $a['question_number'] <=> $b['question_number']);

        return [
            'title' => trim((string) ($data['title'] ?? 'Paket Asesmen')),
            'instructions' => trim((string) ($data['instructions'] ?? 'Kerjakan setiap soal dengan teliti.')),
            'duration_minutes' => min(360, max(10, (int) ($data['duration_minutes'] ?? 60))),
            'items' => $items,
        ];
    }
}
