<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {


        User::firstOrCreate(
            ['email' => 'arzatech2025@gmail.com'],
            [
                'name' => 'Super Admin',
                'password' => 'ArzaTech2025!',
                'email_verified_at' => now(),
                'is_admin' => true,
                'is_super_admin' => true,
            ]
        );

        $categoryNames = [
            'Culture & Heritage',
            'People of Honor',
            'Arts & Creativity',
            'Faith & Values',
            'Education & Innovation',
            'Community & Society',
            'Opinion / Dayew Speaks',
            'Lifestyle with Purpose',
        ];

        $categories = collect($categoryNames)->map(function ($name) {
            return \App\Models\Category::firstOrCreate(
                ['name' => $name],
                ['slug' => \Illuminate\Support\Str::slug($name)]
            );
        });

    }
}
