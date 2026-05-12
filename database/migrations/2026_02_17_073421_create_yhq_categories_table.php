<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('yhq_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('yhq_id')->constrained('yhqs')->onDelete('cascade');
            $table->string('name')->default('');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('yhq_categories');
    }
};
