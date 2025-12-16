import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
}

export default function Edit({ category }: { category: Category }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Categories',
            href: '/admin/categories',
        },
        {
            title: 'Edit',
            href: `/admin/categories/${category.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/admin/categories/${category.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Category" />

            <div className="p-4 md:p-8 max-w-2xl mx-auto w-full">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold">Edit Category</h1>
                        <p className="text-muted-foreground">Update category details.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter category name"
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Update Category
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
