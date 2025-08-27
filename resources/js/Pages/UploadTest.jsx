import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import RobustFileUpload from '@/Components/RobustFileUpload';

export default function UploadTest() {
    const [uploadResults, setUploadResults] = useState([]);
    const [testMode, setTestMode] = useState('single');

    const handleUploadSuccess = (results) => {
        setUploadResults(prev => [...prev, ...results]);
    };

    const handleUploadError = (error) => {
        console.error('Upload error:', error);
        setUploadResults(prev => [...prev, {
            name: 'Error',
            status: 'error',
            message: error.message
        }]);
    };

    const clearResults = () => {
        setUploadResults([]);
    };

    const getUploadConfig = () => {
        switch (testMode) {
            case 'multiple':
                return {
                    multiple: true,
                    maxFiles: 10,
                    acceptedTypes: 'image/*,application/pdf,.xlsx,.xls,.doc,.docx'
                };
            case 'large':
                return {
                    multiple: true,
                    maxFiles: 5,
                    maxFileSize: 50 * 1024 * 1024, // 50MB
                    acceptedTypes: '*'
                };
            default:
                return {
                    multiple: false,
                    maxFiles: 1,
                    acceptedTypes: 'image/*,application/pdf'
                };
        }
    };

    return (
        <>
            <Head title="Upload Test" />
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">File Upload Robustness Test</h1>
                
                {/* Test Mode Selector */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Test Mode
                    </label>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setTestMode('single')}
                            className={`px-4 py-2 rounded ${
                                testMode === 'single' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            Single File
                        </button>
                        <button
                            onClick={() => setTestMode('multiple')}
                            className={`px-4 py-2 rounded ${
                                testMode === 'multiple' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            Multiple Files
                        </button>
                        <button
                            onClick={() => setTestMode('large')}
                            className={`px-4 py-2 rounded ${
                                testMode === 'large' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            Large Files
                        </button>
                    </div>
                </div>

                {/* Upload Component */}
                <div className="mb-6">
                    <RobustFileUpload
                        endpoint="/api/upload/test"
                        onSuccess={handleUploadSuccess}
                        onError={handleUploadError}
                        {...getUploadConfig()}
                    />
                </div>

                {/* Results */}
                {uploadResults.length > 0 && (
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Upload Results</h2>
                            <button
                                onClick={clearResults}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Clear Results
                            </button>
                        </div>
                        <div className="space-y-2">
                            {uploadResults.map((result, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded border ${
                                        result.status === 'success'
                                            ? 'bg-green-50 border-green-200'
                                            : result.status === 'error'
                                            ? 'bg-red-50 border-red-200'
                                            : 'bg-yellow-50 border-yellow-200'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">{result.name}</p>
                                            {result.size && (
                                                <p className="text-sm text-gray-600">
                                                    Size: {(result.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            )}
                                            {result.path && (
                                                <p className="text-sm text-gray-600">
                                                    Path: {result.path}
                                                </p>
                                            )}
                                            {result.message && (
                                                <p className="text-sm text-gray-600">
                                                    {result.message}
                                                </p>
                                            )}
                                        </div>
                                        <span
                                            className={`px-2 py-1 text-xs rounded ${
                                                result.status === 'success'
                                                    ? 'bg-green-100 text-green-800'
                                                    : result.status === 'error'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        >
                                            {result.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Test Information */}
                <div className="mt-8 p-4 bg-gray-50 rounded">
                    <h3 className="font-semibold mb-2">Test Information</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Current Mode:</strong> {testMode}</p>
                        <p><strong>Multiple Files:</strong> {getUploadConfig().multiple ? 'Yes' : 'No'}</p>
                        <p><strong>Max Files:</strong> {getUploadConfig().maxFiles}</p>
                        <p><strong>Max File Size:</strong> {
                            getUploadConfig().maxFileSize 
                                ? `${(getUploadConfig().maxFileSize / 1024 / 1024).toFixed(0)} MB`
                                : '10 MB (default)'
                        }</p>
                        <p><strong>Accepted Types:</strong> {getUploadConfig().acceptedTypes}</p>
                    </div>
                </div>

                {/* Performance Tips */}
                <div className="mt-6 p-4 bg-blue-50 rounded">
                    <h3 className="font-semibold mb-2 text-blue-800">Performance Tips</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Large files are automatically chunked for reliable upload</li>
                        <li>• Failed chunks are automatically retried</li>
                        <li>• Upload progress is shown for each file</li>
                        <li>• Files are validated before upload starts</li>
                        <li>• Temporary files are cleaned up automatically</li>
                    </ul>
                </div>
            </div>
        </>
    );
}
