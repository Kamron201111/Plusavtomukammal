<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('yhqs', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default('');
            $table->date('date')->nullable();
            $table->unsignedBigInteger('brv_amount')->default(0);
            $table->text('brv_description')->default('');
            $table->unsignedInteger('discount_days')->default(0);
            $table->unsignedInteger('discount_percent')->default(0);
            $table->unsignedInteger('payment_deadline_regular')->default(0);
            $table->unsignedInteger('payment_deadline_camera')->default(0);
            $table->unsignedInteger('cancellation_if_no_decision_days')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('yhqs');
    }
};
