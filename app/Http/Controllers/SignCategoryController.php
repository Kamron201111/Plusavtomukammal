<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSignCategoryRequest;
use App\Http\Requests\UpdateSignCategoryRequest;
use App\Models\SignCategory;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SignCategoryController extends Controller
{
    /**
     * Admin: paginated list with signs count
     */
    public function index()
    {
        $sign_categories = SignCategory::withCount('signs')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('admin/sign_category/index', [
            'sign_categories' => $sign_categories,
        ]);
    }

    /**
     * Public: all with signs (for active display page)
     */
    public function activeIndex()
    {
        $sign_categories = SignCategory::with(['signs' => function ($query) {
            $query->where('is_active', true);
        }])->where('is_active', true)->get();

        return Inertia::render('sign_category/index', [
            'sign_categories' => $sign_categories,
        ]);
    }

    public function create() {}

    public function store(StoreSignCategoryRequest $request)
    {
        try {
            SignCategory::create($request->validated());
            return redirect()->back()->with('success', 'Sign category created successfully.');
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['error' => [$e->getMessage()]]);
        }
    }

    public function show(SignCategory $signCategory)
    {
        $signCategory->load('signs');

        return Inertia::render('admin/sign_category/show', [
            'sign_category' => $signCategory,
        ]);
    }

    public function edit(SignCategory $signCategory) {}

    public function update(UpdateSignCategoryRequest $request, SignCategory $signCategory)
    {
        try {
            $signCategory->update($request->validated());
            return redirect()->back()->with('success', 'Sign category updated successfully.');
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['error' => [$e->getMessage()]]);
        }
    }

    public function destroy(SignCategory $signCategory)
    {
        try {
            $signCategory->delete();
            return redirect()->back()->with('success', 'Sign category deleted successfully.');
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['error' => [$e->getMessage()]]);
        }
    }
}
