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
        Schema::create('audit_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('jobType');
            $table->string('reportNo');
            $table->string('requestType');
            $table->string('jobStatus');
            $table->string('officeCountry');
            $table->string('staffDays');
            $table->boolean('isClientShadowAudit');
            $table->date('dateRequestReceived');
            $table->date('auditDueDate');
            $table->date('auditStartDate');
            $table->date('auditEndDate');
            $table->text('remarks');
            $table->date('dateReportSentToQA');
            $table->date('finalReportSentToClient');

            // Staff Role
            $table->string('role');
            $table->string('user');
            $table->integer('staffDay');
            $table->date('startDate');
            $table->date('endDate');
            $table->boolean('reportWriter');
            $table->text('note');

            // Contacts
            $table->string('clientName');
            $table->string('clientCity');
            $table->string('clientProvince');
            $table->string('clientCountry');
            $table->string('clientPostalCode');
            $table->string('clientAddress');
            $table->string('clientTel');
            $table->string('vendorName');
            $table->string('vendorCity');
            $table->string('vendorProvince');
            $table->string('vendorCountry');
            $table->string('vendorPostalCode');
            $table->string('vendorAddress');
            $table->string('vendorTel');
            $table->string('factoryName');
            $table->string('factoryCity');
            $table->string('factoryProvince');
            $table->string('factoryCountry');
            $table->string('factoryPostalCode');
            $table->string('factoryAddress');
            $table->string('factoryTel');

            // Additional Information
            $table->text('coordination');
            $table->text('auditors');
            $table->text('reportReview');

            $table->integer('team');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_jobs');
    }
};
