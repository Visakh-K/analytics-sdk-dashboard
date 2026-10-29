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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->char('event_id', 26)->unique(); // ULID unique constraint for idempotency
            $table->string('event_name', 100);
            $table->string('distinct_id', 255);
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('session_id', 100)->nullable();
            $table->enum('source', ['browser', 'server'])->default('browser');
            $table->json('properties')->nullable();
            $table->json('context')->nullable();
            $table->dateTime('timestamp', 3);
            $table->timestamps();

            // Composite indexes for fast analytical aggregations
            $table->index(['timestamp', 'event_name']);
            $table->index(['distinct_id', 'timestamp']);
            $table->index(['event_name', 'timestamp']);
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
