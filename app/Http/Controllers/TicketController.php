<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class TicketController extends Controller
{

    public function activeTickets()
    {
        try {
            $tickets = Ticket::query()
                ->where('is_active', true)
                ->withCount([
                    'questions',
                    'attempts' => function ($query) {
                        if (!Auth::user()->hasRole('Admin')) {
                            $query->where('user_id', Auth::id());
                        }
                    }
                ])->get();

            return Inertia::render('ticket/active-ticket', [
                'tickets' => $tickets,
            ]);
        } catch (\Exception $e) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$e->getMessage()],
            ]);
        }
    }

    public function index(Request $request)
    {

        $ticket = Ticket::query()
            ->withCount('questions');

        if ($request->search) {
            $ticket->where(function ($query) use ($request) {
                $query->whereLike('title', "%$request->search%")
                    ->orWhereLike('description', "%$request->search%")
                    ->orWhereHas('questions', function ($q) use ($request) {
                        $q->whereLike('content', "%$request->search%")
                            ->orWhereHas('answers', function ($qa) use ($request) {
                                $qa->whereLike('content', "%$request->search%");
                            });
                    });
            });
        }

        if ($request->per_page) {
            $per_page = $request->per_page;
            $ticket = $ticket->paginate($per_page);
        } else {
            $ticket = $ticket->paginate(20);
        }

        return Inertia::render('ticket/index', [
            'ticket' => $ticket,
        ]);
    }

    public function store(StoreTicketRequest $request)
    {
        try {
            $ticket = Ticket::create($request->validated());

            return redirect()->back()->with('success', 'Ticket added successfully.');

        } catch (\Exception $e) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$e->getMessage()],
            ]);
        }
    }

    public function show(Ticket $ticket)
    {
        try {
            return Inertia::render('ticket/show', [
                'ticket' => $ticket->load(['questions.answers'])
            ]);
        } catch (\Exception $e) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$e->getMessage()],
            ]);
        }
    }

    public function update(UpdateTicketRequest $request, Ticket $ticket)
    {
        try {
            $ticket->update($request->validated());

            return redirect()->back()->with('success', 'Ticket updated successfully.');
        } catch (\Exception $e) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$e->getMessage()],
            ]);
        }
    }

    public function destroy(Ticket $ticket)
    {
        try {
            $ticket->delete();
            return redirect()->back()->with('success', 'Ticket deleted successfully.');
        } catch (\Exception $e) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$e->getMessage()],
            ]);
        }
    }
}
