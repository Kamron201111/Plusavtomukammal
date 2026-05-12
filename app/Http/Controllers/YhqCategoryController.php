<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreYhqCategoryRequest;
use App\Http\Requests\UpdateYhqCategoryRequest;
use App\Models\YhqCategory;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class YhqCategoryController extends Controller
{
    public function index() {}

    public function create() {}

    public function store(StoreYhqCategoryRequest $request)
    {
        try {
            YhqCategory::create($request->validated());
            return redirect()->back()->with('success', 'Yhq category created successfully.');
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['error' => [$e->getMessage()]]);
        }
    }

    public function show(YhqCategory $yhqCategory)
    {
        $yhqCategory->load(['items', 'yhq']);

        return Inertia::render('admin/yhq_category/show', [
            'yhq_category' => $yhqCategory,
        ]);
    }

    public function edit(YhqCategory $yhqCategory) {}

    public function update(UpdateYhqCategoryRequest $request, YhqCategory $yhqCategory)
    {
        try {
            $yhqCategory->update($request->validated());
            return redirect()->back()->with('success', 'Yhq category updated successfully.');
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['error' => [$e->getMessage()]]);
        }
    }

    public function destroy(YhqCategory $yhqCategory)
    {
        try {
            $yhqCategory->delete();
            return redirect()->back()->with('success', 'Yhq category deleted successfully.');
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['error' => [$e->getMessage()]]);
        }
    }
}
