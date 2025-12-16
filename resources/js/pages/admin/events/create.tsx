import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Category } from '@/types';
import { FormEventHandler } from 'react';
import { ImageUpload, MultiImageUpload } from '@/components/image-upload';
import RichTextEditor from '@/components/rich-text-editor';

export default function CreateEvent() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        description: '',
        event_date: '',
        location: '',

        image: null as File | null,
        gallery_images: [] as (File | string)[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/events', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Events', href: '/events' }, { title: 'Create', href: '#' }]}>
            <Head title="Create Event" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-6">Create New Event</h2>

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





                            <div>
                                <RichTextEditor
                                    label="Description"
                                    value={data.description}
                                    onChange={(content) => setData('description', content)}
                                    error={errors.description}
                                />
                            </div>

                            <div>
                                <label htmlFor="event_date" className="block text-sm font-medium mb-1">Event Date</label>
                                <input
                                    id="event_date"
                                    type="datetime-local"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700"
                                    value={data.event_date}
                                    onChange={e => setData('event_date', e.target.value)}
                                    required
                                />
                                {errors.event_date && <div className="text-red-500 text-sm mt-1">{errors.event_date}</div>}
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
                                <input
                                    id="location"
                                    type="text"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700"
                                    value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                />
                                {errors.location && <div className="text-red-500 text-sm mt-1">{errors.location}</div>}
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
                                <MultiImageUpload
                                    label="Gallery Images"
                                    values={data.gallery_images}
                                    onChange={(files) => setData('gallery_images', files as unknown as any[])}
                                    error={errors.gallery_images}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    Create Event
                                </Button>
                                <a href="/events" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400">Cancel</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
