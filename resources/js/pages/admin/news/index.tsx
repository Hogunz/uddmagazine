import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button'; // Assuming this exists or use standard button
import { Article } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { SquarePen, Trash2 } from 'lucide-react';

interface Props {
    articles: {
        data: Article[];
        links: any[];
    };
    type: 'news' | 'hero';
}

export default function AdminNewsIndex({ articles, type }: Props) {
    const isHero = type === 'hero';
    const title = isHero ? 'Hero Section Articles' : 'News Articles';

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this article?')) {
            router.delete(`/admin/news/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Admin', href: '/dashboard' }, { title: title, href: '#' }]}>
            <Head title={title} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{title}</h2>
                            <Link href={`/admin/news/create?type=${type}`}>
                                <Button>
                                    Create {isHero ? 'Hero Article' : 'Article'}
                                </Button>
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="p-4 font-medium">Title</th>
                                        <th className="p-4 font-medium">Image</th>
                                        <th className="p-4 font-medium">Author</th>
                                        <th className="p-4 font-medium">Date</th>
                                        <th className="p-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {articles.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                                No articles found in this section.
                                            </td>
                                        </tr>
                                    ) : (
                                        articles.data.map((article) => (
                                            <tr key={article.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                                                <td className="p-4 font-medium">
                                                    <div className="flex flex-col">
                                                        <span className="text-base">{article.title}</span>
                                                        <span className="text-xs text-muted-foreground truncate max-w-xs">{article.slug}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="h-12 w-20 bg-muted rounded overflow-hidden relative">
                                                        {article.image ? (
                                                            <img
                                                                src={article.image}
                                                                alt={article.title}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : article.video ? (
                                                            <video
                                                                src={article.video}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground bg-secondary/20">
                                                                No Media
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">{article.user?.name || 'Unknown'}</td>
                                                <td className="p-4 text-muted-foreground">
                                                    {new Date(article.published_at || article.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 text-right space-x-2">
                                                    <Link href={`/admin/news/${article.id}/edit`}>
                                                        <Button variant="outline" size="icon">
                                                            <SquarePen className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(article.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Add Pagination if needed */}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
