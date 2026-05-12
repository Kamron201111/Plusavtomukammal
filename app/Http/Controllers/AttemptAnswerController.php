<?php

namespace App\Http\Controllers;

use App\Models\AttemptAnswer;
use App\Http\Requests\StoreAttemptAnswerRequest;
use App\Http\Requests\UpdateAttemptAnswerRequest;
use Illuminate\Validation\ValidationException;

class AttemptAnswerController extends Controller
{
    public function index()
    {
        //
    }

    public function store(StoreAttemptAnswerRequest $request)
    {
        //
    }

    public function show(AttemptAnswer $attemptAnswer)
    {
        //
    }

    public function update(UpdateAttemptAnswerRequest $request, AttemptAnswer $attemptAnswer)
    {
        try {

            $data = $request->validated();

            $attemptAnswer->answer_id = $data['answer_id'] ?? null;
            $attemptAnswer->save();

            return redirect()->back()->with('success', 'Answer updated successfully.');

        } catch (ValidationException $e) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$e->getMessage()],
            ]);
        }
    }

    public function updateAjax(UpdateAttemptAnswerRequest $request, AttemptAnswer $attemptAnswer)
    {
        try {
            $data = $request->validated();
            $attemptAnswer->answer_id = $data['answer_id'] ?? null;
            $attemptAnswer->save();
            return response()->json(['success' => true]);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function destroy(AttemptAnswer $attemptAnswer)
    {
        //
    }
}
