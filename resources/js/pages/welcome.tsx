import { dashboard, login, register } from '@/routes';
import { type SharedData, type Article } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import ArticleCard from '@/components/article-card';
import { Button } from '@/components/ui/button';
import { stripHtml } from '@/lib/utils';
import Pagination from '@/components/pagination';
import Footer from '@/components/footer';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';

interface PaginatedArticles {
    data: Article[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export default function Welcome({
    canRegister = true,
    featuredArticles = [],
    moreArticles,
}: {
    canRegister?: boolean;
    featuredArticles?: Article[];
    moreArticles?: PaginatedArticles;
}) {
    const { auth } = usePage<SharedData>().props;

    // Featured Data Processing
    const heroArticle = featuredArticles.length > 0 ? featuredArticles[0] : null;
    const latestArticles = featuredArticles.length > 0 ? featuredArticles.slice(1) : []; // The 4 main grid items

    // Paginated Data
    const otherArticles = moreArticles?.data || [];

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700|playfair-display:400,600,700"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col bg-background text-foreground font-sans antialiased selection:bg-primary/20 selection:text-primary">
                {/* Sticky Header */}
                <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <img
                                src="/img/dayew logo.png"
                                alt="UDD News Logo"
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
                                    {/* {canRegister && (
                                        <Link href={register()}>
                                            <Button size="sm">Register</Button>
                                        </Link>
                                    )} */}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="flex-grow">
                    {/* Hero Section - Magazine Style */}
                    {heroArticle ? (
                        <section className="relative w-full border-b border-border">
                            <div className="container mx-auto">
                                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
                                    {/* Hero Content */}
                                    <div className="lg:col-span-4 p-8 lg:p-12 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border bg-background relative z-10">
                                        <div className="space-y-6">
                                            <div className="inline-flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-primary" />
                                                <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Featured Story</span>
                                            </div>

                                            <Link href={`/news/${heroArticle.slug}`} className="group block space-y-4">
                                                <h1 className="text-4xl lg:text-5xl font-serif font-bold leading-tight line-clamp-2 break-words group-hover:text-primary transition-colors">
                                                    {heroArticle.title}
                                                </h1>

                                                <p className="text-lg text-muted-foreground line-clamp-4 font-sans leading-relaxed">
                                                    {stripHtml(heroArticle.content)}
                                                </p>
                                            </Link>

                                            <div className="pt-4 flex items-center gap-4 text-sm text-muted-foreground font-medium">
                                                <span className="text-foreground">{heroArticle.user?.name || 'Editorial Staff'}</span>
                                                <span>•</span>
                                                <time>{new Date(heroArticle.published_at || heroArticle.created_at).toLocaleDateString()}</time>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hero Image */}
                                    <div className="lg:col-span-8 relative bg-muted overflow-hidden group">
                                        {heroArticle.image ? (
                                            <Link href={`/news/${heroArticle.slug}`} className="block w-full h-full">
                                                <img
                                                    src={heroArticle.image}
                                                    alt={heroArticle.title}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                                />
                                            </Link>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-secondary/30">
                                                <span className="text-9xl text-muted-foreground/10 font-serif font-bold">UDD</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    ) : (
                        <section className="py-24 px-4 text-center border-b">
                            <h1 className="text-6xl font-serif font-bold mb-4">UDD News</h1>
                            <p className="text-muted-foreground">The latest updates from our community.</p>
                        </section>
                    )}

                    {/* Content Grid Section */}
                    {(latestArticles.length > 0 || otherArticles.length > 0) && (
                        <section className="container mx-auto px-4 py-16">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                {/* Main Feed */}
                                <div className="lg:col-span-8 space-y-12">
                                    <div className="flex items-center justify-between border-b pb-4 mb-8">
                                        <h2 className="font-serif text-3xl font-bold">Latest Stories</h2>
                                    </div>

                                    {/* Primary Grid (First 4 items) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 mb-16">
                                        {latestArticles.map((article, i) => (
                                            <ArticleCard
                                                key={article.id}
                                                article={article}
                                                className={i === 0 ? "md:col-span-2 md:flex-row md:items-start md:gap-8 [&>div:first-child]:md:w-1/2 [&>div:first-child]:aspect-[4/3] [&>div:last-child]:md:w-1/2 [&_h3]:text-3xl" : ""}
                                            />
                                        ))}
                                    </div>

                                    {/* Secondary Grid / "Other Posts" from Pagination */}
                                    {otherArticles.length > 0 && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                                            <div className="flex items-center justify-between border-b pb-2 mb-6">
                                                <h3 className="font-serif text-2xl font-bold">More News</h3>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                                {otherArticles.map((article) => (
                                                    <ArticleCard key={article.id} article={article} />
                                                ))}
                                            </div>
                                            {/* Pagination Controls */}
                                            {moreArticles && <Pagination links={moreArticles.links} />}
                                        </div>
                                    )}
                                </div>

                                {/* Sidebar / Trending */}
                                <aside className="lg:col-span-4 pl-0 lg:pl-12 lg:border-l border-border/50">
                                    <div className="sticky top-24 space-y-12">
                                        <div className="space-y-6">
                                            <h3 className="font-serif text-xl font-bold uppercase tracking-wider border-b pb-2">Trending</h3>
                                            <div className="space-y-6">
                                                {/* We can reuse latestArticles for now as trending mock */}
                                                {latestArticles.slice(0, 4).map((article, i) => (
                                                    <Link key={`trending-${i}`} href={`/news/${article.slug}`} className="group flex gap-4 items-start">
                                                        <span className="text-4xl font-serif font-bold text-muted-foreground/20 group-hover:text-primary/50 transition-colors">
                                                            {i + 1}
                                                        </span>
                                                        <div className="space-y-1 cursor-pointer">
                                                            <h4 className="font-serif font-bold leading-tight group-hover:text-primary transition-colors">
                                                                {article.title}
                                                            </h4>
                                                            <span className="text-xs text-muted-foreground">
                                                                {new Date(article.published_at || article.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-muted/30 p-6 border border-border">
                                            <h3 className="font-serif text-lg font-bold mb-2">Subscribe to our Newsletter</h3>
                                            <p className="text-sm text-muted-foreground mb-4 font-sans">Get the latest news and updates highlighted every week.</p>
                                            <div className="flex gap-2">
                                                <input
                                                    type="email"
                                                    placeholder="Your email"
                                                    className="flex-1 bg-background border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                                />
                                                <Button size="sm" className="font-sans">Sign Up</Button>
                                            </div>
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </section>
                    )}
                </main>

                <Footer />
            </div>
        </>
    );
}
