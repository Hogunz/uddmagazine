import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { User, SharedData } from '@/types';
import { Trash } from 'lucide-react';

export default function UserIndex({ users }: { users: { data: User[], links: any[] } }) {
    const { auth } = usePage<SharedData>().props;

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Users', href: '/admin/users' }]}>
            <Head title="Manage Users" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Manage Admin Users</h2>
                            <Link href="/admin/users/create">
                                <Button>Add New User</Button>
                            </Link>
                        </div>

                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-zinc-800 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Name</th>
                                        <th scope="col" className="px-6 py-3">Email</th>
                                        <th scope="col" className="px-6 py-3">Role</th>
                                        <th scope="col" className="px-6 py-3">Created At</th>
                                        <th scope="col" className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="bg-white border-b dark:bg-zinc-900 dark:border-zinc-700">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                {user.name}
                                            </td>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                                    Admin
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                {user.id !== auth.user?.id && auth.user?.is_super_admin && (
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDelete(user.id)}
                                                    >
                                                        <Trash className="w-4 h-4 mr-2" /> Delete
                                                    </Button>
                                                )}
                                                {user.id === auth.user?.id && (
                                                    <span className="text-muted-foreground text-xs italic">Current User</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {users.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center">No users found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
