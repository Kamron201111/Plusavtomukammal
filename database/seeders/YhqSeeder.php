<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Yhq;
use App\Models\YhqCategory;
use App\Models\YhqCategoryItem;

class YhqSeeder extends Seeder
{
    public function run(): void
    {
        $jsonFile = base_path('database/data/jarima_412.json');

        if (!file_exists($jsonFile)) {
            $this->command->error("JSON fayl topilmadi: {$jsonFile}");
            return;
        }

        $jarima_412 = json_decode(file_get_contents($jsonFile), true);

        // YHQ asosiy ma'lumotini yaratish
        $yhq = Yhq::create([
            'title' => $jarima_412['title'] ?? '',
            'date' => $jarima_412['date'] ?? null,
            'brv_amount' => $jarima_412['brv_amount'] ?? 0,
            'brv_description' => $jarima_412['brv_description'] ?? '',
            'discount_days' => $jarima_412['discount_days'] ?? 0,
            'discount_percent' => $jarima_412['discount_percent'] ?? 0,
            'payment_deadline_regular' => $jarima_412['payment_deadline_regular'] ?? 0,
            'payment_deadline_camera' => $jarima_412['payment_deadline_camera'] ?? 0,
            'cancellation_if_no_decision_days' => $jarima_412['cancellation_if_no_decision_days'] ?? 0,
            'is_active' => true,
        ]);

        // Kategoriyalarni yaratish
        if (!empty($jarima_412['categories'])) {
            foreach ($jarima_412['categories'] as $categoryData) {
                $category = $yhq->categories()->create([
                    'name' => $categoryData['name'] ?? '',
                    'is_active' => true,
                ]);

                // Itemlarni yaratish
                if (!empty($categoryData['items'])) {
                    foreach ($categoryData['items'] as $itemData) {
                        $category->items()->create([
                            'name' => $itemData['name'] ?? '',
                            'bhm' => $itemData['bhm'] ?? 0,
                            'summa' => $itemData['summa'] ?? 0,
                            'discount_summa' => $itemData['discount_summa'] ?? 0,
                            'summa_min' => $itemData['summa_min'] ?? 0,
                            'summa_max' => $itemData['summa_max'] ?? 0,
                            'penalty_points' => $itemData['penalty_points'] ?? 0,
                            'description' => $itemData['description'] ?? '',
                            'additional_penalty' => $itemData['additional_penalty'] ?? '',
                            'is_active' => true,
                        ]);
                    }
                }
            }
        }

        $this->command->info("YHQ ma'lumotlari muvaffaqiyatli yuklandi!");
    }
}
