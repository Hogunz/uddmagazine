<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Article>
 */
class ArticleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'slug' => $this->faker->unique()->slug(),
            'content' => $this->faker->paragraphs(3, true),
            'image' => 'https://picsum.photos/seed/' . $this->faker->word() . '/800/600',
            'published_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'category_id' => \App\Models\Category::factory(),
        ];
    }
}
