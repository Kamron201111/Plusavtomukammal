<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoadLineRequest;
use App\Http\Requests\UpdateRoadLineRequest;
use App\Models\RoadLine;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class RoadLineController extends Controller
{
    /**
     * Admin: paginated list
     */
    public function index()
    {
        $road_lines = RoadLine::orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('admin/road_line/index', [
            'road_lines' => $road_lines,
        ]);
    }

    /**
     * Public: all road lines (for active display page)
     */
    public function activeIndex()
    {
        $road_lines = RoadLine::all();

        return Inertia::render('road_line/index', [
            'road_lines' => $road_lines,
        ]);
    }

    public function create() {}

    public function store(StoreRoadLineRequest $request)
    {
        try {
            RoadLine::create($request->validated());
            return redirect()->back()->with('success', 'Road line created successfully.');
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['error' => [$e->getMessage()]]);
        }
    }

    public function show(RoadLine $roadLine) {}

    public function edit(RoadLine $roadLine) {}

    public function update(UpdateRoadLineRequest $request, RoadLine $roadLine)
    {
        try {
            $roadLine->update($request->validated());
            return redirect()->back()->with('success', 'Road line updated successfully.');
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['error' => [$e->getMessage()]]);
        }
    }

    public function destroy(RoadLine $roadLine)
    {
        try {
            $roadLine->delete();
            return redirect()->back()->with('success', 'Road line deleted successfully.');
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['error' => [$e->getMessage()]]);
        }
    }
}
