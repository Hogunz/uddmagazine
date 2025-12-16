<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        abort_unless(auth()->user()->is_admin, 403);

        $users = User::where('is_admin', true)->latest()->paginate(10);

        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort_unless(auth()->user()->is_admin, 403);

        return Inertia::render('admin/users/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        abort_unless(auth()->user()->is_admin, 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'is_admin' => true, // All users created by admins are admins
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        abort_unless(auth()->user()->is_super_admin, 403, 'Only Super Admins can delete users.');

        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
