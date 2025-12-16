import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    is_admin?: boolean;
    is_super_admin?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    articles?: Article[];
    parent_id?: number | null;
    created_at: string;
    updated_at: string;
}

export interface Article {
    id: number;
    title: string;
    slug: string;
    content: string;
    image?: string | null;
    video?: string | null;
    gallery_images?: string[] | null;
    published_at?: string | null;
    category_id?: number | null;
    category?: Category | null;
    user?: User | null;
    created_at: string;
    updated_at: string;
}


export { };

declare global {
    var route: (name?: string, params?: any, absolute?: boolean, config?: any) => string;
}
