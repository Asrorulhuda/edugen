export interface WaGatewaySetting {
    id: number;
    endpoint_url: string;
    api_key: string | null;
    sender: string | null;
    default_footer: string | null;
    is_active: boolean;
    full_response: boolean;
    last_tested_at: string | null;
    last_test_status: string | null;
    last_test_message: string | null;
    updated_at: string;
}

export interface WaTemplate {
    id: number;
    title: string;
    code: string;
    category: 'TRANSACTIONAL' | 'MARKETING' | 'REMINDER';
    content: string;
    footer: string | null;
    is_active: boolean;
    is_system: boolean;
    created_at: string;
}

export interface WaMessageLog {
    id: number;
    recipient_number: string;
    recipient_name: string | null;
    message: string;
    footer: string | null;
    status: 'PENDING' | 'SENT' | 'FAILED';
    source: 'MANUAL' | 'BROADCAST' | 'INVITATION_OTP' | 'SYSTEM';
    response_payload: any;
    error_message: string | null;
    tenant_id: number | null;
    user_id: number | null;
    sent_at: string | null;
    created_at: string;
    tenant?: {
        id: number;
        name: string;
        type: 'INDIVIDUAL' | 'INSTITUTION';
    } | null;
    user?: {
        id: number;
        name: string;
        email: string;
    } | null;
}

export interface CrmStats {
    total_sent: number;
    total_failed: number;
    total_pending: number;
    success_rate: number;
    total_templates: number;
}

export interface CrmAudiences {
    teachers_count: number;
    schools_count: number;
    expiring_count: number;
    low_quota_count: number;
}

export interface ClientRecipient {
    id: number;
    name: string;
    type: 'INDIVIDUAL' | 'INSTITUTION';
    contact_name?: string | null;
    phone?: string | null;
    remaining_quota: number;
    expires_at?: string | null;
}
