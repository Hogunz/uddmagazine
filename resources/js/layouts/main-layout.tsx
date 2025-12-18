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

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export default function MainLayout({ children, categories = [], currentCategory }: MainLayoutProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground font-sans antialiased selection:bg-primary/20 selection:text-primary">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 h-24 flex items-center justify-between relative">
                    {/* Mobile Menu Trigger */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="-ml-2">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                                <div className="flex flex-col gap-6 py-6">
                                    <div className="flex items-center gap-2 px-2">
                                        <img
                                            src="/img/dayew logo light.png"
                                            alt="Dayew Magazine Logo"
                                            className="h-16 w-auto object-contain block dark:hidden"
                                        />
                                        <img
                                            src="/img/dayew logo.png"
                                            alt="Dayew Magazine Logo"
                                            className="h-16 w-auto object-contain hidden dark:block"
                                        />
                                        <span className="font-serif font-bold text-xl">Dayew</span>
                                    </div>
                                    <hr />
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between px-2">
                                            <span className="text-sm font-medium">Appearance</span>
                                            <AppearanceToggleDropdown />
                                        </div>
                                        {auth.user ? (
                                            <Link href={dashboard()}>
                                                <Button className="w-full justify-start" variant="ghost">
                                                    Dashboard
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Link href={login()}>
                                                <Button className="w-full">Log in</Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0 flex items-center gap-2">
                        {/* Light Mode Logo */}
                        <img
                            src="/img/dayew logo light.png"
                            alt="Dayew Magazine Logo"
                            className="h-20 w-auto object-contain block dark:hidden"
                        />
                        {/* Dark Mode Logo */}
                        <img
                            src="/img/dayew logo.png"
                            alt="Dayew Magazine Logo"
                            className="h-20 w-auto object-contain hidden dark:block"
                        />
                    </Link>
                    <nav className="hidden md:flex items-center gap-4">
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
