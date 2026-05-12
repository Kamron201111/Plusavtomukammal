<?php

namespace App\Observers;

use App\Models\Attempt;

class AttemptObserver
{
    public function created(Attempt $attempt): void {}

    public function updated(Attempt $attempt): void {}

    public function deleted(Attempt $attempt): void {}

    public function restored(Attempt $attempt): void {}

    public function forceDeleted(Attempt $attempt): void {}
}
