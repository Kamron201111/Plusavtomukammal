<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreYhqRequest;
use App\Http\Requests\UpdateYhqRequest;
use App\Models\Yhq;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class YhqController extends Controller
{
    public function index()
    {
        $yhqs = Yhq::withCount('categories')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('admin/yhq/index', [
            'yhqs' => $yhqs,
        ]);
    }

    /**
     * Public page displaying the primary (latest) active YHQ 
     * and its associated nested categories & items structure.
     */
    public function activeIndex()
    {
        $yhq = Yhq::with(['categories.items' => function ($query) {
            $query->where('is_active', true);
        }, 'categories' => function ($query) {
            $query->where('is_active', true);
        }])->where('is_active', true)->latest()->first();

        // Pass structure to the front-end exactly predicting its layout map
        return Inertia::render('yhq/index', [
            'yhq' => $yhq,
        ]);
    }

    public function create() {}

    public function store(StoreYhqRequest $request)
    {
        try {
            Yhq::create($request->validated());
            return redirect()->back()->with('success', 'Yhq created successfully.');
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['error' => [$e->getMessage()]]);
        }
    }

    public function show(Yhq $yhq)
    {
        $yhq->load(['categories.items']);

        return Inertia::render('admin/yhq/show', [
            'yhq' => $yhq,
        ]);
    }

    public function edit(Yhq $yhq) {}

    public function update(UpdateYhqRequest $request, Yhq $yhq)
    {
        try {
            $yhq->update($request->validated());
            return redirect()->back()->with('success', 'Yhq updated successfully.');
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['error' => [$e->getMessage()]]);
        }
    }

    public function destroy(Yhq $yhq)
    {
        try {
            $yhq->delete();
            return redirect()->back()->with('success', 'Yhq deleted successfully.');
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['error' => [$e->getMessage()]]);
        }
    }
}
