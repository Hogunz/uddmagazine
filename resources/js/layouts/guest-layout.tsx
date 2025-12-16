import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import Footer from '@/components/footer';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';

export default function GuestLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
            <header className="container mx-auto px-4 py-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <img
                        src="/img/dayew logo.png"
                        alt="UDD News Logo"
                        className="h-16 w-auto object-contain"
                    />
                </Link>
                <nav className="flex items-center justify-end gap-4">
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
                            {/* <Link
                                href={register()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Register
                            </Link> */}
                        </>
                    )}
                </nav>
            </header>

            <main className="flex-grow">
                {children}
            </main>

            <Footer className="py-10 border-t border-border mt-auto" />
        </div>
    );
}
