<?php

namespace App\Services\AI\DTOs;

class AiResponse
{
    public function __construct(
        public readonly string $content,
        public readonly string $provider,
        public readonly string $model,
        public readonly int $promptTokens = 0,
        public readonly int $completionTokens = 0,
        public readonly int $totalTokens = 0,
        public readonly int $latencyMs = 0,
        public readonly array $metadata = []
    ) {}

    /**
     * Decode content as JSON array with robust multi-stage extraction
     * Handles reasoning tokens, think tags, markdown wrappers, unescaped newlines,
     * smart quotes, hidden control chars, trailing commas, and token truncation.
     */
    public function json(): array
    {
        $raw = $this->content;

        // 1. Strip reasoning blocks like <think>...</think> if present
        $raw = preg_replace('/<think[\s\S]*?<\/think>/i', '', $raw);

        $clean = trim($raw);

        // 2. Try extracting content inside markdown code fences: ```json ... ``` or ``` ... ```
        if (preg_match('/```(?:json)?\s*([\s\S]*?)(?:```|$)/i', $clean, $matches)) {
            $candidate = trim($matches[1]);
            $decoded = json_decode($candidate, true);
            if (is_array($decoded)) {
                return $decoded;
            }
            $clean = $candidate;
        }

        // 3. Direct decode attempt
        $decoded = json_decode($clean, true);
        if (is_array($decoded)) {
            return $decoded;
        }

        // 4. Extract outermost JSON array [...] or object {...}
        $firstBracket = strpos($clean, '[');
        $lastBracket = strrpos($clean, ']');
        $firstBrace = strpos($clean, '{');
        $lastBrace = strrpos($clean, '}');

        $candidate = null;
        if ($firstBracket !== false && ($firstBrace === false || $firstBracket < $firstBrace)) {
            if ($lastBracket !== false && $lastBracket > $firstBracket) {
                $candidate = substr($clean, $firstBracket, $lastBracket - $firstBracket + 1);
            } else {
                $candidate = substr($clean, $firstBracket);
            }
        } elseif ($firstBrace !== false) {
            if ($lastBrace !== false && $lastBrace > $firstBrace) {
                $candidate = substr($clean, $firstBrace, $lastBrace - $firstBrace + 1);
            } else {
                $candidate = substr($clean, $firstBrace);
            }
        }

        if ($candidate !== null) {
            $decoded = $this->parseAndRepairJson($candidate);
            if (is_array($decoded)) {
                return $decoded;
            }
        }

        // Fallback: try parseAndRepair on whole clean string
        $decoded = $this->parseAndRepairJson($clean);
        if (is_array($decoded)) {
            return $decoded;
        }

        return [];
    }

    /**
     * Multi-stage JSON repair pipeline: string cleanup, stack-based auto-closer, and backtrack recovery
     */
    protected function parseAndRepairJson(string $input): ?array
    {
        $candidate = trim($input);

        // Attempt 1: Direct decode
        $decoded = json_decode($candidate, true);
        if (is_array($decoded)) {
            return $decoded;
        }

        // Attempt 2: Clean common syntax anomalies (smart quotes, control chars, trailing commas)
        $normalized = $this->normalizeJsonText($candidate);
        $decoded = json_decode($normalized, true);
        if (is_array($decoded)) {
            return $decoded;
        }

        // Attempt 3: Stack-based closer for truncated responses (unclosed strings, braces, arrays)
        $stackClosed = $this->attemptStackClose($normalized);
        $decoded = json_decode($stackClosed, true);
        if (is_array($decoded)) {
            return $decoded;
        }

        // Attempt 4: Backtrack to the last complete JSON field or item before truncation
        $backtracked = $this->attemptBacktrackClose($normalized);
        if ($backtracked !== null) {
            $decoded = json_decode($backtracked, true);
            if (is_array($decoded)) {
                return $decoded;
            }
        }

        return null;
    }

    /**
     * Normalize escape sequences, replace curly quotes, and strip trailing commas
     */
    protected function normalizeJsonText(string $text): string
    {
        // Replace smart/curly quotes
        $text = str_replace(['“', '”', '‘', '’'], ['"', '"', "'", "'"], $text);

        // Fix literal unescaped newlines/tabs inside double-quoted strings
        $text = preg_replace_callback('/"(?:[^"\\\\]|\\\\.)*"/s', function ($m) {
            return str_replace(["\r\n", "\n", "\r", "\t"], ['\n', '\n', '\n', '\t'], $m[0]);
        }, $text);

        // Remove trailing commas before } or ]
        $text = preg_replace('/,\s*([\]\}])/', '$1', $text);

        // Strip non-printable ASCII control characters (preserving tab, newline, carriage return)
        $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $text);

        return $text;
    }

    /**
     * Complete truncated JSON by closing open quotes, dangling keys, and open brackets/braces using a syntax stack
     */
    protected function attemptStackClose(string $str): string
    {
        $len = strlen($str);
        $inString = false;
        $escaped = false;
        $stack = [];

        for ($i = 0; $i < $len; $i++) {
            $char = $str[$i];

            if ($inString) {
                if ($escaped) {
                    $escaped = false;
                } elseif ($char === '\\') {
                    $escaped = true;
                } elseif ($char === '"') {
                    $inString = false;
                }
            } else {
                if ($char === '"') {
                    $inString = true;
                } elseif ($char === '{' || $char === '[') {
                    $stack[] = $char;
                } elseif ($char === '}') {
                    if (!empty($stack) && end($stack) === '{') {
                        array_pop($stack);
                    }
                } elseif ($char === ']') {
                    if (!empty($stack) && end($stack) === '[') {
                        array_pop($stack);
                    }
                }
            }
        }

        $repaired = $str;
        if ($inString) {
            $repaired .= '"';
        }

        // Clean any trailing comma or dangling colon
        $trimmed = rtrim($repaired);
        if (str_ends_with($trimmed, ':')) {
            $repaired = $trimmed . ' null';
        } elseif (str_ends_with($trimmed, ',')) {
            $repaired = substr($trimmed, 0, -1);
        }

        while (!empty($stack)) {
            $open = array_pop($stack);
            $repaired .= ($open === '{') ? '}' : ']';
        }

        return $repaired;
    }

    /**
     * If closing at the exact end failed because of partial token cutoff, backtrack to previous valid comma/quote
     */
    protected function attemptBacktrackClose(string $str): ?string
    {
        $lastValid = max(strrpos($str, "\",\n"), strrpos($str, "\",\r\n"), strrpos($str, "\","));
        if ($lastValid !== false) {
            $cut = substr($str, 0, $lastValid + 1);
            $closed = $this->attemptStackClose($cut);
            return $this->normalizeJsonText($closed);
        }

        // Also try backtracking to last complete closing bracket or brace
        $lastBrace = max(strrpos($str, "},\n"), strrpos($str, "},"));
        if ($lastBrace !== false) {
            $cut = substr($str, 0, $lastBrace + 1);
            $closed = $this->attemptStackClose($cut);
            return $this->normalizeJsonText($closed);
        }

        return null;
    }
}
