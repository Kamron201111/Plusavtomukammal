<?php

namespace Database\Seeders;

use App\Models\Sign;
use App\Models\SignCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SignSeeder extends Seeder
{
    public function run(): void
    {
        $jsonFile = base_path('database/data/yol_belgilari_full.json');

        if (!file_exists($jsonFile)) {
            $this->command->error("Fayl topilmadi: {$jsonFile}");
            return;
        }

        $data = json_decode(file_get_contents($jsonFile), true);

        DB::transaction(function () use ($data) {
            foreach ($data as $item) {
                // 1. Kategoriyani topish yoki yangi ob'ekt olish
                $category = SignCategory::firstOrNew(['name' => $item['name']]);
                $category->is_active = true;
                $category->save();

                $this->command->info("Kategoriya: {$category->name}");

                foreach ($item['signs'] as $signData) {
                    // 2. Belgini unique maydonlar (category_id va content) orqali tekshirish
                    $sign = Sign::firstOrNew([
                        'sign_category_id' => $category->id,
                        'content'          => $signData['content'],
                    ]);

                    // Agar belgi bazada mavjud bo'lsa va rasmi bo'lsa, qayta yuklab o'tirmaymiz
                    if ($sign->exists && $sign->image_url && Storage::disk('public')->exists($sign->image_url)) {
                        continue;
                    }

                    $localPath = null;

                    // 3. Rasmni yuklab olish
                    if (!empty($signData['image_url'])) {
                        try {
                            $imageContent = @file_get_contents($signData['image_url']);

                            if ($imageContent) {
                                $urlPath = parse_url($signData['image_url'], PHP_URL_PATH);
                                $extension = pathinfo($urlPath, PATHINFO_EXTENSION) ?: 'png';
                                $filename = 'sign_' . Str::random(10) . '_' . time() . '.' . $extension;
                                $fullPath = 'signs/' . $filename;

                                Storage::disk('public')->put($fullPath, $imageContent);
                                $localPath = $fullPath;
                            }
                        } catch (\Exception $e) {
                            $this->command->warn("Rasm yuklanmadi: " . $signData['content']);
                        }
                    }

                    // 4. Ma'lumotlarni to'ldirish va saqlash
                    $sign->image_url = $localPath ?? $sign->image_url;
                    $sign->is_active = true;
                    $sign->save();
                }
            }
        });

        $this->command->info("Barcha yo'l belgilari sinxronizatsiya qilindi!");
    }
}
