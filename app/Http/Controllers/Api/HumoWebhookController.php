<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class HumoWebhookController extends Controller
{
    public function handle()
    {
        $data = request()->only(['amount', 'text']);

        // Bu yerda siz yuborilgan ma'lumotlarni qayta ishlashingiz mumkin
        // Masalan, ma'lumotlarni bazaga saqlash yoki boshqa biznes mantiqni bajarish

        // Javob qaytarish
        return response()->json(['status' => 'success', 'data' => $data]);
    }
}
