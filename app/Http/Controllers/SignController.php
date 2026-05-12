<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSignRequest;
use App\Http\Requests\UpdateSignRequest;
use App\Models\Sign;
use Illuminate\Validation\ValidationException;

class SignController extends Controller
{
    public function index() {}

    public function create() {}

    public function store(StoreSignRequest $request)
    {
        try {
            Sign::create($request->validated());
            return redirect()->back()->with('success', 'Sign created successfully.');
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['error' => [$e->getMessage()]]);
        }
    }

    public function show(Sign $sign) {}

    public function edit(Sign $sign) {}

    public function update(UpdateSignRequest $request, Sign $sign)
    {
        try {
            $sign->update($request->validated());
            return redirect()->back()->with('success', 'Sign updated successfully.');
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['error' => [$e->getMessage()]]);
        }
    }

    public function destroy(Sign $sign)
    {
        try {
            $sign->delete();
            return redirect()->back()->with('success', 'Sign deleted successfully.');
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['error' => [$e->getMessage()]]);
        }
    }
}
