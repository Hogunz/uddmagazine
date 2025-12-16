import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import Footer from '@/components/footer';
import { Category, SharedData } from '@/types';
import { PropsWithChildren } from 'react';
import { dashboard, login } from '@/routes';

interface MainLayoutProps extends PropsWithChildren {
    categories?: Category[];
    currentCategory?: Category;
}

export default function MainLayout({ children, categories = [], currentCategory }: MainLayoutProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground font-sans antialiased selection:bg-primary/20 selection:text-primary">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src="/img/dayew logo.png"
                            alt="Dayew Magazine Logo"
                            className="h-16 w-auto object-contain"
                        />
                    </Link>
                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <div className="flex items-center gap-2">
                                <AppearanceToggleDropdown />
                                <Link href={dashboard()}>
                                    <Button variant="ghost" size="sm">Dashboard</Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <AppearanceToggleDropdown />
                                <Link href={login()}>
                                    <Button variant="ghost" size="sm">Log in</Button>
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-grow">
                {/* Category Navigation */}
                <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container mx-auto px-4">
                        <nav className="-mb-px flex gap-8 overflow-x-auto py-4 scrollbar-hide">
                            <Link
                                href="/"
                                className={`whitespace-nowrap text-sm font-medium transition-colors ${!currentCategory ? 'text-primary font-bold' : 'text-muted-foreground hover:text-primary'}`}
                            >
                                All News
                            </Link>
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/category/${category.slug}`}
                                    className={`whitespace-nowrap text-sm font-medium transition-colors ${currentCategory?.slug === category.slug ? 'text-primary font-bold' : 'text-muted-foreground hover:text-primary'}`}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {children}
            </main>

            <Footer />
        </div>
    );
}
