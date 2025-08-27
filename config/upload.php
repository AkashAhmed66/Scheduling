<?php

return [
    /*
    |--------------------------------------------------------------------------
    | File Upload Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains various configuration settings for robust file uploads
    | including size limits, allowed file types, and chunked upload settings.
    |
    */

    'max_file_size' => env('MAX_FILE_SIZE', 50 * 1024 * 1024), // 50MB default
    'max_files' => env('MAX_FILES', 10), // Maximum number of files in one upload
    'chunk_size' => env('CHUNK_SIZE', 2 * 1024 * 1024), // 2MB chunks for large files
    
    'allowed_types' => [
        'excel' => ['xlsx', 'xls'],
        'documents' => ['pdf', 'doc', 'docx'],
        'images' => ['jpg', 'jpeg', 'png', 'gif'],
        'general' => ['txt', 'csv'],
    ],
    
    'paths' => [
        'assessment_documents' => 'assessment_documents',
        'supporting_documents' => 'supporting_documents',
        'profile_images' => 'images',
        'temp_uploads' => 'temp',
    ],
    
    'validation' => [
        'max_size_mb' => 50,
        'timeout_seconds' => 300, // 5 minutes
    ],
];
