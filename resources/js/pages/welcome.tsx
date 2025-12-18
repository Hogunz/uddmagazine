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
                <section className="w-full border-b border-border/40 bg-linear-to-b from-primary/5 to-background">
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
                                                    <div className="flex items-center gap-3 pb-4">
                                                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] bg-primary text-primary-foreground rounded-full shadow-xs">
                                                            Cover Story
                                                        </span>
                                                        <span className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></span>
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
                                                        <div className="relative w-full aspect-video rounded-sm overflow-hidden shadow-2xl border-4 border-white/20 ring-1 ring-black/5 bg-black">
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
                            <div className="flex items-center justify-between border-b border-primary/20 pb-4 mb-8">
                                <h2 className="font-serif text-3xl font-bold decoration-primary/50 underline decoration-4 underline-offset-8">Latest News</h2>
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
                                            className="h-full hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border border-transparent bg-card"
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
                                    <div key={category.id} className={`mb-16 pt-12 pb-8 ${index % 2 !== 0 ? 'bg-secondary/30 -mx-4 px-4 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 rounded-lg' : ''}`}>
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
                                        {/* Alternating Layouts */}
                                        {index % 3 === 0 ? (
                                            // Layout 0: Classic Editorial (Large Left + Side List)
                                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                                <div className="lg:col-span-7 xl:col-span-8">
                                                    {category.articles[0] && (
                                                        <Link href={`/news/${category.articles[0].slug}`} className="group block relative overflow-hidden rounded-sm shadow-sm">
                                                            <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                                                                {category.articles[0].image && (
                                                                    <img
                                                                        src={category.articles[0].image}
                                                                        alt={category.articles[0].title}
                                                                        className={`h-full w-full transition-transform duration-700 group-hover:scale-105 ${category.articles[0].image?.includes('logo') ? 'object-contain p-4 bg-secondary/10' : 'object-cover'}`}
                                                                    />
                                                                )}
                                                                {category.articles[0].video && (
                                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                                        <div className="bg-white/90 rounded-full p-4 shadow-lg backdrop-blur-sm">
                                                                            <PlayCircle className="w-8 h-8 text-primary fill-current" />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                                                                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                                                                    <div className="mb-2">
                                                                        <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-sm mb-3">
                                                                            Featured
                                                                        </span>
                                                                    </div>
                                                                    <h4 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-white leading-tight mb-3 drop-shadow-sm line-clamp-3">
                                                                        {category.articles[0].title}
                                                                    </h4>
                                                                    <p className="text-white/80 line-clamp-2 md:line-clamp-3 max-w-2xl font-serif text-lg leading-relaxed mb-4">
                                                                        {stripHtml(category.articles[0].content)}
                                                                    </p>
                                                                    <div className="text-white/70 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                                                                        <span>By {category.articles[0].user?.name || 'Editorial'}</span>
                                                                        <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                                                                        <time>{new Date(category.articles[0].published_at || category.articles[0].created_at).toLocaleDateString()}</time>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    )}
                                                </div>
                                                <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-0 divide-y divide-border/40 border border-border/40 rounded-sm bg-background">
                                                    {category.articles.slice(1, 5).map(article => (
                                                        <Link key={article.id} href={`/news/${article.slug}`} className="group p-5 flex gap-4 items-start hover:bg-muted/30 transition-colors">
                                                            <div className="space-y-2 flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                                                                    <span>News</span>
                                                                    <span className="text-muted-foreground/40">|</span>
                                                                    <time className="text-muted-foreground">{new Date(article.published_at || article.created_at).toLocaleDateString()}</time>
                                                                </div>
                                                                <h4 className="font-serif font-bold text-lg leading-[1.3] group-hover:text-primary transition-colors line-clamp-2">
                                                                    {article.title}
                                                                </h4>
                                                            </div>
                                                            <div className="w-24 h-16 shrink-0 bg-muted rounded-sm overflow-hidden relative shadow-sm">
                                                                {article.image ? (
                                                                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Img</div>
                                                                )}
                                                                {article.video && <div className="absolute inset-0 flex items-center justify-center bg-black/20"><PlayCircle className="w-4 h-4 text-white" /></div>}
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : index % 3 === 1 ? (
                                            // Layout 1: The "Bento" Mosaic
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 grid-rows-2">
                                                {/* Large Square Item (First) */}
                                                {category.articles[0] && (
                                                    <Link href={`/news/${category.articles[0].slug}`} className="group col-span-1 md:col-span-2 lg:col-span-2 row-span-2 relative h-[500px] overflow-hidden rounded-sm bg-black">
                                                        {category.articles[0].image && (
                                                            <img
                                                                src={category.articles[0].image}
                                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-60"
                                                                alt=""
                                                            />
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                                                        <div className="absolute bottom-0 left-0 p-8 w-full">
                                                            <h4 className="text-white font-serif font-bold text-3xl md:text-4xl leading-tight mb-4 group-hover:underline decoration-primary decoration-2 underline-offset-4">
                                                                {category.articles[0].title}
                                                            </h4>
                                                            <div className="flex items-center gap-3 text-white/80 text-sm font-medium uppercase tracking-widest">
                                                                <span>Read Story</span>
                                                                <ArrowRight className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                    </Link>
                                                )}

                                                {/* Second Item (Wide Top Right) */}
                                                {category.articles[1] && (
                                                    <Link href={`/news/${category.articles[1].slug}`} className="group col-span-1 md:col-span-2 lg:col-span-2 h-[240px] relative overflow-hidden rounded-sm bg-muted">
                                                        {category.articles[1].image && (
                                                            <img src={category.articles[1].image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                                                        )}
                                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                                                        <div className="absolute bottom-4 left-4 right-4">
                                                            <h4 className="text-white font-bold text-xl leading-tight line-clamp-2">{category.articles[1].title}</h4>
                                                        </div>
                                                    </Link>
                                                )}

                                                {/* Small Items Bottom Right */}
                                                {category.articles.slice(2, 4).map(article => (
                                                    <Link key={article.id} href={`/news/${article.slug}`} className="group col-span-1 h-[244px] relative overflow-hidden rounded-sm bg-muted">
                                                        {article.image && (
                                                            <img src={article.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                                                        )}
                                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                                                        <div className="absolute bottom-4 left-4 right-4">
                                                            <h4 className="text-white font-bold text-lg leading-tight line-clamp-3">{article.title}</h4>
                                                            <time className="text-white/60 text-xs mt-2 block">{new Date(article.published_at || article.created_at).toLocaleDateString()}</time>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            // Layout 2: Modern Cards Grid (Clean & Minimal)
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                                {category.articles.slice(0, 4).map(article => (
                                                    <Link key={article.id} href={`/news/${article.slug}`} className="group flex flex-col h-full bg-background border border-border/40 rounded-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                                                        <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                                                            {article.image && (
                                                                <img
                                                                    src={article.image}
                                                                    alt={article.title}
                                                                    className={`h-full w-full transition-transform duration-500 group-hover:scale-110 ${article.image?.includes('logo') ? 'object-contain p-8' : 'object-cover'}`}
                                                                />
                                                            )}
                                                            {article.video && <div className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5"><Play className="w-3 h-3 fill-current" /></div>}
                                                        </div>
                                                        <div className="p-5 flex flex-col flex-grow">
                                                            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
                                                                {category.name}
                                                            </div>
                                                            <h4 className="font-serif font-bold text-xl leading-snug mb-3 line-clamp-3 group-hover:text-primary transition-colors flex-grow">
                                                                {article.title}
                                                            </h4>
                                                            <div className="pt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground mt-auto">
                                                                <span>{new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
                                                                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-foreground font-medium">
                                                                    Read <ArrowRight className="w-3 h-3" />
                                                                </span>
                                                            </div>
                                                        </div>
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
                                    <h3 className="font-serif text-xl font-bold uppercase tracking-wider border-b border-primary/20 pb-2 decoration-primary/50 underline decoration-2 underline-offset-8">Trending</h3>
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

                                <div className="bg-primary p-8 rounded-sm shadow-lg text-primary-foreground relative overflow-hidden group">
                                    <div className="absolute -right-6 -top-6 bg-white/10 w-24 h-24 rounded-full transition-transform group-hover:scale-150 duration-700"></div>
                                    <div className="relative z-10">
                                        <h3 className="font-serif text-xl font-bold mb-2">Subscribe to our Newsletter</h3>
                                        <p className="text-sm text-primary-foreground/80 mb-6 font-sans">Get the latest news and updates highlighted every week.</p>
                                        <div className="flex flex-col gap-3">
                                            <input
                                                type="email"
                                                placeholder="Your email"
                                                className="w-full bg-white/90 border-transparent px-4 py-3 text-sm text-black placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white transition-all rounded-sm"
                                            />
                                            <Button size="lg" className="w-full bg-black text-white hover:bg-black/80 font-bold tracking-wide uppercase text-xs border-none">Sign Up</Button>
                                        </div>
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
