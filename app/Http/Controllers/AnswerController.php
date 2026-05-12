<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Http\Requests\StoreAnswerRequest;
use App\Http\Requests\UpdateAnswerRequest;

class AnswerController extends Controller
{
    public function index()
    {
        return Answer::all();
    }

    public function store(StoreAnswerRequest $request)
    {
        return Answer::create($request->validated());
    }

    public function show(Answer $answer)
    {
        return $answer->load(['question', 'attemptAnswers']);
    }

    public function update(UpdateAnswerRequest $request, Answer $answer)
    {
        $answer->update($request->validated());
        return $answer;
    }

    public function destroy(Answer $answer)
    {
        $answer->delete();
        return response()->noContent();
    }
}
