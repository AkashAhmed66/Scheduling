import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function UploadModelCreate() {
    const { user, flash } = usePage().props;

    const [uploadedFile, setUploadedFile] = useState(null);
    const [riskRatingData, setRiskRatingData] = useState([]);
    const [overallRatingData, setOverallRatingData] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Handle file upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setUploadedFile(file);
        setErrorMessage(''); // Clear any previous errors when a new file is selected
    };

    // Handle upload submission
    const handleUploadSubmit = () => {
        if (!uploadedFile) {
            alert('Please select a file first.');
            return;
        }

        if (riskRatingData.length === 0) {
            alert('Please add at least one risk rating.');
            return;
        }

        if (overallRatingData.length === 0) {
            alert('Please add at least one overall rating.');
            return;
        }

        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('riskRatingData', JSON.stringify(riskRatingData));
        formData.append('overallRatingData', JSON.stringify(overallRatingData));

        setIsUploading(true);
        setErrorMessage(''); // Clear any previous errors

        Inertia.post('/upload-models', formData, {
            onStart: () => {
                console.log('Uploading file...');
            },
            onFinish: () => {
                console.log('File upload finished.');
                setIsUploading(false);
            },
            onSuccess: () => {
                // Redirect to upload models list on success
                Inertia.get('/upload-models');
            },
            onError: (error) => {
                console.error('Error uploading file:', error);
                setIsUploading(false);
                
                // Check for specific error messages from validation or backend
                if (typeof error === 'object' && error.message) {
                    setErrorMessage(error.message);
                } else if (typeof error === 'string') {
                    setErrorMessage(error);
                } else {
                    setErrorMessage('Error uploading file. Please try again.');
                }
            }
        });
    };

    // Handle risk rating data
    const addRiskRating = () => {
        setRiskRatingData([...riskRatingData, { label: '', mark: '', color: '' }]);
    };

    const updateRiskRating = (index, field, value) => {
        const updated = [...riskRatingData];
        updated[index][field] = value;
        setRiskRatingData(updated);
    };

    const removeRiskRating = (index) => {
        const updated = riskRatingData.filter((_, i) => i !== index);
        setRiskRatingData(updated);
    };

    // Handle overall rating data
    const addOverallRating = () => {
        setOverallRatingData([...overallRatingData, { percentage: '', label: '', color: '' }]);
    };

    const updateOverallRating = (index, field, value) => {
        const updated = [...overallRatingData];
        updated[index][field] = value;
        setOverallRatingData(updated);
    };

    const removeOverallRating = (index) => {
        const updated = overallRatingData.filter((_, i) => i !== index);
        setOverallRatingData(updated);
    };

    return (
        <div className="w-full">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                    <h2 className="text-2xl font-bold">Upload Excel File</h2>
                    <p className="mt-1 text-indigo-100">Upload a new Excel file with rating data</p>
                </div>
                
                <div className="p-6">
                    {/* Flash Messages */}
                    {(flash?.error || errorMessage) && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Upload Error
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{flash?.error || errorMessage}</p>
                                    </div>
                                </div>
                                <div className="ml-auto pl-3">
                                    <div className="-mx-1.5 -my-1.5">
                                        <button
                                            type="button"
                                            onClick={() => setErrorMessage('')}
                                            className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                                        >
                                            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {flash?.success && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-green-800">
                                        Success
                                    </h3>
                                    <div className="mt-2 text-sm text-green-700">
                                        <p>{flash.success}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Back Button */}
                    <div className="mb-6">
                        <button
                            onClick={() => Inertia.get('/upload-models')}
                            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white font-medium rounded-lg transition-all duration-200 hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Back to Upload Tools
                        </button>
                    </div>

                    {/* File Upload Section */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Excel File</label>
                        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-700">
                                        <strong>Important:</strong> Before uploading, make sure the assessment type in your Excel file is unique. 
                                        If a tool with the same type already exists, you'll need to delete it first.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                        <span>Upload a file</span>
                                        <input 
                                            type="file" 
                                            accept=".xls,.xlsx" 
                                            onChange={handleFileUpload}
                                            className="sr-only" 
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">Excel files only (.xls, .xlsx)</p>
                            </div>
                        </div>
                        {uploadedFile && (
                            <div className="mt-2 text-sm text-gray-600">
                                Selected file: <span className="font-medium">{uploadedFile.name}</span>
                            </div>
                        )}
                    </div>

                    {/* Risk Rating Section */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-md font-semibold text-gray-800">Risk Rating Data</h4>
                            <button
                                onClick={addRiskRating}
                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Add Risk Rating
                            </button>
                        </div>
                        {riskRatingData.map((item, index) => (
                            <div key={index} className="grid grid-cols-4 gap-3 mb-3 p-3 border border-gray-200 rounded-md">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
                                    <input
                                        type="text"
                                        value={item.label}
                                        onChange={(e) => updateRiskRating(index, 'label', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter label"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Mark</label>
                                    <input
                                        type="text"
                                        value={item.mark}
                                        onChange={(e) => updateRiskRating(index, 'mark', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter mark"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                                    <input
                                        type="text"
                                        value={item.color}
                                        onChange={(e) => updateRiskRating(index, 'color', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter color"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={() => removeRiskRating(index)}
                                        className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                        {riskRatingData.length === 0 && (
                            <div className="text-center py-4 text-gray-500">
                                No risk ratings added yet. Click "Add Risk Rating" to get started.
                            </div>
                        )}
                    </div>

                    {/* Overall Rating Section */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-md font-semibold text-gray-800">Overall Rating Data</h4>
                            <button
                                onClick={addOverallRating}
                                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Add Overall Rating
                            </button>
                        </div>
                        {overallRatingData.map((item, index) => (
                            <div key={index} className="grid grid-cols-4 gap-3 mb-3 p-3 border border-gray-200 rounded-md">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Percentage</label>
                                    <input
                                        type="text"
                                        value={item.percentage}
                                        onChange={(e) => updateOverallRating(index, 'percentage', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter percentage"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
                                    <input
                                        type="text"
                                        value={item.label}
                                        onChange={(e) => updateOverallRating(index, 'label', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter label"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                                    <input
                                        type="text"
                                        value={item.color}
                                        onChange={(e) => updateOverallRating(index, 'color', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter color"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={() => removeOverallRating(index)}
                                        className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                        {overallRatingData.length === 0 && (
                            <div className="text-center py-4 text-gray-500">
                                No overall ratings added yet. Click "Add Overall Rating" to get started.
                            </div>
                        )}
                    </div>
                    
                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleUploadSubmit}
                            disabled={isUploading || !uploadedFile || riskRatingData.length === 0 || overallRatingData.length === 0}
                            className="px-6 py-3 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                </>
                            ) : (
                                'Upload Excel File'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
