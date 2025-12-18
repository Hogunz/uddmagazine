import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Article, SharedData } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import ImageModal from '@/components/image-modal';
import { Category } from '@/types';

export default function NewsShow({ article, trendingArticles, categories }: { article: Article, trendingArticles: Article[], categories: Category[] }) {
    const { auth } = usePage<SharedData>().props;
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this article?')) {
            router.delete(`/admin/news/${article.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'News', href: '/news' },
            { title: article.title, href: `/news/${article.slug}` }
        ]}>
            <Head title={article.title} />

            {/* Category Navigation */}
            <div className="bg-black text-white border-b border-white/10 overflow-x-auto">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center gap-6 md:gap-8 h-12 md:h-14 whitespace-nowrap text-sm font-medium">
                        <Link
                            href="/news"
                            className="text-primary hover:text-primary transition-colors py-2 border-b-2 border-primary"
                        >
                            All News
                        </Link>
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/category/${category.slug}`}
                                className={`py-2 border-b-2 border-transparent hover:text-primary hover:border-primary/50 transition-all ${article.category_id === category.id ? 'text-primary border-primary' : 'text-gray-300'
                                    }`}
                            >
                                {category.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <article className="bg-background rounded-xl">
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    {article.category && (
                                        <Link href={`/category/${article.category.slug}`}>
                                            <Badge variant="secondary" className="hover:bg-secondary/80 transition-colors">
                                                {article.category.name}
                                            </Badge>
                                        </Link>
                                    )}
                                    <span className="text-muted-foreground text-sm flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {new Date(article.published_at || article.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                    </span>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight break-words">{article.title}</h1>

                                <div className="flex justify-between items-center pb-6 border-b">
                                    <div className="flex items-center gap-3">
                                        {article.user && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                    {article.user.name.charAt(0)}
                                                </div>
                                                <span className="font-medium">{article.user.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    {auth.user?.is_admin && (
                                        <div className="flex gap-2">
                                            <Link href={`/admin/news/${article.id}/edit`}>
                                                <Button size="icon" variant="ghost" title="Edit Article">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={handleDelete} title="Delete Article">
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {article.video ? (
                                <div className="w-full rounded-xl overflow-hidden mb-8 bg-black shadow-lg">
                                    <video
                                        src={article.video}
                                        controls
                                        className="w-full max-h-[500px] mx-auto"
                                        poster={article.image || undefined}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            ) : article.image && (
                                <div className="w-full mb-8 flex justify-center">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="max-h-[500px] w-auto max-w-full rounded-xl shadow-lg"
                                    />
                                </div>
                            )}

                            <div
                                className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-xl prose-headings:font-bold prose-a:text-primary"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                        </article>

                        {/* Gallery Section */}
                        {article.gallery_images && article.gallery_images.length > 0 && (
                            <div className="pt-8 border-t">
                                <h3 className="text-2xl font-bold mb-6">Gallery</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {article.gallery_images.map((image, index) => (
                                        <div
                                            key={index}
                                            className="aspect-video rounded-xl overflow-hidden shadow-sm cursor-pointer group"
                                            onClick={() => setSelectedImage(image)}
                                        >
                                            <img
                                                src={image}
                                                alt={`${article.title} gallery ${index + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-8">
                            <div className="bg-secondary/5 rounded-xl p-6 border border-border/50">
                                <h3 className="text-xl font-bold mb-4 flex items-center">
                                    <span className="w-1 h-6 bg-primary mr-3 rounded-full"></span>
                                    Trending Now
                                </h3>
                                <div className="space-y-6">
                                    {trendingArticles.map((item) => (
                                        <Link href={`/news/${item.slug}`} key={item.id} className="group flex gap-4 items-start">
                                            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted relative">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No Img</div>
                                                )}
                                                {item.video && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                        <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
                                                            <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-black border-b-[3px] border-b-transparent ml-0.5"></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                                    {item.title}
                                                </h4>
                                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                    <span>{new Date(item.published_at || item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    {trendingArticles.length === 0 && (
                                        <p className="text-muted-foreground text-sm">No trending articles yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Correct placement of modal */}
            <ImageModal
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                imageUrl={selectedImage}
                altText={article.title}
            />
        </AppLayout>
    );
}
