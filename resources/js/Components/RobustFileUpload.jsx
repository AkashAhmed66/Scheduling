import React, { useState, useRef } from 'react';

export default function RobustFileUpload({ 
    onFilesSelected, 
    maxFiles = 10, 
    maxFileSize = 50 * 1024 * 1024, // 50MB
    allowedTypes = ['pdf', 'doc', 'docx', 'xlsx', 'xls', 'jpg', 'jpeg', 'png'],
    multiple = true,
    disabled = false,
    className = ""
}) {
    const [dragActive, setDragActive] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [errors, setErrors] = useState([]);
    const fileInputRef = useRef(null);

    const validateFile = (file) => {
        const errors = [];
        
        // Check file size
        if (file.size > maxFileSize) {
            errors.push(`File "${file.name}" is too large. Maximum size: ${Math.round(maxFileSize / 1024 / 1024)}MB`);
        }
        
        // Check file type
        const extension = file.name.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(extension)) {
            errors.push(`File "${file.name}" has invalid type. Allowed: ${allowedTypes.join(', ')}`);
        }
        
        return errors;
    };

    const validateFiles = (files) => {
        const fileArray = Array.from(files);
        let allErrors = [];
        
        // Check number of files
        if (fileArray.length > maxFiles) {
            allErrors.push(`Too many files selected. Maximum: ${maxFiles}`);
            return allErrors;
        }
        
        // Validate each file
        fileArray.forEach(file => {
            const fileErrors = validateFile(file);
            allErrors = [...allErrors, ...fileErrors];
        });
        
        return allErrors;
    };

    const handleFiles = (files) => {
        const fileArray = Array.from(files);
        const validationErrors = validateFiles(files);
        
        setErrors(validationErrors);
        
        if (validationErrors.length === 0) {
            // Initialize progress tracking
            const progress = {};
            fileArray.forEach((file, index) => {
                progress[`file_${index}`] = {
                    name: file.name,
                    progress: 0,
                    status: 'pending'
                };
            });
            setUploadProgress(progress);
            
            onFilesSelected(fileArray);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (disabled) return;
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (disabled) return;
        
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const onButtonClick = () => {
        if (disabled) return;
        fileInputRef.current?.click();
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const clearErrors = () => setErrors([]);
    const clearProgress = () => setUploadProgress({});

    return (
        <div className={`w-full ${className}`}>
            {/* Error Messages */}
            {errors.length > 0 && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Upload Errors</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <ul className="list-disc pl-5 space-y-1">
                                    {errors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="ml-auto pl-3">
                            <button
                                onClick={clearErrors}
                                className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100"
                            >
                                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Area */}
            <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                    dragActive
                        ? 'border-indigo-500 bg-indigo-50'
                        : disabled
                        ? 'border-gray-300 bg-gray-50'
                        : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple={multiple}
                    accept={allowedTypes.map(type => `.${type}`).join(',')}
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={disabled}
                />
                
                <div className="text-center">
                    <svg
                        className={`mx-auto h-12 w-12 ${
                            disabled ? 'text-gray-300' : 'text-gray-400'
                        }`}
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    
                    <div className="mt-4">
                        <button
                            onClick={onButtonClick}
                            disabled={disabled}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                                disabled
                                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                    : 'text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            }`}
                        >
                            {multiple ? 'Select files' : 'Select file'}
                        </button>
                        <p className="mt-1 text-sm text-gray-600">
                            or drag and drop {multiple ? 'files' : 'a file'} here
                        </p>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                        <p>Supported formats: {allowedTypes.join(', ')}</p>
                        <p>Maximum file size: {Math.round(maxFileSize / 1024 / 1024)}MB</p>
                        {multiple && <p>Maximum files: {maxFiles}</p>}
                    </div>
                </div>
            </div>

            {/* Upload Progress */}
            {Object.keys(uploadProgress).length > 0 && (
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-900">Upload Progress</h4>
                        <button
                            onClick={clearProgress}
                            className="text-xs text-gray-500 hover:text-gray-700"
                        >
                            Clear
                        </button>
                    </div>
                    
                    {Object.entries(uploadProgress).map(([key, file]) => (
                        <div key={key} className="bg-gray-50 rounded-md p-3">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                <span className="text-xs text-gray-500">
                                    {file.status === 'completed' ? 'Complete' : 
                                     file.status === 'error' ? 'Error' : 
                                     `${file.progress}%`}
                                </span>
                            </div>
                            
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        file.status === 'completed' ? 'bg-green-500' :
                                        file.status === 'error' ? 'bg-red-500' :
                                        'bg-indigo-500'
                                    }`}
                                    style={{ width: `${file.progress}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
