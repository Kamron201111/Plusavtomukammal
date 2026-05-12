<?php

namespace Database\Seeders;

use App\Models\RoadLine;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class RoadLineSeeder extends Seeder
{
    public function run(): void
    {
        $jsonFile = base_path('database/data/yol_chiziqlari_full.json');

        if (!file_exists($jsonFile)) {
            $this->command->error("JSON fayl topilmadi: {$jsonFile}");
            return;
        }

        $road_lines = json_decode(file_get_contents($jsonFile), true);

        DB::transaction(function () use ($road_lines) {
            foreach ($road_lines as $data) {
                // 1. "name" va "color" kombinatsiyasi orqali mavjudligini tekshiramiz
                // Agar json'da 'id' (masalan 1.1) name sifatida kelsa, o'shani ishlatamiz
                $roadLine = RoadLine::firstOrNew([
                    'name'  => $data['id'],
                    'color' => $data['color'] ?? ''
                ]);

                // Agar ma'lumot bazada bo'lsa va rasm fayli mavjud bo'lsa, davom etamiz
                if ($roadLine->exists && $roadLine->image_url && Storage::disk('public')->exists($roadLine->image_url)) {
                    $this->command->info("O'tkazib yuborildi: {$roadLine->name}");
                    continue;
                }

                $localImagePath = null;

                // 2. Rasm yuklab olish
                if (!empty($data['image_url'])) {
                    try {
                        $imageContent = @file_get_contents($data['image_url']);

                        if ($imageContent) {
                            $extension = pathinfo(parse_url($data['image_url'], PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'jpg';
                            $filename = 'road_line_' . Str::random(10) . '_' . time() . '.' . $extension;
                            $storagePath = 'road_lines/' . $filename;

                            Storage::disk('public')->put($storagePath, $imageContent);
                            $localImagePath = $storagePath;
                        }
                    } catch (\Exception $e) {
                        $this->command->warn("Rasm yuklashda xato: " . $data['id']);
                    }
                }

                // 3. Ma'lumotlarni to'ldirish va saqlash
                $roadLine->image_url = $localImagePath ?? $roadLine->image_url;
                $roadLine->description = $data['description'] ?? '';
                $roadLine->save();

                $this->command->info("Saqlandi: {$roadLine->name}");
            }
        });

        $this->command->info("Yo'l chiziqlari muvaffaqiyatli sinxronizatsiya qilindi!");
    }
}
