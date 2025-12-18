import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import Footer from '@/components/footer';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GuestLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
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
                                            className="h-12 w-auto object-contain block dark:hidden"
                                        />
                                        <img
                                            src="/img/dayew logo.png"
                                            alt="Dayew Magazine Logo"
                                            className="h-12 w-auto object-contain hidden dark:block"
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
                            className="h-14 w-auto object-contain block dark:hidden"
                        />
                        {/* Dark Mode Logo */}
                        <img
                            src="/img/dayew logo.png"
                            alt="Dayew Magazine Logo"
                            className="h-14 w-auto object-contain hidden dark:block"
                        />
                    </Link>

                    <nav className="hidden md:flex items-center justify-end gap-4">
                        <AppearanceToggleDropdown />
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-grow">
                {children}
            </main>

            <Footer className="py-10 border-t border-border mt-auto" />
        </div>
    );
}
