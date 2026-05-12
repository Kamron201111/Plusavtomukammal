<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('otps', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->string('code');
            $table->dateTime('expired_at');
            $table->tinyInteger('expired')->default(0);
            $table->tinyInteger('is_android')->default(0);
            $table->tinyInteger('is_ios')->default(0);
            $table->tinyInteger('is_mobile')->default(0);
            $table->tinyInteger('is_email')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('otps');
    }
};
