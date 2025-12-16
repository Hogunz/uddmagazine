

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-12 items-center justify-center rounded-md text-sidebar-primary-foreground">
                <img
                    src="/img/dayew logo.png"
                    alt="UDD News Logo"
                    className="size-12 object-contain"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold text-lg">
                    UDD News
                </span>
            </div>
        </>
    );
}
