import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { FormEventHandler } from 'react';

export default function CreateUser() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/users');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Users', href: '/admin/users' }, { title: 'Create', href: '#' }]}>
            <Head title="Create User" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-6">Create New Admin User</h2>

                        <form onSubmit={submit} className="space-y-6 max-w-xl">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    required
                                />
                                {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium mb-1">Confirm Password</label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    Create User
                                </Button>
                                <Link href="/admin/users" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
