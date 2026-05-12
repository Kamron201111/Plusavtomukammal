<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Ticket;
use App\Models\Question;
use App\Models\Answer;

class TicketSeeder2 extends Seeder
{
    public function run(): void
    {
        $jsonFile = base_path('database/data/e-avtomaktab_1190-1300.json');

        if (!file_exists($jsonFile)) {
            $this->command->error("JSON fayl topilmadi: {$jsonFile}");
            return;
        }

        $ticketsData = json_decode(file_get_contents($jsonFile), true);

        DB::transaction(function () use ($ticketsData) {
            
            // Default ticket number (checking from 120 based on previous context)
            $ticketNumber = 120;
            
            // Chunk flat array of questions into groups of 10 to form tickets
            $chunks = array_chunk($ticketsData, 10);

            foreach ($chunks as $chunk) {
                // 1️⃣ Create or Update Ticket
                $ticket = Ticket::updateOrCreate(
                    ['title' => "Bilet {$ticketNumber}"],
                    [
                        'description' => '', 
                        'is_active' => 1,
                    ]
                );

                // 2️⃣ Questions for this ticket
                foreach ($chunk as $questionData) {
                    
                    // content or other unique field to prevent duplication if re-running
                    $question = $ticket->questions()->updateOrCreate(
                        ['content' => $questionData['content']],
                        [
                            'description' => $questionData['description'] ?? null,
                            'image_url' => $questionData['image_url'] ?? null,
                        ]
                    );

                    // 3️⃣ Answers
                    // Clear old answers if updating
                    $question->answers()->delete();

                    foreach ($questionData['answers'] as $answerData) {
                        $question->answers()->create([
                            'content' => $answerData['content'],
                            'is_correct' => $answerData['is_correct'],
                        ]);
                    }
                }
                
                $this->command->info("Ticket {$ticketNumber} seeded/updated.");
                $ticketNumber++;
            }
        });

        $this->command->info("TicketSeeder2 completed successfully.");
    }
}