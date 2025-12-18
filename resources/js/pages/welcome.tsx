import { type SharedData, type Article, type Category } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react'; // Added router
import { ArrowRight, ChevronRight, Play, Pencil, Trash2, PlayCircle } from 'lucide-react'; // Added Pencil, Trash2, PlayCircle
import ArticleCard from '@/components/article-card';
import { Button } from '@/components/ui/button';
import { stripHtml } from '@/lib/utils';
import Pagination from '@/components/pagination';
import MainLayout from '@/layouts/main-layout';
import Autoplay from 'embla-carousel-autoplay';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import React from 'react';

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
    heroArticles = [], // New Prop
    latestArticles = [], // New Prop
    moreArticles,
    categories = [],
    trendingArticles = [],
    currentCategory,
}: {
    canRegister?: boolean;
    heroArticles?: Article[]; // Updated Prop
    latestArticles?: Article[]; // Updated Prop
    moreArticles?: PaginatedArticles;
    categories?: Category[];
    trendingArticles?: Article[];
    currentCategory?: Category;
    featuredArticles?: Article[]; // Deprecated, kept for loose typing if needed, but not used.
}) {
    const { auth } = usePage<SharedData>().props;

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this article?')) {
            router.delete(`/admin/news/${id}`);
        }
    };

    // Featured Data Processing
    // No more slicing, we use the explicit collections passed from backend
    // heroArticles are already the hero ones.
    // latestArticles are the grid ones.

    // Paginated Data
    const otherArticles = moreArticles?.data || [];

    return (
        <MainLayout categories={categories} currentCategory={currentCategory}>
            <Head title={currentCategory ? `${currentCategory.name} - Dayew Magazine` : "Welcome - Dayew Magazine"} />

            {/* Hero Section - Dynamic Carousel */}
            {/* Hero Section - Magazine Style Redesign */}
            {heroArticles.length > 0 ? (
                <section className="w-full border-b border-border/40 bg-background">
                    <Carousel
                        opts={{
                            loop: true,
                        }}
                        plugins={[
                            Autoplay({
                                delay: 6000,
                            }),
                        ]}
                        className="w-full"
                    >
                        <CarouselContent>
                            {heroArticles.map((heroArticle) => (
                                <CarouselItem key={heroArticle.id}>
                                    <div className="container mx-auto px-4 lg:px-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-12 lg:py-16 items-start lg:items-center">

                                            {/* Editorial Content - Col Span 5 */}
                                            <div className="lg:col-span-5 flex flex-col justify-center space-y-8 order-2 lg:order-1 h-full py-4">
                                                <div className="space-y-6">
                                                    {/* Kicker / Masthead Label */}
                                                    <div className="flex items-center gap-3 border-b border-primary/20 pb-4">
                                                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                                                            Cover Story
                                                        </span>
                                                        <span className="h-px w-8 bg-primary/20"></span>
                                                        <time className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                                                            {new Date(heroArticle.published_at || heroArticle.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                        </time>
                                                    </div>

                                                    <Link href={`/news/${heroArticle.slug}`} className="group block space-y-4">
                                                        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold leading-[1.1] tracking-tight text-foreground group-hover:text-primary transition-colors text-balance break-words line-clamp-2">
                                                            {heroArticle.title}
                                                        </h1>

                                                        <p className="text-lg text-muted-foreground font-serif leading-relaxed line-clamp-3 text-pretty max-w-xl border-l-2 border-border pl-4">
                                                            {stripHtml(heroArticle.content)}
                                                        </p>
                                                    </Link>

                                                    <div className="flex flex-col gap-6 pt-4">
                                                        {/* Author Byline */}
                                                        <div className="flex items-center gap-3 text-sm">
                                                            <div className="uppercase tracking-widest text-xs font-bold text-foreground/80">
                                                                By {heroArticle.user?.name || 'The Editors'}
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-4">
                                                            <Link href={`/news/${heroArticle.slug}`}>
                                                                <Button
                                                                    variant="outline"
                                                                    size="lg"
                                                                    className="rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background transition-all uppercase tracking-widest text-xs font-bold h-12 px-8"
                                                                >
                                                                    Read Full Story
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Visuals - Col Span 7 (Preserved Size & Ratio) */}
                                            <div className="lg:col-span-7 flex items-center justify-center lg:justify-end order-1 lg:order-2">
                                                {heroArticle.video ? (
                                                    <div className="relative w-full group">
                                                        {/* Reverted to aspect-video for video as it usually needs a frame, but ensuring fit */}
                                                        <div className="relative w-full aspect-video rounded-sm overflow-hidden shadow-sm border border-border/50 bg-black">
                                                            <video
                                                                src={heroArticle.video}
                                                                className="w-full h-full object-contain"
                                                                autoPlay
                                                                muted
                                                                loop
                                                                playsInline
                                                            />
                                                            <Link href={`/news/${heroArticle.slug}`} className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors cursor-pointer">
                                                                <div className="bg-background/90 text-foreground border border-border rounded-full p-4 shadow-sm hover:scale-105 transition-transform duration-300">
                                                                    <Play className="w-6 h-6 ml-0.5" />
                                                                </div>
                                                            </Link>

                                                            {/* Admin Controls */}
                                                            {auth.user?.is_admin && (
                                                                <div className="absolute top-0 right-0 p-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Link href={`/admin/news/${heroArticle.id}/edit`}>
                                                                        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-none border border-border">
                                                                            <Pencil className="w-3 h-3" />
                                                                        </Button>
                                                                    </Link>
                                                                    <Button
                                                                        size="icon"
                                                                        variant="destructive"
                                                                        className="h-8 w-8 rounded-none"
                                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(heroArticle.id); }}
                                                                    >
                                                                        <Trash2 className="w-3 h-3" />
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : heroArticle.image ? (
                                                    <div className="relative group inline-block max-w-full">
                                                        <Link href={`/news/${heroArticle.slug}`} className="block">
                                                            {/* Reverted to max-h approach, object-contain, flexible width */}
                                                            <img
                                                                src={heroArticle.image}
                                                                alt={heroArticle.title}
                                                                className="max-h-[600px] w-auto max-w-full rounded-sm shadow-xl border border-border/20 object-contain hover:shadow-2xl transition-all duration-700"
                                                            />
                                                        </Link>
                                                        {auth.user?.is_admin && (
                                                            <div className="absolute top-0 right-0 p-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                                <Link href={`/admin/news/${heroArticle.id}/edit`}>
                                                                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-none border border-border">
                                                                        <Pencil className="w-3 h-3" />
                                                                    </Button>
                                                                </Link>
                                                                <Button
                                                                    size="icon"
                                                                    variant="destructive"
                                                                    className="h-8 w-8 rounded-none"
                                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(heroArticle.id); }}
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="w-full aspect-video border border-border bg-secondary/10 flex items-center justify-center">
                                                        <span className="text-6xl text-muted-foreground/20 font-serif font-bold">UDD</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {heroArticles.length > 0 && (
                            <div className="container mx-auto px-4 lg:px-6 relative text-right pb-4 -mt-12 pointer-events-none">
                                <div className="inline-flex gap-2 pointer-events-auto">
                                    <CarouselPrevious className="static translate-y-0 rounded-none border-border hover:bg-primary hover:text-primary-foreground h-10 w-10 bg-background/50 backdrop-blur-sm" />
                                    <CarouselNext className="static translate-y-0 rounded-none border-border hover:bg-primary hover:text-primary-foreground h-10 w-10 bg-background/50 backdrop-blur-sm" />
                                </div>
                            </div>
                        )}
                    </Carousel>
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
                                <h2 className="font-serif text-3xl font-bold">Latest News</h2>
                                {auth.user?.is_admin && (
                                    <Link href="/admin/news/create">
                                        <Button variant="secondary" className="bg-[#F4D06F] hover:bg-[#F4D06F]/90 text-neutral-900 border-none">Create Article</Button>
                                    </Link>
                                )}
                            </div>

                            {/* Primary Grid (Next 4 items) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                                {latestArticles.map((article, i) => (
                                    <div key={article.id} className="relative group">
                                        <ArticleCard
                                            article={article}
                                        />
                                        {auth.user?.is_admin && (
                                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                                                <Link href={`/admin/news/${article.id}/edit`}>
                                                    <Button size="sm" variant="secondary" className="h-8 shadow-md">
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="h-8 shadow-md"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(article.id); }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        )}
                                    </div>
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

                                        {/* Alternating Layouts */}
                                        {index % 2 === 0 ? (
                                            // Layout A: 1 Large Feature + Side List (1 + 3)
                                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                                {/* Large Feature */}
                                                <div className="lg:col-span-8">
                                                    {category.articles[0] && (
                                                        <Link href={`/news/${category.articles[0].slug}`} className="group grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                                            <div className="aspect-video overflow-hidden rounded-md bg-muted relative">
                                                                {category.articles[0].image && (
                                                                    <img
                                                                        src={category.articles[0].image}
                                                                        alt={category.articles[0].title}
                                                                        className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${category.articles[0].image?.includes('logo') ? 'object-contain p-4 bg-secondary/10' : 'object-cover'}`}
                                                                    />
                                                                )}
                                                                {category.articles[0].video && (
                                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                                        <div className="bg-white/90 rounded-full p-3 shadow-lg">
                                                                            <PlayCircle className="w-8 h-8 text-primary fill-current" />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="space-y-3">
                                                                <h4 className="font-serif text-2xl font-bold leading-tight group-hover:text-primary transition-colors break-words">
                                                                    {category.articles[0].title}
                                                                </h4>
                                                                <p className="text-muted-foreground line-clamp-3 font-sans text-sm break-words">
                                                                    {stripHtml(category.articles[0].content)}
                                                                </p>
                                                                <time className="text-xs text-muted-foreground block font-sans">
                                                                    {new Date(category.articles[0].published_at || category.articles[0].created_at).toLocaleDateString()}
                                                                </time>
                                                            </div>
                                                        </Link>
                                                    )}
                                                </div>
                                                {/* Side List */}
                                                <div className="lg:col-span-4 flex flex-col gap-6 border-l pl-0 lg:pl-8 border-border/50">
                                                    {category.articles.slice(1, 4).map(article => (
                                                        <Link key={article.id} href={`/news/${article.slug}`} className="group flex gap-4 items-start">
                                                            <div className="w-20 h-20 shrink-0 aspect-square overflow-hidden rounded-md bg-muted relative">
                                                                {article.image && (
                                                                    <img
                                                                        src={article.image}
                                                                        alt={article.title}
                                                                        className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${article.image?.includes('logo') ? 'object-contain p-2 bg-secondary/10' : 'object-cover'}`}
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="space-y-1">
                                                                <h4 className="font-serif font-bold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2 break-words">
                                                                    {article.title}
                                                                </h4>
                                                                <time className="text-xs text-muted-foreground block font-sans">
                                                                    {new Date(article.published_at || article.created_at).toLocaleDateString()}
                                                                </time>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            // Layout B: Standard 4-Col Grid (but cleaner)
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                                                {category.articles.map(article => (
                                                    <Link key={article.id} href={`/news/${article.slug}`} className="group block space-y-3">
                                                        <div className="aspect-[3/2] overflow-hidden rounded-md bg-muted relative shadow-sm">
                                                            {article.image && (
                                                                <img
                                                                    src={article.image}
                                                                    alt={article.title}
                                                                    className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${article.image?.includes('logo') ? 'object-contain p-4 bg-secondary/10' : 'object-cover'}`}
                                                                />
                                                            )}
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                                            {article.video && (
                                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                                    <div className="bg-white/90 rounded-full p-2 shadow-md">
                                                                        <PlayCircle className="w-6 h-6 text-primary fill-current" />
                                                                    </div>
                                                                </div>
                                                            )}
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
                                        )}
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
