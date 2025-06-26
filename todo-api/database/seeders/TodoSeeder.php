<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Todo;
use Illuminate\Support\Str;

class TodoSeeder extends Seeder
{

    public function run(): void
    {
        Todo::factory()->count(50)->create();
    }
}
