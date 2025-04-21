<?php

use App\Http\Controllers\ActivateUserController;
use App\Http\Controllers\AuditJobController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UploadModelController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    return redirect()->route('home');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/get-profile-data', [ProfileController::class, 'ProfileData'])->name('get-profile-data');
    Route::post('/user-profile-photo', [ActivateUserController::class, 'UploadProfilePhoto'])->name('user-profile-photo');

    Route::get('/home', [ProfileController::class, 'GetUserData'])->name('home');
    
    Route::get('/assesment', [UploadModelController::class, 'index']);
    Route::put('/update-assessment/{id}', [UploadModelController::class, 'updateAssesment'])->name('update-assessment');
    Route::get('/download-assessment-pdf/{assessmentId?}', [App\Http\Controllers\AssessmentController::class, 'generatePdf'])->name('download-assessment-pdf');
    Route::get('/generate-assessment-pdf/{id}', [App\Http\Controllers\AssessmentController::class, 'generatePdf'])->name('generate-assessment-pdf');
    Route::get('/upload', [UploadModelController::class, 'index']);
    Route::get('/perform-audit/{id}', [UploadModelController::class, 'PerformAudit'])->name('perform-audit');

    Route::get('/calender', [AuditJobController::class, 'GetJobsForCalender']);
    
    Route::post('/submit-audit-files', [AuditJobController::class, 'SubmitAuditFiles'])->name('submit-audit-files');
    Route::post('/submit-audit-job', [AuditJobController::class, 'store'])->name('submit-audit-job');
    Route::post('/submit-audit-job-edit', [AuditJobController::class, 'AuditEdit'])->name('submit-audit-job-edit');
    Route::get('/jobs', [AuditJobController::class, 'index'])->name('jobs');
    Route::get('/view-job/{id}', [AuditJobController::class, 'ViewJob'])->name('view-job');
    Route::get('/create-job', [AuditJobController::class, 'CreateJob'])->name('create-job');
    Route::get('/edit-job/{id}', [AuditJobController::class, 'EditJob'])->name('edit-job');
    Route::delete('/delete-job/{id}', [AuditJobController::class, 'DeleteJob'])->name('delete-job');
    Route::get('/add-files-job/{id}', [AuditJobController::class, 'AddFilesToJob'])->name('add-files-job');
    Route::post('/pass-job', [AuditJobController::class, 'PassJob'])->name('pass-job');
    

    Route::get('/scheduling', function () {
        return Inertia::render('Scheduling');
    });
    Route::get('/docs', function () {
        return Inertia::render('AuditDocs');
    });
    
    Route::post('/activate-user', [ActivateUserController::class, 'UpdateActivateUser'])->name('activate-user');
    Route::get('/activate-user', [ActivateUserController::class, 'goToActivateUser'])->name('activate-user');
    Route::get('/activate-user-list', [ActivateUserController::class, 'index'])->name('activate-user-list');
    Route::post('/delete-user', [ActivateUserController::class, 'DeleteUser'])->name('delete-user');
    
    Route::post('/upload-excel', [UploadModelController::class, 'upload'])->name('upload-excel');
    Route::post('/upload-assesment-document', [UploadModelController::class, 'UploadAssesment'])->name('upload-assesment-excel');
    Route::post('/upload-supporting-document', [UploadModelController::class, 'UploadSupportingDoc'])->name('upload-supporting-excel');
    Route::delete('/delete-assesment-document/{id}', [UploadModelController::class, 'DeleteAssesment'])->name('delete-assesment-document');
    Route::delete('/delete-supporting-document/{id}', [UploadModelController::class, 'DeleteAssesmentSupporting'])->name('delete-supporting-document');

    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Audit Documents Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/audit-docs', [App\Http\Controllers\AuditDocumentsController::class, 'index'])->name('audit-docs.index');
    
    // API routes for folders - viewing and downloading available to all authenticated users
    Route::get('/api/audit-docs/folders/{folderId?}', [App\Http\Controllers\AuditDocumentsController::class, 'getFolderContents']);
    Route::get('/api/audit-docs/folders/{id}/download', [App\Http\Controllers\AuditDocumentsController::class, 'downloadFolder']);
    
    // API routes for files - viewing and downloading available to all authenticated users
    Route::get('/api/audit-docs/files/{id}/download', [App\Http\Controllers\AuditDocumentsController::class, 'downloadFile']);
    Route::post('/api/audit-docs/files/download', [App\Http\Controllers\AuditDocumentsController::class, 'downloadFiles']);
    
    // Routes that require management permissions (roles 0, 1)
    Route::middleware(['can:manage-audit-docs'])->group(function () {
        // Management routes for folders
        Route::post('/api/audit-docs/folders', [App\Http\Controllers\AuditDocumentsController::class, 'createFolder']);
        Route::put('/api/audit-docs/folders/{id}', [App\Http\Controllers\AuditDocumentsController::class, 'renameFolder']);
        Route::delete('/api/audit-docs/folders/{id}', [App\Http\Controllers\AuditDocumentsController::class, 'deleteFolder']);
        
        // Management routes for files
        Route::post('/api/audit-docs/files', [App\Http\Controllers\AuditDocumentsController::class, 'uploadFiles']);
        Route::put('/api/audit-docs/files/{id}', [App\Http\Controllers\AuditDocumentsController::class, 'renameFile']);
        Route::delete('/api/audit-docs/files', [App\Http\Controllers\AuditDocumentsController::class, 'deleteFiles']);
    });
});

require __DIR__.'/auth.php';
