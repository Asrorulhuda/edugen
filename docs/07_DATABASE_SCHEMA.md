# Database Schema — Conceptual

## 1. Conventions

- PK: bigint/ULID sesuai standar tim.
- `tenant_id` untuk seluruh data client-scoped; `institution_id` hanya untuk unit akademik dalam tenant instansi.
- timestamps pada semua tabel mutable.
- soft delete untuk dokumen pengguna.
- regulation/CP master tidak di-hard-delete.

## 2. Identity, Tenant & Institution

### `users`

- id
- name
- email
- password
- status
- last_active_tenant_id nullable
- email_verified_at

### `tenants`

Boundary security dan billing utama.

- id
- public_id / slug
- name
- tenant_type (`INDIVIDUAL`, `INSTITUTION`)
- primary_admin_user_id nullable
- status (`TRIAL`, `ACTIVE`, `PAST_DUE`, `SUSPENDED`, `CANCELLED`)
- timezone
- locale
- created_by_superadmin nullable
- trial_ends_at nullable

### `tenant_memberships`

- id
- tenant_id
- user_id
- role_id
- membership_status (`INVITED`, `ACTIVE`, `SUSPENDED`)
- invited_by nullable
- joined_at nullable
- is_default

Unique: `tenant_id + user_id`. Untuk tenant `INSTITUTION`, `role_id` hanya boleh mengarah ke `ADMIN` atau `TEACHER`.

### `institutions`

Profil sekolah/lembaga yang dikelola oleh Admin tenant. Tenant individu tidak wajib memiliki record ini.

- id
- tenant_id
- name
- type (`SCHOOL`, `MADRASAH`, `RA`, `MI`, `MTS`, `MA`, `MAK`, dll.)
- npsn nullable
- nsm nullable
- address
- city
- province
- postal_code nullable
- phone nullable
- email nullable
- website nullable
- logo_path nullable
- letterhead_path nullable
- principal_name nullable (metadata dokumen, bukan role aplikasi)
- principal_id_number nullable
- default_curriculum_mode
- status

### `roles`, `permissions`, `role_permissions`

RBAC. Platform memiliki role `SUPER_ADMIN`. Tenant `INDIVIDUAL` menggunakan `PERSONAL_TEACHER`. Tenant `INSTITUTION` hanya menggunakan `ADMIN` dan `TEACHER`. Tidak ada role Waka/Reviewer/Viewer pada MVP.

### `tenant_invitations`

- id
- tenant_id
- email
- role_id (`ADMIN` atau `TEACHER`; normalnya admin pertama dibuat oleh onboarding dan invitation berikutnya untuk guru)
- token_hash
- expires_at
- accepted_at nullable
- invited_by

### `teacher_profiles`

Data guru yang dikelola Admin untuk tenant institution.

- id
- tenant_id
- user_id
- institution_id
- employee_no / nip nullable
- nuptk nullable
- phone nullable
- employment_status nullable
- primary_subject_id nullable
- education_level_scope json nullable
- grade_scope json nullable
- is_active

Admin dapat CRUD profil ini; guru hanya dapat melihat profilnya sendiri dan mengubah field personal yang diizinkan.

## 3. Academic Master

### `academic_years`

- id
- tenant_id
- institution_id nullable
- label
- starts_at
- ends_at
- is_active

### `semesters`

- id
- academic_year_id
- type (`ODD`, `EVEN`)

### `education_levels`

RA/MI/MTs/MA/MAK/SD/SMP/SMA/SMK.

### `grades`

- id
- education_level_id
- grade_number/group
- phase_code

### `subjects`

- id
- code
- name
- category (`GENERAL`, `RELIGION`, `ARABIC`, `VOCATIONAL`, `LOCAL`)
- education_level_scope json

### `institution_subjects`

Mapping nama lokal/mapel aktif.

## 4. Curriculum & Regulation

### `curriculum_modes`

- code `MERDEKA`, `MADRASAH_KBC`
- name
- config_json

### `regulations`

- id
- code
- title
- authority
- year
- issued_at
- effective_at
- status
- replaces_regulation_id nullable

