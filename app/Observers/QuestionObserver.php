<?php

namespace App\Observers;

use App\Models\Question;

class QuestionObserver
{
    public function created(Question $question): void
    {
    }

    public function updated(Question $question): void
    {
    }

    public function deleted(Question $question): void
    {
    }

    public function restored(Question $question): void
    {
    }

    public function forceDeleted(Question $question): void
    {
    }
}
