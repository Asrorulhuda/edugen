export interface QuestionItem {
    id: number;
    question_number: number;
    question_type: string;
    stimulus_text?: string | null;
    image_prompt?: string | null;
    image_path?: string | null;
    question_text: string;
    options_data?: Record<string, string> | null;
    correct_answer?: string | null;
    explanation?: string | null;
    score_weight: number;
}

export interface MatrixItem {
    id: number;
    question_number: number;
    indicator_text: string;
    bloom_level: string;
    cognitive_tier: string;
    difficulty_level: string;
    question_type: string;
    score_weight: number;
    learningGoal?: {
        code: string;
        pedagogical_description: string;
    };
}

export interface AssessmentPackageDetail {
    id: number;
    title: string;
    assessment_type: string;
    curriculum_code: 'MERDEKA' | 'MADRASAH_KBC';
    total_questions: number;
    duration_minutes: number;
    instructions?: string | null;
    status: 'DRAFT' | 'FINAL';
    created_at: string;
    subject: {
        code: string;
        name: string;
    };
    phase: {
        code: string;
        name: string;
    };
    grade: {
        grade_number: number;
        name: string;
    };
    academicYear?: {
        year_name: string;
    } | null;
    semester?: {
        name: string;
    } | null;
    user: {
        name: string;
        teacherProfiles?: Array<{
            nip?: string;
        }>;
    };
    matrices: MatrixItem[];
    questions: QuestionItem[];
}

export interface Institution {
    id: number;
    name: string;
    npsn?: string;
    nsm?: string;
    type?: string;
    level?: string;
    address?: string;
    city?: string;
    province?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo_path?: string;
    header_style?: string;
    letterhead_path?: string;
    effective_logo_url?: string;
    effective_line_1?: string;
    effective_subtext?: string;
    letterhead_line_1?: string;
    letterhead_line_2?: string;
    letterhead_line_3?: string;
    letterhead_subtext?: string;
    signature_city?: string;
    signature_title?: string;
    principal_name?: string;
    principal_id_number?: string;
}

export interface SubjectItem {
    id: number;
    code: string;
    name: string;
}

export interface PhaseItem {
    id: number;
    code: string;
    name: string;
}

export interface GradeItem {
    id: number;
    grade_number: number;
    name: string;
    phase_id: number;
}

export interface SemesterItem {
    id: number;
    name: string;
    semester_type: string;
    is_active: boolean;
}

export interface AcademicYearItem {
    id: number;
    year_name: string;
    is_active: boolean;
    semesters: SemesterItem[];
}

export interface GoalItem {
    id: number;
    code: string;
    bloom_level: string;
    competency_kko: string;
    material_content: string;
    pedagogical_description: string;
    estimated_hours?: number;
}

export interface QuestionDbItem {
    id: number;
    question_number: number;
    question_type: string;
    stimulus_text?: string | null;
    image_prompt?: string | null;
    image_path?: string | null;
    question_text: string;
    options_data?: Record<string, string> | null;
    correct_answer?: string | null;
    explanation?: string | null;
    score_weight: number;
    matrix?: {
        id: number;
        learning_goal_id?: number | null;
        indicator_text: string;
        bloom_level: string;
        cognitive_tier: string;
        difficulty_level: string;
    } | null;
}

export interface EditPackageDetail {
    id: number;
    title: string;
    assessment_type: string;
    curriculum_code: 'MERDEKA' | 'MADRASAH_KBC';
    total_questions: number;
    duration_minutes: number;
    instructions?: string | null;
    status: 'DRAFT' | 'FINAL';
    subject_id: number;
    phase_id: number;
    grade_id: number;
    academic_year_id?: number | null;
    semester_id?: number | null;
    subject: SubjectItem;
    phase: PhaseItem;
    grade: GradeItem;
    questions: QuestionDbItem[];
}
