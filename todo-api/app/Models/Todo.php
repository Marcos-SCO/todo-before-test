<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    use HasFactory;

    protected $fillable = ['task_name', 'finished', 'finished_at'];

    protected $cats = [
        'finished' => 'boolean',
        'finished_at' => 'datetime',
    ];
}
