<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        abort_unless(auth()->user()->is_admin || auth()->user()->is_super_admin, 403);

        $categories = Category::withCount('articles')->latest()->paginate(10);

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        abort_unless(auth()->user()->is_admin || auth()->user()->is_super_admin, 403);

        return Inertia::render('admin/categories/create');
    }

    public function store(Request $request)
    {
        abort_unless(auth()->user()->is_admin || auth()->user()->is_super_admin, 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        Category::create($validated);

        return redirect()->route('categories.index')->with('success', 'Category created successfully.');
    }

    public function edit(Category $category)
    {
        abort_unless(auth()->user()->is_admin || auth()->user()->is_super_admin, 403);

        return Inertia::render('admin/categories/edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        abort_unless(auth()->user()->is_admin || auth()->user()->is_super_admin, 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $category->update($validated);

        return redirect()->route('categories.index')->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        abort_unless(auth()->user()->is_admin || auth()->user()->is_super_admin, 403);

        $category->delete();

        return redirect()->route('categories.index')->with('success', 'Category deleted successfully.');
    }
}
