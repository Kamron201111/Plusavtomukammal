<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')
                ->nullable()
                ->constrained('tickets')
                ->onDelete('restrict');
            $table->foreignId('user_id')->constrained('users')
                ->onDelete('restrict');
            $table->integer('score')->nullable()->default(0);
            $table->integer('questions_count')->nullable()->default(0);
            $table->dateTime('started_at')->nullable();
            $table->dateTime('finished_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attempts');
    }
};
