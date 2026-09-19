# AI Generation Architecture & Guardrails

## 1. Prinsip

AI adalah **drafting engine**, bukan authority. Sumber regulasi dan CP berasal dari curated database.

## 2. Pipeline

```text
User Input
   ↓
Context Resolver
   ↓
Curriculum & Source Router
   ↓
Verified CP Loader
   ↓
Template/Schema Selector
   ↓
Prompt Builder
   ↓
AI Provider Router
   ↓
JSON Schema Validation
   ↓
Domain Validation
   ↓
Alignment Validation
   ↓
Document Renderer
   ↓
Human Review
```

## 3. RAG Scope

Gunakan retrieval hanya dari:

- regulation master published;
- KBC guide chunks verified;
- P&A guide chunks verified;
- institution templates;
- teacher-uploaded material explicitly selected.

Tidak perlu memasukkan semua PDF ke prompt. Index per section dan simpan source locator.

## 4. Immutable Fields

Field berikut **tidak boleh ditulis ulang AI**:

- official CP text;
- regulation code/name;
- source locator;
- phase mapping;
- institution identity master;
- approved template labels bila dikunci admin.

## 5. Prompt Layers

### System policy

- role sebagai educational drafting assistant;
- dilarang mengarang CP/regulasi;
- output JSON only;
- language locale;
- safety.

### Domain context

- curriculum mode;
- subject;
- phase/class;
- verified CP;
- KBC/DPL options;
- assessment principles.

### Teacher context

- topic;
- time;
- student readiness;
- facilities;
- preferences.

### Output schema

Strict JSON schema.

## 6. Example System Prompt Skeleton

```text
You generate a draft educational planning document.
The official CP below is immutable. Never paraphrase it as an official CP.
Use only the supplied regulation metadata.
If required information is missing, return validation_errors rather than inventing it.
For KBC mode, integrate only relevant Panca Cinta values into concrete learning activities and/or assessments.
Return valid JSON matching the schema.
```

## 7. Two-Pass Generation

### Pass 1 — Outline & alignment

Generate:

- TP;
- mapping CP→TP;
- learning flow;
- assessment evidence;
- KBC/DPL mapping.

### Pass 2 — Expand sections

Only after Pass 1 passes validator.

Benefit: lower hallucination and easier correction.

## 8. Validators

### SourceValidator

- cp_id exists;
- status published;
- subject/phase match;
- checksum matches snapshot.

### AlignmentValidator

- TP derives from CP;
- activity supports TP;
- assessment measures TP;
- KBC selected appears in meaningful action/evidence.

### DurationValidator

Total activity minutes must be within configured tolerance of JP total.

### QuestionValidator

- key valid;
- explanation consistent;
- choices unique;
- cognitive target plausible;
- no answer leakage.

### OutputSchemaValidator

Reject invalid JSON and retry with repair prompt once.

## 9. Confidence & Warnings

Store validator findings:

```json
{
  "severity": "warning",
  "code": "KBC_NOT_ASSESSED",
  "section": "assessment",
  "message": "Cinta Lingkungan dipilih tetapi belum terlihat pada aktivitas atau evidence asesmen."
}
```

## 10. Provider Router

Interface:

```php
interface AiProvider {
    public function generate(GenerationRequest $request): GenerationResponse;
}
```

Adapters:

- Gemini
- OpenAI
- Groq
- OpenRouter
- DeepSeek

Features:

- failover;
- token budget;
- model per task;
- retry policy;
- usage logging;
- tenant quota.

## 11. Cost Control

- use smaller model for classification/validation;
- cache CP context;
- section-based generation;
- prompt versioning;
- cap output tokens per generator;
- provider-specific daily/monthly quota.

## 12. Privacy

Do not send to AI provider unless needed:

- NISN;
- full student name;
- phone/address;
- sensitive student records.

Use generic learner profiles, e.g. `3 murid perlu dukungan literasi`, not identifiable data.

## 13. AI Evaluation Dataset

Build golden tests from 20–50 scenarios:

- MI Bahasa Indonesia Fase A;
- MI Matematika Fase B/C;
- MTs Bahasa Inggris Fase D;
- MTs Informatika Fase D;
- PAI/Bahasa Arab after verified source available;
- multiple KBC values;
- multiple assessment types.

Metrics:

- CP exact-match 100%;
- source routing 100%;
- valid JSON > 99%;
- alignment reviewer score;
- factual consistency;
- KBC relevance score.
