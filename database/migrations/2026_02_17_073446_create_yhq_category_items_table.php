<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('yhq_category_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('yhq_category_id')->constrained('yhq_categories')->onDelete('cascade');
            $table->string('name')->default('');
            $table->decimal('bhm', 10, 2)->default(0);
            $table->unsignedBigInteger('summa')->default(0);
            $table->unsignedBigInteger('summa_min')->default(0);
            $table->unsignedBigInteger('summa_max')->default(0);
            $table->unsignedBigInteger('discount_summa')->default(0);
            $table->decimal('penalty_points', 5, 2)->default(0);
            $table->text('description')->default('');
            $table->text('additional_penalty')->default('');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('yhq_category_items');
    }
};