### `regulation_documents`

- id
- regulation_id
- file_path/object_key
- sha256
- version_label
- page_count
- extraction_status

### `regulation_chunks`

- id
- regulation_document_id
- page_start
- page_end
- heading
- content
- embedding_ref nullable
- is_verified

### `source_policies`

- id
- curriculum_mode
- subject_category
- education_level nullable
- regulation_id
- priority
- is_active

## 5. CP Master

### CP mutation rule

Semua tabel pada bagian ini adalah **global platform master** dan bukan milik tenant. Hanya `SUPER_ADMIN` boleh melakukan mutasi melalui control plane. Tenant hanya read CP `PUBLISHED`.

### `learning_outcomes`

- id
- regulation_id
- subject_id
- education_level_id nullable
- phase_code
- element_name nullable
- cp_text longtext
- source_locator
- source_page_start nullable
- source_page_end nullable
- checksum
- verification_status
- verified_by
- verified_at
- published_at

Unique recommended:

`regulation_id + subject_id + phase_code + element_name + checksum`

### `learning_outcome_versions`

Immutable revision history.

## 6. TP / ATP

### `learning_objectives`

- id
- tenant_id
- institution_id nullable
- subject_id
- phase_code
- grade_id
- learning_outcome_id
- statement
- competency
- content_scope
- status
- source (`AI`, `MANUAL`, `IMPORT`)
- created_by

### `learning_objective_sequences`

- id
- tenant_id
- institution_id nullable
- subject_id
- grade_id
- semester_id
- name
- status

### `learning_objective_sequence_items`

- sequence_id
- learning_objective_id
- position
- estimated_jp
- prerequisite_notes

## 7. KBC & DPL

### `kbc_topics`

Initialize the 5 official Panca Cinta labels as deterministic domain master data; these are not tenant/user records.

### `kbc_materials`

- id
- kbc_topic_id
- title
- description
- level_scope
- source_chunk_id

### `graduate_profile_dimensions`

Initialize the 8 DPL labels as deterministic domain master data; these are not tenant/user records.

## 8. Documents

### `documents`

- id
- tenant_id
- institution_id nullable
- owner_id
- document_type
- curriculum_mode
- academic_year_id
- semester_id
- grade_id
- subject_id
- phase_code
- title
- status
- current_revision_id

### `document_revisions`

- id
- document_id
- revision_no
- content_json
- rendered_html
- created_by
- change_summary
- source_snapshot_json
- validator_result_json

## 9. RPP Specific

Bisa disimpan di `content_json`, tetapi indexing metadata opsional:

### `lesson_plans`

- document_id
- cp_id
- topic
- total_jp
- total_minutes
- readiness_summary
- teaching_model

### `lesson_plan_kbc_topics`

- lesson_plan_id
- kbc_topic_id
- rationale

### `lesson_plan_dpl`

- lesson_plan_id
- dimension_id

## 10. Assessment & Rubric

### `assessment_plans`

- document_id
- learning_objective_id
- assessment_stage
- technique
- evidence
- criteria

### `rubrics`

- id
- institution_id
- name
- scale_count
- rubric_json

## 11. Question Bank

### `question_blueprints`

- id
- institution_id
- subject_id
- grade_id
- phase_code
- assessment_type
- config_json

### `questions`

- id
- institution_id
- subject_id
- phase_code
- learning_outcome_id
- learning_objective_id nullable
- question_type
- stem
- stimulus
- answer_json
- explanation
- difficulty
- cognitive_level
- status
- source
- created_by

### `question_options`

Optional normalized table, or embedded JSON.

### `question_tags`

- KBC, topic, material, semester, etc.

### `question_packages`

Package metadata.

### `question_package_items`

- package_id
- question_id
- position
- score

## 12. AI

### `ai_providers`

- name
- adapter
- encrypted_credentials
- is_active
- priority

### `ai_models`

- provider_id
- model_key
- task_profile
- input_cost/output_cost nullable

### `prompt_templates`

- code
- version
- system_template
- user_template
- output_schema_json
- status

### `generation_jobs`

