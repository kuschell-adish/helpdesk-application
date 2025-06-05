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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');

            $table->unsignedBigInteger('user_id'); 
            $table->unsignedBigInteger('admin_id')->nullable();
            $table->unsignedBigInteger('department_id');
            $table->unsignedBigInteger('status_id');
            $table->unsignedBigInteger('priority_id');

            $table->boolean('is_admin_creation')->default(false);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('admin_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('status_id')->references('id')->on('statuses')->onDelete('restrict');
            $table->foreign('priority_id')->references('id')->on('priorities')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
