<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    /** @use HasFactory<\Database\Factories\ArticleFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'image',
        'video',
        'gallery_images',
        'published_at',
        'category_id',
        'user_id',
        'author_name',
        'is_hero',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'gallery_images' => 'array',
        'is_hero' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
