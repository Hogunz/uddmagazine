import { Link, usePage } from '@inertiajs/react';
import { Article } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayCircle } from 'lucide-react';
import { stripHtml } from '@/lib/utils';

export default function ArticleCard({ article, className }: { article: Article, className?: string }) {
    return (
        <Link href={`/news/${article.slug}`} className={`group flex flex-col gap-4 ${className}`}>
            <div className="relative aspect-[3/2] overflow-hidden bg-muted">
                {article.image && (
                    <img
                        src={article.image}
                        alt={article.title}
                        className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${article.image?.includes('logo') || article.image === '/UdD-Logo.png'
                            ? 'object-contain p-8 bg-secondary/10'
                            : 'object-cover'
                            }`}
                    />
                )}
                {/* Overlay for depth on hover, optional */}
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />

                {/* Video Indicator - Premium Style */}
                {article.video && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-white/90 rounded-full p-4 shadow-xl group-hover:scale-110 transition-transform duration-300">
                            <PlayCircle className="w-8 h-8 text-primary fill-current" />
                        </div>
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded">
                            WATCH
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {/* Placeholder for category if we had one, or just date/author */}
                    <span className="text-primary">{article.user?.name || 'Editorial'}</span>
                    <span>•</span>
                    <time dateTime={article.published_at || article.created_at}>
                        {new Date(article.published_at || article.created_at).toLocaleDateString(undefined, {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </time>
                </div>

                <h3 className="font-serif text-xl md:text-2xl font-bold leading-tight decoration-primary/50 underline-offset-4 transition-colors group-hover:text-primary group-hover:underline break-words">
                    {article.title}
                </h3>

                <p className="line-clamp-2 text-muted-foreground font-sans break-words">
                    {stripHtml(article.content)}
                </p>
            </div>
        </Link>
    );
}
