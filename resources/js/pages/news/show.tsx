import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Article, SharedData } from '@/types';
import { Button } from '@/components/ui/button';
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
                        <article className="bg-background rounded-none lg:rounded-xl overflow-hidden">
                            {/* Editorial Header */}
                            <header className="mb-10 text-center px-4 md:px-12 pt-8">
                                <div className="flex items-center justify-center gap-2 mb-6">
                                    {article.category && (
                                        <Link href={`/category/${article.category.slug}`}>
                                            <span className="text-primary font-bold tracking-widest text-xs uppercase border-b-2 border-primary pb-1 hover:text-primary/80 transition-colors">
                                                {article.category.name}
                                            </span>
                                        </Link>
                                    )}
                                </div>

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-[1.1] tracking-tight text-foreground text-balance">
                                    {article.title}
                                </h1>

                                <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground border-y border-border/40 py-6 mt-8 max-w-2xl mx-auto">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold uppercase tracking-widest">By</span>
                                        {article.author_name ? (
                                            <span className="text-xs font-bold uppercase tracking-widest text-foreground">{article.author_name}</span>
                                        ) : article.user ? (
                                            <span className="text-xs font-bold uppercase tracking-widest text-foreground">{article.user.name}</span>
                                        ) : (
                                            <span className="text-xs font-bold uppercase tracking-widest text-foreground">Editorial Staff</span>
                                        )}
                                        <span className="text-border mx-2">|</span>
                                        <span className="text-xs font-medium uppercase tracking-widest">
                                            {new Date(article.published_at || article.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>

                                    {/* Admin Controls embedded in header area nicely */}
                                    {auth.user?.is_admin && (
                                        <div className="flex gap-2 opacity-50 hover:opacity-100 transition-opacity">
                                            <Link href={`/admin/news/${article.id}/edit`}>
                                                <Button size="sm" variant="ghost" className="h-6 text-xs uppercase tracking-wider">
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button size="sm" variant="ghost" className="h-6 text-xs uppercase tracking-wider text-destructive hover:text-destructive" onClick={handleDelete}>
                                                Delete
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </header>

                            {/* Featured Media */}
                            {article.video ? (
                                <div className="w-full aspect-video bg-black shadow-sm mb-12">
                                    <video
                                        src={article.video}
                                        controls
                                        className="w-full h-full object-contain mx-auto"
                                        poster={article.image || undefined}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            ) : article.image && (
                                <div className="w-full mb-12">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-auto max-h-[600px] object-contain mx-auto shadow-sm"
                                    />
                                    <figcaption className="text-center text-xs text-muted-foreground mt-2 italic font-serif">
                                        {article.title}
                                    </figcaption>
                                </div>
                            )}

                            {/* Article Body */}
                            <div className="px-4 md:px-12 pb-12">
                                <div
                                    className="prose prose-lg dark:prose-invert max-w-none 
                                    prose-headings:font-serif prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                                    prose-p:font-serif prose-p:text-lg prose-p:leading-relaxed prose-p:text-foreground
                                    prose-a:text-primary prose-a:no-underline prose-a:border-b prose-a:border-primary/50 hover:prose-a:border-primary prose-a:transition-all
                                    prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:font-serif prose-blockquote:text-xl prose-blockquote:text-muted-foreground
                                    prose-img:rounded-sm prose-img:shadow-md
                                    first-letter:float-left first-letter:text-6xl first-letter:font-bold first-letter:font-serif first-letter:text-foreground first-letter:mr-3 first-letter:mt-[-0.15em] first-letter:leading-[0.8]"
                                    dangerouslySetInnerHTML={{ __html: article.content }}
                                />
                            </div>
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
                            <div className="bg-secondary/5 rounded-none lg:rounded-xl p-6 border border-border/50">
                                <h3 className="text-xl font-serif font-bold mb-4 flex items-center">
                                    <span className="w-1 h-6 bg-primary mr-3 rounded-full"></span>
                                    Trending Now
                                </h3>
                                <div className="space-y-6">
                                    {trendingArticles.map((item) => (
                                        <Link href={`/news/${item.slug}`} key={item.id} className="group flex gap-4 items-start">
                                            <div className="w-20 h-20 flex-shrink-0 rounded-sm overflow-hidden bg-muted relative shadow-sm">
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
                                                <h4 className="font-serif font-bold text-base leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                                    {item.title}
                                                </h4>
                                                <div className="text-xs text-muted-foreground flex items-center gap-2 font-sans tracking-wide uppercase">
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
