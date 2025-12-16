import MainLayout from '@/layouts/main-layout';
import { Article, Category } from '@/types';
import { Head, Link } from '@inertiajs/react';
import ArticleCard from '@/components/article-card';
import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';

interface PaginatedArticles {
    data: Article[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface CategoryShowProps {
    category: Category;
    articles: PaginatedArticles;
    trendingArticles: Article[];
    categories: Category[];
}

export default function CategoryShow({ category, articles, trendingArticles, categories }: CategoryShowProps) {
    return (
        <MainLayout categories={categories} currentCategory={category}>
            <Head title={`${category.name} - Dayew Magazine`} />

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Category Header */}
                        <div className="border-b pb-4 mb-8">
                            <h1 className="font-serif text-4xl lg:text-5xl font-bold">{category.name}</h1>
                            <p className="text-muted-foreground mt-2">Latest stories in {category.name}</p>
                        </div>

                        {/* Article Grid */}
                        {articles.data.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                                {articles.data.map((article) => (
                                    <ArticleCard key={article.id} article={article} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-muted-foreground">
                                <p>No articles found in this category yet.</p>
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="pt-8">
                            <Pagination links={articles.links} />
                        </div>
                    </div>

                    {/* Sidebar / Trending */}
                    <aside className="lg:col-span-4 pl-0 lg:pl-12 lg:border-l border-border/50">
                        <div className="sticky top-24 space-y-12">
                            <div className="space-y-6">
                                <h3 className="font-serif text-xl font-bold uppercase tracking-wider border-b pb-2">Trending</h3>
                                <div className="space-y-6">
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
            </div>
        </MainLayout>
    );
}
