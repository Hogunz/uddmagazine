import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

import GuestLayout from '@/layouts/guest-layout';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { auth } = usePage<SharedData>().props;

    if (auth.user) {
        return (
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppLayoutTemplate>
        );
    }

    return <GuestLayout>{children}</GuestLayout>;
};
