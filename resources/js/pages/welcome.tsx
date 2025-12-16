import { type SharedData, type Article, type Category } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import ArticleCard from '@/components/article-card';
import { Button } from '@/components/ui/button';
import { stripHtml } from '@/lib/utils';
import Pagination from '@/components/pagination';
import MainLayout from '@/layouts/main-layout';

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
    categories = [],
    trendingArticles = [],
    currentCategory,
}: {
    canRegister?: boolean;
    featuredArticles?: Article[];
    moreArticles?: PaginatedArticles;
    categories?: Category[];
    trendingArticles?: Article[];
    currentCategory?: Category;
}) {
    const { auth } = usePage<SharedData>().props;

    // Featured Data Processing
    const heroArticle = featuredArticles.length > 0 ? featuredArticles[0] : null;
    const latestArticles = featuredArticles.length > 0 ? featuredArticles.slice(1) : []; // The 4 main grid items

    // Paginated Data
    const otherArticles = moreArticles?.data || [];

    return (
        <MainLayout categories={categories} currentCategory={currentCategory}>
            <Head title={currentCategory ? `${currentCategory.name} - Dayew Magazine` : "Welcome - Dayew Magazine"} />

            {/* Hero Section - Magazine Style */}

            {heroArticle ? (
                <section className="relative w-full border-b border-border bg-muted/10">
                    <div className="container mx-auto px-4 lg:px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 min-h-[400px] py-12 lg:py-16 items-center">
                            {/* Hero Content */}
                            <div className="lg:col-span-7 flex flex-col justify-center relative z-10 space-y-6">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-primary" />
                                        <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Featured Story</span>
                                    </div>

                                    <Link href={`/news/${heroArticle.slug}`} className="group block space-y-4">
                                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-serif font-bold leading-tight break-words group-hover:text-primary transition-colors">
                                            {heroArticle.title}
                                        </h1>

                                        <p className="text-lg text-muted-foreground line-clamp-3 font-sans leading-relaxed max-w-2xl break-words">
                                            {stripHtml(heroArticle.content)}
                                        </p>
                                    </Link>

                                    <div className="pt-2 flex items-center gap-4 text-sm text-muted-foreground font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                                {heroArticle.user?.name?.[0] || 'E'}
                                            </div>
                                            <span className="text-foreground">{heroArticle.user?.name || 'Editorial Staff'}</span>
                                        </div>
                                        <span>•</span>
                                        <time>{new Date(heroArticle.published_at || heroArticle.created_at).toLocaleDateString()}</time>
                                    </div>
                                </div>
                            </div>

                            {/* Hero Image - Floating Card Style */}
                            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
                                {heroArticle.image ? (
                                    <Link href={`/news/${heroArticle.slug}`} className="relative block w-full group">
                                        {/* Decorative offset bg */}
                                        <div className="absolute inset-0 translate-x-3 translate-y-3 bg-primary/5 rounded-2xl -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500" />

                                        <div className="w-full rounded-2xl overflow-hidden shadow-xl ring-1 ring-border/50 bg-background">
                                            <img
                                                src={heroArticle.image}
                                                alt={heroArticle.title}
                                                className="w-full h-auto max-h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="w-full aspect-video rounded-2xl bg-secondary/10 flex items-center justify-center shadow-inner">
                                        <span className="text-6xl text-muted-foreground/20 font-serif font-bold">UDD</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <section className="py-24 px-4 text-center border-b">
                    <h1 className="text-6xl font-serif font-bold mb-4">Dayew Magazine</h1>
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

                            {/* Category Spotlights - Visual Breakers */}
                            {categories?.map((category, index) => (
                                category.articles && category.articles.length > 0 && (
                                    <div key={category.id} className="mb-16 border-t pt-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="font-serif text-2xl font-bold flex items-center gap-3">
                                                <span className="w-8 h-1 bg-primary inline-block"></span>
                                                {category.name}
                                            </h3>
                                            <Link href={`/category/${category.slug}`} className="text-sm font-bold text-muted-foreground hover:text-primary uppercase tracking-wider">
                                                View All
                                            </Link>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {category.articles.map(article => (
                                                <Link key={article.id} href={`/news/${article.slug}`} className="group block space-y-3">
                                                    <div className="aspect-[3/2] overflow-hidden rounded-md bg-muted relative">
                                                        {article.image && (
                                                            <img
                                                                src={article.image}
                                                                alt={article.title}
                                                                className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${article.image?.includes('logo') ? 'object-contain p-4 bg-secondary/10' : 'object-cover'}`}
                                                            />
                                                        )}
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                                    </div>
                                                    <h4 className="font-serif text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 break-words">
                                                        {article.title}
                                                    </h4>
                                                    <time className="text-xs text-muted-foreground block font-sans">
                                                        {new Date(article.published_at || article.created_at).toLocaleDateString()}
                                                    </time>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}

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
                                        {/* Trending Articles */}
                                        {trendingArticles.map((article, i) => (
                                            <Link key={`trending-${i}`} href={`/news/${article.slug}`} className="group flex gap-4 items-start">
                                                <span className="text-4xl font-serif font-bold text-muted-foreground/20 group-hover:text-primary/50 transition-colors">
                                                    {i + 1}
                                                </span>
                                                <div className="space-y-1 cursor-pointer min-w-0">
                                                    <h4 className="font-serif font-bold leading-tight group-hover:text-primary transition-colors break-words">
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
        </MainLayout>
    );
}
