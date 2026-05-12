<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class QuestionController extends Controller
{
    public function index()
    {
        //
    }

    public function store(StoreQuestionRequest $request)
    {
        try {
            DB::transaction(function () use ($request) {
                $data = $request->validated();

                if ($request->hasFile('image')) {
                    $filename = $request->file('image')->getClientOriginalName() . '_' . time()
                        . '.' . $request->file('image')->getClientOriginalExtension();
                    $path = $request->file('image')->storeAs('questions', $filename, 'public');

                    $data['image_url'] = $path;
                }

                $question = Question::create($data);

                foreach ($request->answers as $answer) {
                    $question->answers()->create([
                        'content' => $answer['content'],
                        'is_correct' => filter_var($answer['is_correct'], FILTER_VALIDATE_BOOLEAN),
                    ]);
                }
            });

            return redirect()->back();
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function show(Question $question)
    {
        //
    }

    public function update(UpdateQuestionRequest $request, Question $question)
    {
        try {
            DB::transaction(function () use ($request, $question) {
                // 1. Ma'lumotlarni yangilash
                $data = $request->validated();

                // 2. Rasm bilan ishlash
                if ($request->hasFile('image')) {
                    // Eski rasmni o'chirish (faqat lokal bo'lsa)
                    if ($question->image_url && !str_starts_with($question->image_url, 'http')) {
                        Storage::disk('public')->delete($question->image_url);
                    }

                    // Yangisini saqlash
                    $filename = $request->file('image')->getClientOriginalName() . '_' . time()
                        . '.' . $request->file('image')->getClientOriginalExtension();
                    $path = $request->file('image')->storeAs('questions', $filename, 'public');
                    $data['image_url'] = $path;
                }

                // Bazada yo'q maydonlarni olib tashlash
                unset($data['image']);
                unset($data['answers']);

                $question->update($data);

                // 3. Javoblarni yangilash (ID lar saqlanib qoladi — attempt_answers buzilmaydi)
                if ($request->has('answers')) {
                    $incomingIds = [];

                    foreach ($request->answers as $answerData) {
                        $answerId = $answerData['id'] ?? null;

                        $answer = $question->answers()->updateOrCreate(
                            // Agar ID kelsa — shu ID bo'yicha topib yangilaymiz, aks holda yangi yaratamiz
                            $answerId ? ['id' => $answerId] : ['content' => '__new__' . uniqid()],
                            [
                                'content'    => $answerData['content'],
                                'is_correct' => filter_var($answerData['is_correct'], FILTER_VALIDATE_BOOLEAN),
                            ]
                        );

                        $incomingIds[] = $answer->id;
                    }

                    // Faqat ro'yxatdan tushib qolgan (o'chirilgan) javoblarni o'chirish
                    $question->answers()
                        ->whereNotIn('id', $incomingIds)
                        ->delete();
                }
            });

            return redirect()->back();

        } catch (\Exception $e) {
            Log::error('Question Update Error: ' . $e->getMessage());
            throw \Illuminate\Validation\ValidationException::withMessages([
                'error' => "Xatolik yuz berdi: " . $e->getMessage(),
            ]);
        }
    }

    public function destroy(Question $question)
    {
        try {

            $question->delete();

            return redirect()->back()->with('success', 'Question deleted successfully.');

        } catch (\Exception $e) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$e->getMessage()],
            ]);
        }
    }
}
