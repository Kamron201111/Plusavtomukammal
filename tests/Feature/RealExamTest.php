<?php

namespace Tests\Feature;

use App\Models\Question;
use App\Models\Ticket;
use App\Models\User\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RealExamTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->mock(\App\Services\Telegram\TelegramBotService::class, function ($mock) {
            $mock->shouldReceive('sendAttemptInfo')->andReturnNull();
        });
    }

    public function test_user_can_start_real_exam_with_random_questions()
    {
        // 1. Create a user
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        // 2. Create some tickets and questions (more than 20)
        for ($i = 0; $i < 3; $i++) {
            $ticket = Ticket::create([
                'title' => 'Ticket ' . $i,
                'is_active' => true,
            ]);
            for ($j = 0; $j < 10; $j++) {
                Question::create([
                    'ticket_id' => $ticket->id,
                    'content' => 'Question ' . $i . ' ' . $j,
                ]);
            }
        }

        // 3. Act as the user and post to attempts.store with ticket_id null
        $response = $this->actingAs($user)
            ->from('/dashboard')
            ->post(route('attempts.store'), [
                'ticket_id' => null,
            ]);

        // 4. Assert redirect to practice page
        $response->assertSessionHasNoErrors();
        $response->assertRedirect();
        
        // 5. Assert the attempt was created with 20 questions and ticket_id null
        $this->assertDatabaseHas('attempts', [
            'user_id' => $user->id,
            'ticket_id' => null,
            'questions_count' => 20,
        ]);

        $attempt = \App\Models\Attempt::where('user_id', $user->id)->first();
        $this->assertCount(20, $attempt->attemptAnswers);
    }

    public function test_user_can_still_start_ticket_exam()
    {
        $user = User::create([
            'name' => 'Test User 2',
            'email' => 'test2@example.com',
            'password' => bcrypt('password'),
        ]);
        $ticket = Ticket::create([
            'title' => 'Test Ticket',
            'is_active' => true,
        ]);
        for ($i = 0; $i < 5; $i++) {
            Question::create([
                'ticket_id' => $ticket->id,
                'content' => 'Question ' . $i,
            ]);
        }

        $response = $this->actingAs($user)
            ->post(route('attempts.store'), [
                'ticket_id' => $ticket->id,
            ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();
        
        $this->assertDatabaseHas('attempts', [
            'user_id' => $user->id,
            'ticket_id' => $ticket->id,
            'questions_count' => 5,
        ]);
    }
}
