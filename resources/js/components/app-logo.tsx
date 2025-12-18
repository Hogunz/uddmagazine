

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2 py-1">
            {/* Light Mode Logo */}
            <img
                src="/img/dayew logo light.png"
                alt="Dayew Magazine"
                className="h-32 w-auto object-contain block dark:hidden"
            />
            {/* Dark Mode Logo */}
            <img
                src="/img/dayew logo.png"
                alt="Dayew Magazine"
                className="h-32 w-auto object-contain hidden dark:block"
            />
        </div>
    );
}
