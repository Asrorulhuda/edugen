export interface SubscriptionPlanItem {
    id: number;
    name: string;
    slug: string;
    client_model: 'INDIVIDUAL' | 'INSTITUTION';
    price: number | string;
    duration_days: number;
    max_seats: number;
    ai_generation_quota: number;
    features: string[];
    is_active: boolean;
    is_popular: boolean;
    order_index: number;
    tenant_subscriptions_count?: number;
    created_at?: string;
    updated_at?: string;
}

export interface PlanStats {
    total_plans: number;
    active_plans: number;
    individual_plans: number;
    institution_plans: number;
}
