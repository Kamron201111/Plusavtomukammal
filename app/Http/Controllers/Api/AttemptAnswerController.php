<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttemptAnswer;
use App\Http\Requests\StoreAttemptAnswerRequest;
use App\Http\Requests\UpdateAttemptAnswerRequest;

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

    /**
     * @OA\Put(
     *     path="/api/attempt_answers/{attempt_answer}",
     *     tags={"Attempt Answers"},
     *     summary="Update attempt answer",
     *     description="Update selected answer for a specific attempt answer",
     *     security={{"bearerAuth": {}}},
     *
     *     @OA\Parameter(
     *         name="attempt_answer",
     *         in="path",
     *         required=true,
     *         description="AttemptAnswer ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"answer_id"},
     *             @OA\Property(
     *                 property="answer_id",
     *                 type="integer",
     *                 example=3,
     *                 description="Selected answer ID"
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="AttemptAnswer updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Attempt answer updated successfully."),
     *             @OA\Property(
     *                 property="data",
     *                 ref="#/components/schemas/AttemptAnswer"
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Server error"
     *     )
     * )
     */


    public function update(UpdateAttemptAnswerRequest $request, AttemptAnswer $attemptAnswer)
    {
        try {
            $request->validate([
                'answer_id' => 'required|exists:answers,id',
            ]);

            $attemptAnswer->answer_id = $request->input('answer_id');
            $attemptAnswer->save();

            return response()->json([
                'success' => true,
                'message' => 'Attempt answer updated successfully.',
                'data' => $attemptAnswer,
            ]);

        } catch (\Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating AttemptAnswer: ' . $exception->getMessage(),
                'data' => new \stdClass(),
            ]);
        }
    }

    public function destroy(AttemptAnswer $attemptAnswer)
    {
        //
    }
}
