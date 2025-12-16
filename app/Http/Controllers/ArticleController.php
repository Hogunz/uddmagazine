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

    public function show($slug)
    {
        $article = Article::with('user')->where('slug', $slug)->firstOrFail();
        return Inertia::render('news/show', [
            'article' => $article,
        ]);
    }
    public function create()
    {
        abort_unless(auth()->user()->is_admin, 403);
        return Inertia::render('admin/news/create');
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
            // 'category_id' => 'nullable|exists:categories,id',
            'published_at' => 'nullable|date',
        ]);

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

        return Inertia::render('admin/news/edit', [
            'article' => $article,
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
            // 'category_id' => 'nullable|exists:categories,id',
            'published_at' => 'nullable|date',
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