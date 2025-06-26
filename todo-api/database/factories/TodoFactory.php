<?php

namespace Database\Factories;

use App\Models\Todo;
use Illuminate\Database\Eloquent\Factories\Factory;

class TodoFactory extends Factory
{
    protected $model = Todo::class;

    public function definition(): array
    {
        $finished = $this->faker->boolean();

        return [
            'task_name' => $this->faker->sentence(4),
            'finished' => $finished,
            'finished_at' => $finished ? $this->faker->dateTimeThisYear() : null,
        ];
    }
}
