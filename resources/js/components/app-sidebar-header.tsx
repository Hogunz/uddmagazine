import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link } from '@inertiajs/react';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 relative">
            <div className="flex items-center gap-2 z-10">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden flex items-center gap-2">
                {/* Light Mode Logo */}
                <img
                    src="/img/dayew logo light.png"
                    alt="Dayew Magazine Logo"
                    className="h-10 w-auto object-contain block dark:hidden"
                />
                {/* Dark Mode Logo */}
                <img
                    src="/img/dayew logo.png"
                    alt="Dayew Magazine Logo"
                    className="h-10 w-auto object-contain hidden dark:block"
                />
            </Link>
        </header>
    );
}
