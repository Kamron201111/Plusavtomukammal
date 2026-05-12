<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\Question;
use App\Http\Requests\StoreAttemptRequest;
use App\Http\Requests\UpdateAttemptRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AttemptController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/attempts",
     *     tags={"Attempts"},
     *     summary="List attempts",
     *     description="Get paginated list of attempts with optional filters",
     *     security={{"bearerAuth": {}}},
     *
     *     @OA\Parameter(
     *         name="ticket_id",
     *         in="query",
     *         required=false,
     *         description="Filter by ticket ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *
     *     @OA\Parameter(
     *         name="user_id",
     *         in="query",
     *         required=false,
     *         description="Filter by user ID",
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         required=false,
     *         description="Number of items per page",
     *         @OA\Schema(type="integer", example=15, minimum=1, maximum=100)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Attempts fetched successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Attempts fetched successfully."),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(
     *                     property="data",
     *                     type="array",
     *                     @OA\Items(ref="#/components/schemas/Attempt")
     *                 ),
     *                 @OA\Property(property="current_page", type="integer", example=1),
     *                 @OA\Property(property="last_page", type="integer", example=3),
     *                 @OA\Property(property="per_page", type="integer", example=15),
     *                 @OA\Property(property="total", type="integer", example=42)
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


    public function index(Request $request)
    {
        try {

            $request->validate([
                'ticket_id' => 'sometimes|exists:tickets,id',
                'user_id' => 'sometimes|exists:users,id',
                'per_page' => 'sometimes|integer|min:1|max:100',
            ]);

            $attemptsQuery = Attempt::query()->with([
                'ticket',
                'attemptAnswers.question.answers',
                'attemptAnswers.answer',
            ]);

            if ($request->has('ticket_id')) {
                $attemptsQuery->where('ticket_id', $request->input('ticket_id'));
            }

            if ($request->has('user_id')) {
                $attemptsQuery->where('user_id', $request->input('user_id'));
            }

            if ($request->has('search')) {
                $search = $request->input('search');
                $attemptsQuery->where(function ($query) use ($search) {
                    $query->whereHas('ticket', function ($q) use ($search) {
                        $q->whereLike('title', "%{$search}%");
                    })
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->whereLike('name', "%{$search}%");
                        });
                });
            }

            $perPage = $request->input('per_page');

            if ($perPage > 0) {
                $attempts = $attemptsQuery->paginate($perPage);
            } else {
                $attempts = $attemptsQuery->get();
            }

            return response()->json([
                'success' => true,
                'message' => 'Attempts fetched successfully.',
                'data' => $attempts,
            ]);

        } catch (\Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching attempts: ' . $exception->getMessage(),
                'data' => new \stdClass(),
            ]);
        }

    }


    /**
     * @OA\Post(
     *     path="/api/attempts",
     *     tags={"Attempts"},
     *     summary="Create a new attempt",
     *     description="Creates a new attempt for the authenticated user and assigns random questions from the ticket, or completely random questions if no ticket is provided.",
     *     security={{"bearerAuth": {}}},
     *
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="ticket_id", type="integer", example=1, nullable=true, description="ID of the ticket to attempt. Leave empty for random exam mode."),
     *             @OA\Property(property="questions_count", type="integer", example=20, nullable=true, enum={20, 50}, description="Number of questions to assign if ticket_id is null. Default is 20.")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Attempt created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Attempt created successfully."),
     *             @OA\Property(
     *                 property="data",
     *                 ref="#/components/schemas/Attempt"
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Unauthorized"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="The ticket_id field is required."),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Error creating attempt: ..."),
     *             @OA\Property(property="data", type="object")
     *         )
     *     )
     * )
     */


    public function store(Request $request)
    {
        $request->validate([
            'ticket_id' => 'nullable|exists:tickets,id',
            'questions_count' => 'nullable|integer|in:20,50',
        ]);

        DB::beginTransaction();
        try {
            $ticketId = $request->input('ticket_id');
            $questionsCount = $ticketId ? null : (int) $request->input('questions_count', 20);

            // Attempt yaratish
            $attempt = Attempt::create([
                'ticket_id' => $ticketId,
                'user_id' => $request->user()->id,
                'score' => 0,
                'started_at' => now(),
            ]);

            // Savollarni olish — bitta query
            $questions = $ticketId
                ? $attempt->ticket->questions()->inRandomOrder()->pluck('id')
                : Question::inRandomOrder()->limit($questionsCount)->pluck('id');

            if ($questions->isEmpty()) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'No questions found.',
                    'data' => new \stdClass(),
                ], 422);
            }

            // questions_count ni saqlash + bulk insert (N ta query o'rniga 1 ta)
            $now = now();
            $attempt->questions_count = $questions->count();
            $attempt->save();

            DB::table('attempt_answers')->insert(
                $questions->map(fn($id) => [
                    'attempt_id' => $attempt->id,
                    'question_id' => $id,
                    'answer_id' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ])->all()
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Attempt created successfully.',
                'data' => $attempt->load([
                    'ticket',
                    'attemptAnswers.question.answers',
                    'attemptAnswers.answer',
                ]),
            ]);

        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error creating attempt: ' . $exception->getMessage(),
                'data' => new \stdClass(),
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/attempts/{attempt}",
     *     tags={"Attempts"},
     *     summary="Get attempt details",
     *     description="Get attempt with ticket, questions, answers and selected answers",
     *     security={{"bearerAuth": {}}},
     *
     *     @OA\Parameter(
     *         name="attempt",
     *         in="path",
     *         required=true,
     *         description="Attempt ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Attempt fetched successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Attempt created successfully."),
     *             @OA\Property(
     *                 property="data",
     *                 ref="#/components/schemas/Attempt"
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
     *         response=404,
     *         description="Attempt not found"
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Server error"
     *     )
     * )
     */


    public function show(Attempt $attempt)
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Attempt created successfully.',
                'data' => $attempt->load([
                    'ticket',
                    'attemptAnswers.question.answers',
                    'attemptAnswers.answer',
                ]),
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching attempt: ' . $exception->getMessage(),
                'data' => new \stdClass(),
            ]);
        }
    }

    public function update(Request $request, Attempt $attempt)
    {

    }


    /**
     * @OA\Post(
     *     path="/api/attempts/{attempt}/submit",
     *     tags={"Attempts"},
     *     summary="Submit attempt and calculate score",
     *     security={{"bearerAuth": {}}},
     *
     *     @OA\Parameter(
     *         name="attempt",
     *         in="path",
     *         required=true,
     *         description="Attempt ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Attempt submitted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Attempt submitted successfully."),
     *             @OA\Property(property="data", ref="#/components/schemas/Attempt")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     ),
     *
     *     @OA\Response(
     *         response=404,
     *         description="Attempt not found"
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Server error"
     *     )
     * )
     */


    public function submit(Attempt $attempt)
    {
        try {
            // Calculate score
            $score = $attempt->attemptAnswers()
                ->whereHas('answer', fn($q) => $q->where('is_correct', true))
                ->count();

            // Update in one query
            $attempt->update([
                'finished_at' => now(),
                'score' => $score,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Attempt submitted successfully.',
                'data' => $attempt->load([
                    'ticket',
                    'attemptAnswers.question.answers',
                    'attemptAnswers.answer',
                ]),
            ]);

        } catch (\Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Error submitting attempt: ' . $exception->getMessage(),
                'data' => new \stdClass(),
            ]);
        }
    }


    public function destroy(Attempt $attempt)
    {
        //
    }
}
