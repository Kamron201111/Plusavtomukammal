<?php

namespace App\Observers;

use App\Models\Ticket;

class TicketObserver
{
    public function created(Ticket $ticket): void
    {
    }

    public function updated(Ticket $ticket): void
    {
    }

    public function deleted(Ticket $ticket): void
    {
    }

    public function restored(Ticket $ticket): void
    {
    }

    public function forceDeleted(Ticket $ticket): void
    {
    }
}
