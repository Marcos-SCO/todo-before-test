<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\TodoController;

// Route::apiResource('todos', TodoController::class);

Route::get('/todos', [TodoController::class, 'index'])
    ->name('todos.index');

Route::post('/todos', [TodoController::class, 'store'])
    ->name('todos.store');

Route::put('/todos/{todo}', [TodoController::class, 'update'])
    ->name('todos.update');

Route::delete('/todos/{todo}', [TodoController::class, 'destroy'])
    ->name('todos.destroy');
