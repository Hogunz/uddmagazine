<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\ArticleController;
use App\Models\Article;

Route::get('/', function () {
    $categorySlug = request('category');
    $category = $categorySlug ? \App\Models\Category::where('slug', $categorySlug)->first() : null;

    $query = Article::with('user');

    if ($category) {
        $query->where('category_id', $category->id);
    }

    // Explicit Hero Articles
    $heroArticles = Article::with('user')->where('is_hero', true)->latest()->take(3)->get();
    
    // Latest Articles for the Grid (excluding explicit hero ones to avoid duplication)
    $latestArticles = Article::with('user')
                        ->whereNotIn('id', $heroArticles->pluck('id'))
                        ->latest()
                        ->take(4)
                        ->get();
    
    // We pass them separately now, or we can merge them if we want to keep the prop name but we should separate.
    // Let's pass them as 'heroArticles' and 'latestArticles'.
    // We also need to keep 'featuredArticles' compatible or remove it. 
    // The current Welcome.tsx uses 'featuredArticles'.
    // I will refactor Welcome.tsx to accept 'heroArticlesProp' and 'latestArticlesProp'.
    // For now in this step, I'll pass them in the array.

    
    $excludedIds = $heroArticles->pluck('id')->merge($latestArticles->pluck('id'));

    $moreArticles = Article::with('user')
        ->whereNotIn('id', $excludedIds)
        ->latest()
        ->paginate(12);

    $trendingArticles = Article::with('user')->orderBy('views', 'desc')->take(4)->get(); 

    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'heroArticles' => $heroArticles, // New Prop
        'latestArticles' => $latestArticles, // New Prop
        'featuredArticles' => [], // Deprecated, passing empty to avoid error if I don't remove it yet
        'moreArticles' => $moreArticles,
        'trendingArticles' => $trendingArticles,
        'categories' => \App\Models\Category::with(['articles' => function($query) {
            $query->with('user')->latest()->take(4);
        }])->get(),
        'currentCategory' => $category,
    ]);
})->name('home');

Route::get('/news', [ArticleController::class, 'index'])->name('news.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('admin')->group(function () {
        Route::get('/news', [ArticleController::class, 'indexAdmin'])->name('news.admin.index');
        Route::get('/news/create', [ArticleController::class, 'create'])->name('news.create');
        Route::post('/news', [ArticleController::class, 'store'])->name('news.store');
        Route::get('/news/{article}/edit', [ArticleController::class, 'edit'])->name('news.edit');
        Route::put('/news/{article}', [ArticleController::class, 'update'])->name('news.update');
        Route::delete('/news/{article}', [ArticleController::class, 'destroy'])->name('news.destroy');

        Route::resource('users', \App\Http\Controllers\UserController::class)->only(['index', 'create', 'store', 'destroy']);
        Route::resource('categories', \App\Http\Controllers\CategoryController::class);
    });

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/news/{article:slug}', [ArticleController::class, 'show'])->name('news.show');
Route::get('/category/{slug}', [ArticleController::class, 'category'])->name('category.show');

require __DIR__.'/settings.php';
