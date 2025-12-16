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

    $featuredArticles = (clone $query)->latest()->take(5)->get();
    $featuredIds = $featuredArticles->pluck('id');

    $moreArticles = (clone $query)->whereNotIn('id', $featuredIds)->latest()->paginate(9);

    // Trending stays global, assuming we want to pass it explicitly, or rely on client side logic?
    // User said "Trending should be in all categories", meaning it shouldn't be filtered.
    // If welcome.tsx expects `trendingArticles`, we should pass it.
    // Let's create a global trending query.
    $trendingArticles = Article::with('user')->orderBy('views', 'desc')->take(4)->get(); 

    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'featuredArticles' => $featuredArticles,
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