- id
- institution_id
- user_id
- task_type
- target_type
- target_id nullable
- provider/model
- prompt_template_version
- input_hash
- status
- started_at/completed_at
- validation_result_json

### `ai_usage_logs`

- tokens_in
- tokens_out
- cost_estimate
- latency_ms
- success

## 13. Audit

### `audit_logs`

- institution_id nullable
- actor_id
- event
- auditable_type
- auditable_id
- old_values json
- new_values json
- ip
- user_agent

## 14. Export

### `exports`

- document_id/package_id
- format
- object_path
- template_version
- status
- created_by

## 15. Indexes

High priority:

- `learning_outcomes(subject_id, phase_code, verification_status)`
- `documents(institution_id, owner_id, status, updated_at)`
- `questions(institution_id, subject_id, phase_code, status)`
- `generation_jobs(institution_id, status, created_at)`
- `audit_logs(institution_id, created_at)`

## 9. SaaS Plans, Billing & Entitlements

### `plans`

- id
- code
- name
- client_model (`INDIVIDUAL`, `INSTITUTION`, `BOTH`)
- billing_interval (`MONTHLY`, `YEARLY`, `CUSTOM`)
- base_price
- currency
- is_public
- is_active

### `plan_entitlements`

- id
- plan_id
- feature_key
- value_type (`BOOLEAN`, `INTEGER`, `DECIMAL`, `STRING`)
- value
- reset_period nullable (`MONTH`, `BILLING_CYCLE`, null)

Examples: `member_seats`, `ai_generations`, `question_items`, `exports`, `storage_mb`, `teacher_management`, `custom_template`, `custom_regulation_upload`.

### `subscriptions`

- id
- tenant_id
- plan_id
- status (`TRIALING`, `ACTIVE`, `PAST_DUE`, `GRACE`, `SUSPENDED`, `CANCELLED`, `EXPIRED`)
- starts_at
- current_period_start
- current_period_end
- cancel_at_period_end
- provider
- provider_customer_id nullable
- provider_subscription_id nullable
- metadata_json

Satu tenant hanya memiliki satu subscription aktif pada MVP.

### `usage_meters`

- id
- tenant_id
- feature_key
- period_start
- period_end
- used_quantity
- reserved_quantity

Unique: `tenant_id + feature_key + period_start + period_end`.

### `billing_invoices`

- id
- tenant_id
- subscription_id
- invoice_no
- amount
- status
- due_at
- paid_at nullable
- provider_reference nullable

### `billing_transactions`

- id
- tenant_id
- invoice_id
- provider
- transaction_reference
- amount
- status
- paid_at nullable
- payload_json

## 10. Platform Operations

### `feature_flags`

- key
- enabled_globally
- rules_json

### `tenant_feature_overrides`

- tenant_id
- feature_key
- enabled/value
- expires_at nullable

### `support_sessions`

- id
- superadmin_user_id
- tenant_id
- impersonated_user_id nullable
- reason
- starts_at
- expires_at
- ended_at nullable

### `audit_logs`

- actor_user_id
- actor_scope (`PLATFORM`, `TENANT`)
- tenant_id nullable
- action
- target_type
- target_id
- ip_hash / request_id
- metadata_json
- created_at

## 11. Mandatory Tenant Keys

Selain master global, seluruh tabel berikut wajib memiliki `tenant_id`: documents, document_revisions (langsung atau derived immutable via parent), questions, question_packages, TP/ATP tenant, templates custom, exports, AI jobs, AI usage, storage objects, usage meters, invitations, notifications, teacher profiles, dan audit client.


### `cp_import_jobs`

- id
- source_file_name
- regulation_version_id
- status (`UPLOADED`,`MAPPED`,`VALIDATED`,`PUBLISHED`,`FAILED`)
- row_count
- valid_count
- invalid_count
- created_by_super_admin
- created_at/updated_at

### `cp_audit_logs`

- id
- cp_version_id
- actor_super_admin_id
- action (`CREATE`,`IMPORT`,`EDIT_DRAFT`,`PUBLISH`,`ARCHIVE`,`NEW_VERSION`)
- before_json
- after_json
- reason
- created_at
