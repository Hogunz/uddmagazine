<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
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
            'description' => $this->faker->paragraphs(2, true),
            'image' => 'https://picsum.photos/seed/' . $this->faker->word() . '/800/600',
            'event_date' => $this->faker->dateTimeBetween('now', '+1 year'),
            'location' => $this->faker->city(),
            'category_id' => \App\Models\Category::factory(),
        ];
    }
}
