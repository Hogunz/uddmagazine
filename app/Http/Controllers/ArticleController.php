<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Article;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::with('user')->latest()->paginate(9);
        return Inertia::render('news/index', [
            'articles' => $articles,
        ]);
    }

    public function indexAdmin(Request $request)
    {
        abort_unless(auth()->user()->is_admin, 403);
        
        $type = $request->query('type', 'news'); // 'news' or 'hero'
        $isHero = $type === 'hero';

        $articles = Article::with(['user', 'category']) // Eager load category too
            ->where('is_hero', $isHero)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/news/index', [
            'articles' => $articles,
            'type' => $type,
        ]);
    }

    public function show($slug)
    {
        $article = Article::with(['user', 'category'])->where('slug', $slug)->firstOrFail();
        $article->increment('views');

        $trendingArticles = Article::with('user')
            ->where('id', '!=', $article->id)
            ->orderBy('views', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('news/show', [
            'article' => $article,
            'trendingArticles' => $trendingArticles,
            'categories' => \App\Models\Category::all(),
        ]);
    }

    public function category($slug)
    {
        $category = \App\Models\Category::where('slug', $slug)->firstOrFail();
        
        $articles = Article::with('user')
            ->where('category_id', $category->id)
            ->latest()
            ->paginate(12);

        $trendingArticles = Article::with('user')
            ->where('category_id', $category->id)
            ->orderBy('views', 'desc')
            ->take(4)
            ->get();

        return Inertia::render('category/show', [
            'category' => $category,
            'articles' => $articles,
            'trendingArticles' => $trendingArticles,
            'categories' => \App\Models\Category::all(),
        ]);
    }
    public function create(Request $request)
    {
        abort_unless(auth()->user()->is_admin, 403);
        $categories = \App\Models\Category::all();
        $type = $request->query('type', 'news');
        
        return Inertia::render('admin/news/create', [
            'categories' => $categories,
            'type' => $type,
        ]);
    }

    public function store(Request $request)
    {
        abort_unless(auth()->user()->is_admin, 403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            // 'slug' => 'required|string|max:255|unique:articles', // Auto-generated
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048', // Allow image file, max 2MB
            'video' => 'nullable|mimetypes:video/avi,video/mpeg,video/mp4,video/quicktime|max:51200', // Max 50MB
            'gallery_images' => 'nullable|array',
            'gallery_images.*' => 'image|max:2048', // Allow image files
            'category_id' => 'nullable|exists:categories,id',
            'user_id' => 'nullable|exists:users,id',
            'author_name' => 'nullable|string|max:255',
            'published_at' => 'nullable|date',
            'is_hero' => 'boolean',
        ]);
        
        $validated['is_hero'] = $request->boolean('is_hero');

        $validated['user_id'] = auth()->id();
        $validated['slug'] = $this->generateUniqueSlug($request->title);

        // Handle Main Image
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('uploads/articles', 'public');
            $validated['image'] = '/storage/' . $path;
        } else {
             $validated['image'] = '/UdD-Logo.png';
        }

        // Handle Video
        if ($request->hasFile('video')) {
            $path = $request->file('video')->store('uploads/articles/videos', 'public');
            $validated['video'] = '/storage/' . $path;
        }

        // Handle Gallery Images
        $galleryPaths = [];
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $file) {
                 $path = $file->store('uploads/articles/gallery', 'public');
                 $galleryPaths[] = '/storage/' . $path;
            }
        }
        $validated['gallery_images'] = $galleryPaths;

        Article::create($validated);

        return redirect()->route('news.index')->with('success', 'Article created successfully.');
    }
    public function edit(Article $article)
    {
        abort_unless(auth()->user()->is_admin, 403);
        $categories = \App\Models\Category::all();
        return Inertia::render('admin/news/edit', [
            'article' => $article,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Article $article)
    {
        abort_unless(auth()->user()->is_admin, 403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            // 'slug' => 'required|string|max:255|unique:articles,slug,' . $article->id, // Managed automatically or preserved
            'content' => 'required|string',
            'image' => 'nullable', // Can be string (existing) or file (new)
            'video' => 'nullable', // Can be string (existing) or file (new)
            'gallery_images' => 'nullable|array',
            'gallery_images.*' => 'nullable', // Can be string (existing) or file (new)
            'category_id' => 'nullable|exists:categories,id',
            'author_name' => 'nullable|string|max:255',
            'published_at' => 'nullable|date',
            'is_hero' => 'boolean',
        ]);

        // Handle Main Image
        if ($request->hasFile('image')) {
            // Delete old image if it exists and is not default
            if ($article->image && $article->image !== '/UdD-Logo.png') {
                 // Logic to delete file could go here
            }
            $path = $request->file('image')->store('uploads/articles', 'public');
            $validated['image'] = '/storage/' . $path;
        } elseif (empty($validated['image']) && empty($article->image)) {
             $validated['image'] = '/UdD-Logo.png';
        } 

        // Handle Video
        if ($request->hasFile('video')) {
            if ($article->video) {
                // Logic to delete old video
            }
            $path = $request->file('video')->store('uploads/articles/videos', 'public');
            $validated['video'] = '/storage/' . $path;
        } elseif ($request->has('video') && is_null($request->input('video'))) {
             // If expressly cleared (if we had a clear button), handle here. 
             // Currently we just keep existing if not replaced.
        }

        // Handle Gallery Images
        $newGalleryPaths = [];
        
        if ($request->has('gallery_images')) {
             foreach ($request->input('gallery_images', []) as $item) {
                 if (is_string($item)) {
                     // Existing image URL
                     $newGalleryPaths[] = $item;
                 }
             }
        }

        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $file) {
                 $path = $file->store('uploads/articles/gallery', 'public');
                 $newGalleryPaths[] = '/storage/' . $path;
            }
        }
        $validated['gallery_images'] = $newGalleryPaths;

        $article->update($validated);

        return redirect()->route('news.show', $article->slug)->with('success', 'Article updated successfully.');
    }

    public function destroy(Article $article)
    {
        abort_unless(auth()->user()->is_admin, 403);

        $article->delete();

        return redirect()->route('news.index')->with('success', 'Article deleted successfully.');
    }

    private function generateUniqueSlug($title)
    {
        $slug = \Illuminate\Support\Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        while (Article::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        return $slug;
    }
}