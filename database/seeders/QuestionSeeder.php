<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Ticket;
use App\Models\Question;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        $jsonFile = base_path('database/data/avtoimtihon_1190.json');

        if (!file_exists($jsonFile)) {
            $this->command->error("JSON fayl topilmadi: {$jsonFile}");
            return;
        }

        $questions = json_decode(file_get_contents($jsonFile), true);

        DB::transaction(function () use ($questions) {

            $chunks = array_chunk($questions, 10);

            foreach ($chunks as $index => $questionGroup) {

                $ticket = Ticket::create([
                    'title' => 'Bilet ' . ($index + 1),
                    'description' => '',
                    'is_active' => 1,
                ]);

                foreach ($questionGroup as $questionData) {

                    $localImagePath = null;

                    // ✅ Agar rasm bor bo‘lsa yuklab olamiz
                    if (!empty($questionData['image_url'])) {

                        try {
                            $imageContent = file_get_contents($questionData['image_url']);

                            $extension = pathinfo($questionData['image_url'], PATHINFO_EXTENSION);
                            $filename = Str::random(20) . '_' . time() . '.' . $extension;

                            $storagePath = 'questions/' . $filename;

                            Storage::disk('public')->put($storagePath, $imageContent);

                            $localImagePath = $storagePath;

                        }
                        catch (\Exception $e) {
                            // agar rasm yuklanmasa ham savol qo‘shilaveradi
                            $localImagePath = null;
                        }
                    }

                    $question = $ticket->questions()->create([
                        'content' => $questionData['content'],
                        'description' => $questionData['description'] ?? null,
                        'image_url' => $localImagePath,
                    ]);

                    foreach ($questionData['answers'] as $answerData) {
                        $question->answers()->create([
                            'content' => $answerData['content'],
                            'is_correct' => $answerData['is_correct'],
                        ]);
                    }
                }
            }
        });
    }
}