<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Exception;

class FileUploadService
{
    protected $maxFileSize;
    protected $maxFiles;
    protected $allowedTypes;
    protected $uploadPaths;

    public function __construct()
    {
        $this->maxFileSize = config('upload.max_file_size', 50 * 1024 * 1024); // 50MB
        $this->maxFiles = config('upload.max_files', 10);
        $this->allowedTypes = config('upload.allowed_types', []);
        $this->uploadPaths = config('upload.paths', []);
    }

    /**
     * Upload multiple files with validation and error handling
     */
    public function uploadMultipleFiles(array $files, string $directory = 'uploads', array $options = []): array
    {
        $uploadedFiles = [];
        $errors = [];

        // Validate file count
        if (count($files) > $this->maxFiles) {
            throw new Exception("Too many files. Maximum allowed: {$this->maxFiles}");
        }

        foreach ($files as $index => $file) {
            try {
                $result = $this->uploadSingleFile($file, $directory, $options);
                $uploadedFiles[] = $result;
            } catch (Exception $e) {
                $errors[] = [
                    'file_index' => $index,
                    'filename' => $file->getClientOriginalName(),
                    'error' => $e->getMessage()
                ];
                Log::error("File upload failed", [
                    'file' => $file->getClientOriginalName(),
                    'error' => $e->getMessage()
                ]);
            }
        }

        if (!empty($errors) && empty($uploadedFiles)) {
            throw new Exception("All file uploads failed: " . json_encode($errors));
        }

        return [
            'uploaded_files' => $uploadedFiles,
            'errors' => $errors,
            'success_count' => count($uploadedFiles),
            'error_count' => count($errors)
        ];
    }

    /**
     * Upload a single file with robust validation
     */
    public function uploadSingleFile(UploadedFile $file, string $directory = 'uploads', array $options = []): array
    {
        // Validate file
        $this->validateFile($file, $options);

        // Generate unique filename
        $filename = $this->generateUniqueFilename($file, $options);

        // Determine storage path
        $storagePath = $this->getStoragePath($directory);

        // Ensure directory exists
        $this->ensureDirectoryExists($storagePath);

        try {
            // Upload file with retry mechanism
            $filePath = $this->uploadWithRetry($file, $storagePath, $filename);

            // Verify file was uploaded successfully
            $this->verifyUpload($filePath);

            return [
                'original_name' => $file->getClientOriginalName(),
                'stored_name' => $filename,
                'file_path' => $filePath,
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'extension' => $file->getClientOriginalExtension(),
                'uploaded_at' => now()->toISOString()
            ];

        } catch (Exception $e) {
            // Clean up any partial uploads
            $this->cleanupFailedUpload($storagePath . DIRECTORY_SEPARATOR . $filename);
            throw new Exception("Upload failed: " . $e->getMessage());
        }
    }

    /**
     * Validate uploaded file
     */
    protected function validateFile(UploadedFile $file, array $options = []): void
    {
        // Check if file upload was successful
        if (!$file->isValid()) {
            throw new Exception("File upload failed: " . $file->getErrorMessage());
        }

        // Check file size
        $maxSize = $options['max_size'] ?? $this->maxFileSize;
        if ($file->getSize() > $maxSize) {
            $maxSizeMB = round($maxSize / 1024 / 1024, 2);
            throw new Exception("File too large. Maximum size: {$maxSizeMB}MB");
        }

        // Check file extension
        $allowedExtensions = $options['allowed_extensions'] ?? [];
        if (!empty($allowedExtensions)) {
            $extension = strtolower($file->getClientOriginalExtension());
            if (!in_array($extension, $allowedExtensions)) {
                throw new Exception("File type not allowed. Allowed types: " . implode(', ', $allowedExtensions));
            }
        }

        // Check MIME type for additional security
        $this->validateMimeType($file);
    }

    /**
     * Validate MIME type for security
     */
    protected function validateMimeType(UploadedFile $file): void
    {
        $mimeType = $file->getMimeType();
        $extension = strtolower($file->getClientOriginalExtension());

        // Define safe MIME types for common extensions
        $safeMimeTypes = [
            'xlsx' => ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
            'xls' => ['application/vnd.ms-excel'],
            'pdf' => ['application/pdf'],
            'jpg' => ['image/jpeg'],
            'jpeg' => ['image/jpeg'],
            'png' => ['image/png'],
            'gif' => ['image/gif'],
            'doc' => ['application/msword'],
            'docx' => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            'txt' => ['text/plain'],
            'csv' => ['text/csv', 'text/plain'],
        ];

        if (isset($safeMimeTypes[$extension])) {
            if (!in_array($mimeType, $safeMimeTypes[$extension])) {
                throw new Exception("File content does not match extension. Possible security risk.");
            }
        }
    }

    /**
     * Generate unique filename with timestamp and random string
     */
    protected function generateUniqueFilename(UploadedFile $file, array $options = []): string
    {
        $prefix = $options['prefix'] ?? 'file';
        $timestamp = now()->format('YmdHis');
        $random = Str::random(8);
        $extension = $file->getClientOriginalExtension();

        return "{$prefix}_{$timestamp}_{$random}.{$extension}";
    }

