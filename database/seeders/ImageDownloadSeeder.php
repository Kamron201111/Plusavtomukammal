<?php

namespace Database\Seeders;

use App\Models\Question;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ImageDownloadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questions = Question::whereNotNull('image_url')
            ->where(function ($query) {
                $query->where('image_url', 'like', '%e-avtomaktab.uz%')
                    ->orWhere('image_url', 'like', '%avtoimtihon.uz%');
            })
            ->get();

        $this->command->info("Found {$questions->count()} questions with external image URLs.");

        $successful = 0;
        $failed = 0;
        $skipped = 0;

        foreach ($questions as $question) {
            $url = $question->image_url;

            // Skip if already local (redundant check due to query but added for safety)
            if (!str_starts_with($url, 'http')) {
                $skipped++;
                continue;
            }

            try {
                // Extract filename from URL
                $filename = basename(parse_url($url, PHP_URL_PATH));
                
                // If filename is empty or weird, use question ID
                if (empty($filename) || strlen($filename) < 4) {
                    $ext = pathinfo($url, PATHINFO_EXTENSION) ?: 'jpg';
                    $filename = "question_{$question->id}.{$ext}";
                }

                $localPath = 'questions/' . $filename;

                // Check if file already exists locally
                if (Storage::disk('public')->exists($localPath)) {
                    $question->update(['image_url' => $localPath]);
                    $skipped++;
                    continue;
                }

                // Download the image
                $response = Http::timeout(30)->get($url);

                if ($response->successful()) {
                    Storage::disk('public')->put($localPath, $response->body());
                    
                    // Update the question's image_url to the local path
                    // Usually it's 'questions/xyz.jpg'
                    $question->update(['image_url' => $localPath]);
                    
                    $successful++;
                    $this->command->info("Downloaded: {$filename}");
                } else {
                    $failed++;
                    $this->command->error("Failed to download: {$url} (Status: {$response->status()})");
                }

            } catch (\Exception $e) {
                $failed++;
                $this->command->error("Error downloading {$url}: " . $e->getMessage());
            }
        }

        $this->command->info("Summary: {$successful} successful, {$failed} failed, {$skipped} skipped.");
    }
}
