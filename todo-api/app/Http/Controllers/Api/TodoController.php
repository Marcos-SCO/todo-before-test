<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{

    public function index(Request $request)
    {
        $query = Todo::query();

        $hasFinishedRequest = $request->has('finished');

        if ($hasFinishedRequest) {
            $finished = filter_var($request->input('finished'), FILTER_VALIDATE_BOOLEAN);

            $query->where('finished', $finished);
        }

        if (!$hasFinishedRequest) $query->where('finished', false);

        return $query->orderByDesc('created_at')->paginate(10);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'task_name' => 'required|string|max:255',
            'finished' => 'boolean',
            'finished_at' => 'nullable|date',
        ]);

        return Todo::create($data);
    }


    public function update(Request $request, Todo $todo)
    {
        $data = $request->validate([
            'finished' => 'required|boolean',
            'finished_at' => 'nullable|date',
        ]);
        
        $data['finished_at'] = null;

        if ($data['finished']) $data['finished_at'] = now();

        $todo->update($data);
        return $todo;
    }

    public function destroy(Todo $todo)
    {
        $todo->delete();
        return response()->json(null, 204);
    }
}
