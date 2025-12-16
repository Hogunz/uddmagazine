import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Article, SharedData } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import ImageModal from '@/components/image-modal';

export default function NewsShow({ article }: { article: Article }) {
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

            <article className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-6 flex justify-between items-start">
                    <div className="flex-1 min-w-0 pr-4">

                        <h1 className="text-4xl font-bold mb-4 leading-tight break-words">{article.title}</h1>
                        <div className="flex items-center text-muted-foreground gap-4">
                            {article.user && <span className="font-semibold text-primary">{article.user.name}</span>}
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>{new Date(article.published_at || article.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                            </div>
                        </div>
                    </div>

                    {auth.user?.is_admin && (
                        <div className="flex gap-2">
                            <Link href={`/admin/news/${article.id}/edit`}>
                                <Button size="sm" variant="outline">
                                    <Pencil className="w-4 h-4 mr-2" /> Edit
                                </Button>
                            </Link>
                            <Button size="sm" variant="destructive" onClick={handleDelete}>
                                <Trash className="w-4 h-4 mr-2" /> Delete
                            </Button>
                        </div>
                    )}
                </div>

                {article.video && (
                    <div className="w-full rounded-xl overflow-hidden mb-8 bg-black">
                        <video
                            src={article.video}
                            controls
                            className="w-full max-h-[600px] mx-auto"
                            poster={article.image || undefined}
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}

                {!article.video && article.image && (
                    <div className="aspect-video w-full rounded-xl overflow-hidden mb-8">
                        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div
                    className="prose prose-lg dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </article>

            {article.gallery_images && article.gallery_images.length > 0 && (
                <div className="container mx-auto px-4 pb-12 max-w-4xl">
                    <h3 className="text-2xl font-bold mb-6">Gallery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {article.gallery_images.map((image, index) => (
                            <div
                                key={index}
                                className="aspect-video rounded-xl overflow-hidden shadow-sm cursor-pointer"
                                onClick={() => setSelectedImage(image)}
                            >
                                <img
                                    src={image}
                                    alt={`${article.title} gallery ${index + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
