# Robust File Upload System

## Overview
This system provides a comprehensive, robust file upload solution for large files, multiple files, and reliable uploads with error handling and recovery.

## Features

### 🚀 Core Features
- **Chunked Upload**: Large files are automatically split into chunks for reliable transfer
- **Multiple File Support**: Upload multiple files simultaneously
- **Progress Tracking**: Real-time upload progress for each file
- **Automatic Retry**: Failed chunks are automatically retried
- **File Validation**: Type, size, and format validation before upload
- **Drag & Drop**: Modern drag-and-drop interface
- **Temporary File Cleanup**: Automatic cleanup of temporary files

### 📁 File Support
- **Maximum File Size**: 50MB per file (configurable)
- **Multiple Files**: Up to 20 files per upload (configurable)
- **Supported Types**: PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG, GIF, TXT
- **Chunk Size**: 1MB chunks for optimal performance

### 🔧 Technical Features
- **Laravel Service**: Centralized `FileUploadService` for all upload operations
- **React Component**: `RobustFileUpload` component for frontend
- **Error Handling**: Comprehensive error logging and user feedback
- **Memory Optimization**: Efficient memory usage for large files
- **Security**: File type validation and secure storage

## Implementation

### Backend Components

#### 1. FileUploadService (`app/Services/FileUploadService.php`)
```php
// Upload single file
$result = $fileUploadService->uploadSingleFile($file, 'directory', $options);

// Upload multiple files
$results = $fileUploadService->uploadMultipleFiles($files, 'directory', $options);

// Cleanup temporary files
$cleaned = $fileUploadService->cleanupTempFiles(24); // 24 hours old
```

#### 2. Upload Configuration (`config/upload.php`)
```php
'max_file_size' => 50 * 1024 * 1024, // 50MB
'chunk_size' => 1024 * 1024, // 1MB
'max_files' => 20,
'allowed_extensions' => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif']
```

#### 3. PHP Configuration (`.htaccess`)
```apache
php_value upload_max_filesize 50M
php_value post_max_size 55M
php_value max_file_uploads 20
php_value memory_limit 256M
php_value max_execution_time 300
```

### Frontend Components

#### 1. RobustFileUpload Component
```jsx
<RobustFileUpload
    endpoint="/api/upload/test"
    onSuccess={handleSuccess}
    onError={handleError}
    multiple={true}
    maxFiles={10}
    maxFileSize={50 * 1024 * 1024}
    acceptedTypes="image/*,application/pdf,.xlsx,.xls"
/>
```

#### 2. Features
- Drag and drop interface
- File validation before upload
- Progress bars for each file
- Error handling and retry
- Upload queue management

## Usage Examples

### 1. Controller Integration
```php
public function uploadDocuments(Request $request)
{
    try {
        $files = $request->file('files');
        $results = $this->fileUploadService->uploadMultipleFiles(
            $files,
            'documents',
            [
                'max_file_size' => 50 * 1024 * 1024,
                'allowed_extensions' => ['pdf', 'doc', 'docx'],
            ]
        );
        
        return response()->json($results);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
```

### 2. React Component Usage
```jsx
import RobustFileUpload from '@/Components/RobustFileUpload';

function DocumentUpload() {
    const handleSuccess = (results) => {
        console.log('Upload successful:', results);
        // Update UI state
    };

    const handleError = (error) => {
        console.error('Upload failed:', error);
        // Show error message
    };

    return (
        <RobustFileUpload
            endpoint="/api/upload/documents"
            onSuccess={handleSuccess}
            onError={handleError}
            multiple={true}
            maxFiles={5}
            acceptedTypes=".pdf,.doc,.docx"
        />
    );
}
```

## Maintenance

### 1. Automatic Cleanup
The system includes automatic cleanup of temporary files:

```bash
# Manual cleanup
php artisan cleanup:temp-files

# Scheduled cleanup (runs hourly)
# Added to routes/console.php
Schedule::command('cleanup:temp-files')->hourly()->withoutOverlapping();
```

### 2. Monitoring
- Check `storage/logs/laravel.log` for upload errors
- Monitor `storage/app/temp/` for temporary file accumulation
- Review upload performance in browser developer tools

## Testing

### Upload Test Page
Visit `/upload-test` to access the comprehensive upload testing interface:

- **Single File Mode**: Test individual file uploads
- **Multiple File Mode**: Test batch uploads
- **Large File Mode**: Test uploads up to 50MB
- **Progress Monitoring**: Watch real-time upload progress
- **Error Testing**: Simulate and handle upload failures

## Configuration

### Environment Variables
Add to your `.env` file:
```env
UPLOAD_MAX_FILE_SIZE=52428800  # 50MB in bytes
UPLOAD_CHUNK_SIZE=1048576      # 1MB in bytes
UPLOAD_MAX_FILES=20
UPLOAD_TMP_DIR=storage/app/temp
```

### Server Requirements
- PHP 8.0+
- Laravel 11+
- Adequate disk space for temporary files
- Proper file permissions on storage directories

## Security Considerations

1. **File Type Validation**: All files are validated against allowed extensions
2. **Size Limits**: File size limits prevent abuse
3. **Secure Storage**: Files stored outside public directory
4. **Temporary Cleanup**: Automatic cleanup prevents disk space issues
5. **Error Logging**: All upload attempts are logged

## Performance Optimization

1. **Chunked Uploads**: Large files split into manageable chunks
2. **Memory Efficiency**: Minimal memory usage during upload
3. **Concurrent Processing**: Multiple files can be processed simultaneously
4. **Progress Feedback**: Real-time progress prevents user confusion
5. **Retry Logic**: Failed uploads automatically retry

## Troubleshooting

### Common Issues

1. **File Too Large**: Check PHP configuration and server limits
2. **Upload Timeout**: Increase `max_execution_time` and `max_input_time`
3. **Memory Issues**: Increase `memory_limit` in PHP configuration
4. **Disk Space**: Ensure adequate storage space
5. **Permissions**: Check file permissions on storage directories

### Error Messages
- `File size exceeds maximum allowed size`: Increase file size limits
- `Invalid file type`: Check allowed extensions configuration
- `Upload timeout`: Increase PHP execution time limits
- `Insufficient disk space`: Clean up storage or add more space
- `Permission denied`: Fix file/directory permissions

## Future Enhancements

1. **Resume Upload**: Support for resuming interrupted uploads
2. **Cloud Storage**: Integration with AWS S3, Google Cloud, etc.
3. **Image Processing**: Automatic image optimization and thumbnails
4. **Virus Scanning**: Integration with antivirus scanning
5. **Upload Analytics**: Detailed upload statistics and monitoring
