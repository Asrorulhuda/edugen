export interface User {
    id: number;
    name: string;
    email: string;
    status?: string;
    avatar_path?: string | null;
    avatar_url?: string | null;
    email_verified_at?: string;
}

export interface CurrentTenant {
    id: number;
    name: string;
    slug: string;
    tenant_type: 'INDIVIDUAL' | 'INSTITUTION';
    role?: string;
    role_display?: string;
    institution?: {
        name: string;
        type: string;
        npsn?: string;
        logo_path?: string;
    } | null;
}

export interface WorkspaceItem {
    tenant_id: number;
    name: string;
    slug: string;
    tenant_type: 'INDIVIDUAL' | 'INSTITUTION';
    role_name: string;
    role_display: string;
    is_current: boolean;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
        is_super_admin: boolean;
        current_tenant?: CurrentTenant | null;
        available_workspaces?: WorkspaceItem[];
    };
    flash?: {
        success?: string;
        error?: string;
    };
};
