import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function UploadModelsList() {
    const { uploadModelsByType, totalTypes, flash } = usePage().props;

    const [searchTerm, setSearchTerm] = useState('');

    // Get all assessment types
    const assessmentTypes = uploadModelsByType ? Object.keys(uploadModelsByType) : [];

    // Handle view details for a specific type
    const handleViewType = (type) => {
        const modelsOfType = uploadModelsByType[type];
        if (modelsOfType && modelsOfType.length > 0) {
            Inertia.get(`/upload-models/${modelsOfType[0].id}`);
        }
    };

    // Handle delete for a specific type
    const handleDelete = (e, type) => {
        e.stopPropagation();
        const modelsOfType = uploadModelsByType[type];
        const questionCount = modelsOfType ? modelsOfType.length : 0;
        
        if (confirm(`Are you sure you want to delete the assessment tool "${type}"?\n\nThis will permanently delete:\n• ${questionCount} questions\n• All risk rating data\n• All overall rating data\n• Any related assessment drafts\n\nThis action cannot be undone.`)) {
            // Find any model of this type to get its ID for deletion
            if (modelsOfType && modelsOfType.length > 0) {
                Inertia.delete(`/upload-models/${modelsOfType[0].id}`, {
                    onSuccess: () => {
                        console.log('Upload models deleted successfully');
                    },
                    onError: () => {
                        alert('Error deleting upload models');
                    }
                });
            }
        }
    };

    // Handle upload new Excel
    const handleUploadNew = () => {
        Inertia.get('/upload-models/create');
    };

    // Filter types based on search
    const filteredTypes = assessmentTypes.filter(type =>
        type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                    <h2 className="text-2xl font-bold">Tools Management</h2>
                    <p className="mt-1 text-indigo-100">Manage uploaded Excel files by assessment type</p>
                </div>
                
                <div className="p-6">
                    {/* Flash Messages */}
                    {flash?.error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{flash.error}</p>
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
                                    <h3 className="text-sm font-medium text-green-800">Success</h3>
                                    <div className="mt-2 text-sm text-green-700">
                                        <p>{flash.success}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <button
                            onClick={handleUploadNew}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-lg transition-all duration-200 hover:from-emerald-600 hover:to-green-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                            </svg>
                            Upload New Tool
                        </button>
                        <button
                            onClick={() => Inertia.get('/assesment')}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg transition-all duration-200 hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Back to Assessments
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by assessment type..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Assessment Types Grid */}
                    {filteredTypes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTypes.map((type) => {
                                const modelsOfType = uploadModelsByType[type];
                                const modelCount = modelsOfType ? modelsOfType.length : 0;
                                const latestModel = modelsOfType && modelsOfType.length > 0 ? modelsOfType[0] : null;

                                return (
                                    <div 
                                        key={type}
                                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                        onClick={() => handleViewType(type)}
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900">{type}</h3>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {modelCount} questions
                                                </span>
                                            </div>
                                            
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex justify-between">
                                                    <span>Questions:</span>
                                                    <span className="font-medium">{modelCount}</span>
                                                </div>
                                                {latestModel && (
                                                    <div className="flex justify-between">
                                                        <span>Last Updated:</span>
                                                        <span className="font-medium">
                                                            {new Date(latestModel.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                                                <button
                                                    onClick={() => handleViewType(type)}
                                                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                                                >
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(e, type)}
                                                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No upload models found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm ? 'No assessment types match your search.' : 'Get started by uploading a new Excel file.'}
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={handleUploadNew}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                    Upload Excel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Summary */}
                    {totalTypes > 0 && (
                        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>Total Assessment Types: <span className="font-medium text-gray-900">{totalTypes}</span></span>
                                <span>Total Models: <span className="font-medium text-gray-900">
                                    {Object.values(uploadModelsByType || {}).reduce((total, models) => total + models.length, 0)}
                                </span></span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
