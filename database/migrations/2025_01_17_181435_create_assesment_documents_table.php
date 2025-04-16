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
        Schema::create('assesment_documents', function (Blueprint $table) {
            $table->id();
            $table->string('documentName');
            $table->string('fileName');
            $table->unsignedBigInteger('jobId');
            $table->unsignedBigInteger('teamId');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assesment_documents');
    }
};