    /**
     * Get full storage path
     */
    protected function getStoragePath(string $directory): string
    {
        return storage_path('app/public/' . $directory);
    }

    /**
     * Ensure directory exists with proper permissions
     */
    protected function ensureDirectoryExists(string $path): void
    {
        if (!file_exists($path)) {
            if (!mkdir($path, 0755, true)) {
                throw new Exception("Failed to create upload directory: {$path}");
            }
        }

        if (!is_writable($path)) {
            throw new Exception("Upload directory is not writable: {$path}");
        }
    }

    /**
     * Upload file with retry mechanism for large files
     */
    protected function uploadWithRetry(UploadedFile $file, string $storagePath, string $filename, int $maxRetries = 3): string
    {
        $attempt = 0;
        $destinationPath = $storagePath . DIRECTORY_SEPARATOR . $filename;

        while ($attempt < $maxRetries) {
            try {
                $attempt++;

                // For large files, use chunked upload simulation
                if ($file->getSize() > 10 * 1024 * 1024) { // 10MB
                    $this->uploadLargeFile($file, $destinationPath);
                } else {
                    // Standard upload for smaller files
                    if (!$file->move($storagePath, $filename)) {
                        throw new Exception("Failed to move uploaded file");
                    }
                }

                return str_replace(storage_path('app/public/'), '', $destinationPath);

            } catch (Exception $e) {
                Log::warning("Upload attempt {$attempt} failed", [
                    'file' => $filename,
                    'error' => $e->getMessage()
                ]);

                if ($attempt >= $maxRetries) {
                    throw new Exception("Upload failed after {$maxRetries} attempts: " . $e->getMessage());
                }

                // Wait before retry (exponential backoff)
                usleep(pow(2, $attempt) * 100000); // 0.2s, 0.4s, 0.8s
            }
        }

        throw new Exception("Upload failed after maximum retries");
    }

    /**
     * Handle large file upload with progress tracking
     */
    protected function uploadLargeFile(UploadedFile $file, string $destinationPath): void
    {
        $sourceHandle = fopen($file->getPathname(), 'rb');
        $destHandle = fopen($destinationPath, 'wb');

        if (!$sourceHandle || !$destHandle) {
            throw new Exception("Failed to open file handles for large file upload");
        }

        try {
            $chunkSize = config('upload.chunk_size', 2 * 1024 * 1024); // 2MB chunks
            $totalBytes = 0;
            $fileSize = $file->getSize();

            while (!feof($sourceHandle)) {
                $chunk = fread($sourceHandle, $chunkSize);
                if ($chunk === false) {
                    throw new Exception("Failed to read file chunk");
                }

                $bytesWritten = fwrite($destHandle, $chunk);
                if ($bytesWritten === false) {
                    throw new Exception("Failed to write file chunk");
                }

                $totalBytes += $bytesWritten;

                // Optional: Log progress for very large files
                if ($fileSize > 50 * 1024 * 1024) { // 50MB
                    $progress = round(($totalBytes / $fileSize) * 100, 2);
                    Log::info("Large file upload progress: {$progress}%");
                }
            }

            if ($totalBytes !== $fileSize) {
                throw new Exception("File size mismatch after upload. Expected: {$fileSize}, Got: {$totalBytes}");
            }

        } finally {
            fclose($sourceHandle);
            fclose($destHandle);
        }
    }

    /**
     * Verify successful upload
     */
    protected function verifyUpload(string $relativePath): void
    {
        $fullPath = storage_path('app/public/' . $relativePath);

        if (!file_exists($fullPath)) {
            throw new Exception("Uploaded file not found after upload");
        }

        if (!is_readable($fullPath)) {
            throw new Exception("Uploaded file is not readable");
        }
    }

    /**
     * Clean up failed upload
     */
    protected function cleanupFailedUpload(string $filePath): void
    {
        try {
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        } catch (Exception $e) {
            Log::error("Failed to cleanup failed upload", [
                'file' => $filePath,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get upload progress for chunked uploads (placeholder for future implementation)
     */
    public function getUploadProgress(string $uploadId): array
    {
        // This would be implemented with session storage or cache
        // to track progress of chunked uploads
        return [
            'upload_id' => $uploadId,
            'progress' => 0,
            'status' => 'pending'
        ];
    }

    /**
     * Clean up old temporary files
     */
    public function cleanupTempFiles(int $olderThanHours = 24): int
    {
        $tempPath = storage_path('app/public/temp');
        $deletedCount = 0;

        if (!is_dir($tempPath)) {
            return 0;
        }

        $cutoffTime = now()->subHours($olderThanHours)->timestamp;

        $files = glob($tempPath . '/*');
        foreach ($files as $file) {
            if (is_file($file) && filemtime($file) < $cutoffTime) {
                if (unlink($file)) {
                    $deletedCount++;
                }
            }
        }

        Log::info("Cleaned up {$deletedCount} temporary files older than {$olderThanHours} hours");
        return $deletedCount;
    }
}
