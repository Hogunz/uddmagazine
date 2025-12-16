import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ArticleCard from '@/components/article-card';
import { Article, SharedData } from '@/types';
import { Button } from '@/components/ui/button';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export default function NewsIndex({ articles }: { articles: { data: Article[], links: PaginationLink[] } }) {
    const { auth } = usePage<SharedData>().props;

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this article?')) {
            router.delete(`/admin/news/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'News', href: '/news' }]}>
            <Head title="Latest News" />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Latest News</h1>
                    {auth.user?.is_admin && (
                        <Link href="/admin/news/create">
                            <Button>Create Article</Button>
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {articles.data.map(article => (
                        <div key={article.id} className="relative group">
                            <ArticleCard article={article} />
                            {auth.user?.is_admin && (
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/admin/news/${article.id}/edit`}>
                                        <Button size="sm" variant="secondary">Edit</Button>
                                    </Link>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDelete(article.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-center flex-wrap gap-2">
                    {articles.links.map((link, i) => (
                        link.url ? (
                            <Link key={i} href={link.url}>
                                <Button
                                    variant={link.active ? "default" : "outline"}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            </Link>
                        ) : (
                            <Button
                                key={i}
                                variant="outline"
                                disabled
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
