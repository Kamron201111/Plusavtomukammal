<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreYhqCategoryItemRequest;
use App\Http\Requests\UpdateYhqCategoryItemRequest;
use App\Models\YhqCategoryItem;
use Illuminate\Validation\ValidationException;

class YhqCategoryItemController extends Controller
{
    public function index() {}

    public function create() {}

    public function store(StoreYhqCategoryItemRequest $request)
    {
        try {
            YhqCategoryItem::create($request->validated());
            return redirect()->back()->with('success', 'Item created successfully.');
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['error' => [$e->getMessage()]]);
        }
    }

    public function show(YhqCategoryItem $yhqCategoryItem) {}

    public function edit(YhqCategoryItem $yhqCategoryItem) {}

    public function update(UpdateYhqCategoryItemRequest $request, YhqCategoryItem $yhqCategoryItem)
    {
        try {
            $yhqCategoryItem->update($request->validated());
            return redirect()->back()->with('success', 'Item updated successfully.');
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['error' => [$e->getMessage()]]);
        }
    }

    public function destroy(YhqCategoryItem $yhqCategoryItem)
    {
        try {
            $yhqCategoryItem->delete();
            return redirect()->back()->with('success', 'Item deleted successfully.');
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['error' => [$e->getMessage()]]);
        }
    }
}
