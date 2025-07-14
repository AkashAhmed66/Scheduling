<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('upload_models', function (Blueprint $table) {
            $table->id();
            $table->string('question'); // Field for the question
            $table->string('answer')->nullable(); // Field for the answer
            $table->text('findings')->nullable(); // Field for findings
            $table->string('risk_rating')->nullable(); // Field for risk rating
            $table->string('legal_ref')->nullable(); // Field for legal reference
            $table->text('recommendation')->nullable(); // Field for recommendation
            $table->timestamps(); // Created_at and Updated_at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('upload_models');
    }
};
