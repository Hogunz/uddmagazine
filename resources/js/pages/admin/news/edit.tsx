import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Category, Article } from '@/types';
import { FormEventHandler } from 'react';
import { ImageUpload, MultiImageUpload } from '@/components/image-upload';
import RichTextEditor from '@/components/rich-text-editor';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EditNews({ article, categories }: { article: Article, categories: Category[] }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: article.title,
        slug: article.slug,
        category_id: article.category_id ? String(article.category_id) : '',
        author_name: article.author_name || '',
        content: article.content,
        published_at: article.published_at || '',
        is_hero: article.is_hero || false,

        image: article.image || (null as File | string | null),
        video: article.video || (null as File | string | null),
        gallery_images: (article.gallery_images || []) as (File | string)[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Use POST with _method: PUT for file uploads in Inertia
        post(`/admin/news/${article.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'News', href: '/news' }, { title: article.title, href: `/news/${article.slug}` }, { title: 'Edit', href: '#' }]}>
            <Head title={`Edit ${article.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-6">Edit {article.is_hero ? 'Hero' : ''} Article</h2>

                        <form onSubmit={submit} className="space-y-6 max-w-2xl">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    id="title"
                                    type="text"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category (Optional)</label>
                                    <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={String(category.id)}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category_id && <div className="text-red-500 text-sm mt-1">{errors.category_id}</div>}
                                </div>

                                <div>
                                    <label htmlFor="author_name" className="block text-sm font-medium mb-1">Author Name (Optional)</label>
                                    <input
                                        id="author_name"
                                        type="text"
                                        placeholder="Leave blank to use your name"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700"
                                        value={data.author_name}
                                        onChange={e => setData('author_name', e.target.value)}
                                    />
                                    {errors.author_name && <div className="text-red-500 text-sm mt-1">{errors.author_name}</div>}
                                </div>
                            </div>

                            <div>
                                <RichTextEditor
                                    label="Content"
                                    value={data.content}
                                    onChange={(content) => setData('content', content)}
                                    error={errors.content}
                                />
                            </div>

                            <div>
                                <label htmlFor="published_at" className="block text-sm font-medium mb-1">Published Date (Optional)</label>
                                <input
                                    id="published_at"
                                    type="datetime-local"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700"
                                    value={data.published_at}
                                    onChange={e => setData('published_at', e.target.value)}
                                />
                                {errors.published_at && <div className="text-red-500 text-sm mt-1">{errors.published_at}</div>}
                                {errors.published_at && <div className="text-red-500 text-sm mt-1">{errors.published_at}</div>}
                            </div>

                            <div>
                                <ImageUpload
                                    label="Main Image"
                                    value={data.image}
                                    onChange={(file) => setData('image', file)}
                                    error={errors.image}
                                />
                            </div>

                            <div>
                                <label htmlFor="video" className="block text-sm font-medium mb-1">Video (Optional)</label>
                                {article.video && (
                                    <div className="mb-2">
                                        <p className="text-sm text-muted-foreground mb-1">Current Video:</p>
                                        <video src={article.video} controls className="w-full max-h-48 object-contain rounded-md bg-black" />
                                    </div>
                                )}
                                <input
                                    id="video"
                                    type="file"
                                    accept="video/*"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    onChange={e => setData('video', e.target.files ? e.target.files[0] : null)}
                                />
                                {errors.video && <div className="text-red-500 text-sm mt-1">{errors.video}</div>}
                            </div>

                            <div>
                                <MultiImageUpload
                                    label="Gallery Images"
                                    values={data.gallery_images}
                                    onChange={(files) => setData('gallery_images', files as unknown as any[])}
                                    error={errors.gallery_images}
                                    uploadUrl="/admin/news/gallery/upload"
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    Update Article
                                </Button>
                                <a href={`/news/${article.slug}`} className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400">Cancel</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
