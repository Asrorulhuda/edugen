export interface ActiveSubscription {
    id: number;
    plan_name: string;
    status: 'TRIAL' | 'ACTIVE' | 'EXPIRED';
    starts_at: string;
    ends_at: string;
    days_remaining: number;
    ai_quota_used: number;
    ai_quota_limit: number;
    ai_quota_remaining: number;
    seats_limit: number;
}

export interface ClientItem {
    id: number;
    name: string;
    slug: string;
    tenant_type: 'INDIVIDUAL' | 'INSTITUTION';
    status: 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'EXPIRED';
    created_at: string;
    primary_admin?: {
        id: number;
        name: string;
        email: string;
    } | null;
    institution?: {
        id: number;
        name: string;
        npsn?: string;
        level?: string;
    } | null;
    active_subscription?: ActiveSubscription | null;
    members_count: number;
    teachers_count: number;
}

export interface ClientStats {
    total_clients: number;
    total_institutions: number;
    total_individuals: number;
    total_active: number;
}

export interface AvailablePlan {
    id: number;
    name: string;
    client_model: 'INDIVIDUAL' | 'INSTITUTION';
    price: number | string;
    duration_days: number;
    ai_generation_quota: number;
    max_seats: number;
}
