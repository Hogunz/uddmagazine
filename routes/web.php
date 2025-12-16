<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\ArticleController;
use App\Models\Article;

Route::get('/', function () {
    $featuredArticles = Article::with('user')->latest()->take(5)->get();
    $featuredIds = $featuredArticles->pluck('id');

    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'featuredArticles' => $featuredArticles,
        'moreArticles' => Article::with('user')->whereNotIn('id', $featuredIds)->latest()->paginate(9),
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
    });

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/news/{article:slug}', [ArticleController::class, 'show'])->name('news.show');

require __DIR__.'/settings.php';
