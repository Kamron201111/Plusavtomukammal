<?php

namespace App\Services;

use App\Models\Attempt;
use Illuminate\Support\Facades\Log;

class AttemptAutoSubmitService
{
    public function handle(): int
    {
        $attempts = Attempt::query()
            ->withCount('attemptAnswers')
            ->whereNull('finished_at')
            ->havingRaw('DATE_ADD(started_at, INTERVAL (attempt_answers_count * 75) SECOND) <= NOW()')
            ->get();

        $count = 0;

        foreach ($attempts as $attempt) {
            $score = $attempt->attemptAnswers()
                ->whereHas('answer', fn($q) => $q->where('is_correct', true))
                ->count();

            $attempt->update([
                'finished_at' => now(),
                'score' => $score,
            ]);

            $attempt->attemptAnswers()->whereNull('answer_id')->delete();

            $count++;
            Log::info("Attempt ID {$attempt->id} auto submitted with score {$score}");
        }

        return $count;
    }
}
