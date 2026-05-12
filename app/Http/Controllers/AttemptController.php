<?php

namespace App\Http\Controllers;

use App\Models\Attempt;
use App\Models\Question;
use App\Http\Requests\StoreAttemptRequest;
use App\Http\Requests\UpdateAttemptRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AttemptController extends Controller
{
    public function index(Request $request)
    {
        $attempt = Attempt::query()
            ->with(['ticket', 'user'])
            ->when($request->ticket_id, function ($query, $ticket_id) {
                $query->where('ticket_id', $ticket_id);
            })
            ->when($request->user_id, function ($query, $user_id) {
                $query->where('user_id', $user_id);
            })
            ->when($request->search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->whereHas('ticket', function ($q) use ($search) {
                        $q->whereLike('title', "%{$search}%");
                    })
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->whereLike('name', "%{$search}%");
                    });
                });
            })
            ->orderBy('id', 'desc');

        if (!Auth::user()->hasRole('Admin')) {
            $attempt->where('user_id', Auth::id());
        }

        if ($request->per_page) {
            $per_page = $request->per_page;
            $attempt = $attempt->paginate($per_page);
        } else {
            $attempt = $attempt->paginate(20);
        }

        return Inertia::render('attempt/index', [
            'attempt' => $attempt,
        ]);
    }

    public function store(StoreAttemptRequest $request)
    {
        DB::beginTransaction();
        try {

            $ticket_id = $request->input('ticket_id');
            $questions_count = $ticket_id ? null : (int) $request->input('questions_count', 20);
            // Faqat 20 yoki 50 ga ruxsat beriladi
            if (!$ticket_id && !in_array($questions_count, [20, 50])) {
                $questions_count = 20;
            }

            $attempt = Attempt::query()->create([
                'ticket_id' => $ticket_id,
                'user_id' => $request->user()->id,
                'score' => 0,
                'started_at' => now(),
            ]);

            if ($ticket_id) {
                $questions = $attempt->ticket->questions()->inRandomOrder()->get();
            } else {
                $questions = Question::query()->inRandomOrder()->limit($questions_count)->get();
            }

            $attempt->questions_count = count($questions);
            $attempt->save();

            $attempt->attemptAnswers()->createMany(
                $questions->map(function ($question) {
                    return [
                        'question_id' => $question->id,
                        'answer_id' => null,
                    ];
                })->toArray()
            );

            DB::commit();

            return redirect()->route('practice_show', ['attempt' => $attempt->id]);

        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'error' => [$e->getMessage()],
            ]);
        }
    }

    public function practice_show(Attempt $attempt)
    {
        try {
            $attempt->load([
                'user',
                'ticket',
                'attemptAnswers.question.answers' => function ($query) {
                    $query->inRandomOrder(); // <-- randomize answers
                },
                'attemptAnswers.answer',
            ]);

            // Server tomonida qolgan vaqtni hisoblash (timezone muammosini bartaraf qilish)
            $questionsCount = $attempt->attemptAnswers->count();
            $totalSeconds = $questionsCount * 75;
            $elapsedSeconds = (int) abs(now()->diffInSeconds($attempt->started_at));
            $remainingSeconds = max(0, $totalSeconds - $elapsedSeconds);

            return Inertia::render('practice/index', [
                'attempt' => $attempt,
                'remaining_seconds' => (int) $remainingSeconds,
            ]);

        } catch (\Exception $e) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$e->getMessage()],
            ]);
        }
    }

    public function show(Attempt $attempt)
    {
        try {

            return Inertia::render('attempt/show', [
                'attempt' => $attempt->load([
                    'attemptAnswers.question.answers',
                    'attemptAnswers.answer',
                    'user',
                    'ticket'
                ])
            ]);

        } catch (\Exception $e) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$e->getMessage()],
            ]);
        }
    }

    public function update(UpdateAttemptRequest $request, Attempt $attempt)
    {
        //
    }

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

            // Javob berilmagan savollarni o'chirib yuborish
            $attempt->attemptAnswers()->whereNull('answer_id')->delete();

            return redirect()->route('attempts.show', ['attempt' => $attempt->id])->with('success', 'Attempt submitted successfully.');

        } catch (\Exception $e) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$e->getMessage()],
            ]);
        }
    }

    public function destroy(Attempt $attempt)
    {
        try {
            $attempt->delete();
        } catch (\Exception $e) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$e->getMessage()],
            ]);
        }
    }
}
