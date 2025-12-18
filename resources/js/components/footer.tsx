
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export function Footer({ className }: { className?: string }) {
    return (
        <footer className={cn("py-12 border-t bg-background", className)}>
            <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-6 text-center">
                <div className="flex flex-row items-center gap-4">
                    <img
                        src="/img/dayew logo.png"
                        alt="UDD News Logo"
                        className="h-16 w-auto object-contain grayscale opacity-70"
                    />
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Universidad de Dagupan. All rights reserved.
                    </p>
                </div>
                {/* <div className="flex gap-6 text-sm text-muted-foreground">
                    <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
                    <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
                </div> */}
            </div>
        </footer>
    );
}

export default Footer;
