import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function UploadModelView() {
    const { uploadModel, riskRatings, overallRatings, uploadModelQuestions } = usePage().props;
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [questionFilter, setQuestionFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const toggleRowExpansion = (questionId) => {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(questionId)) {
            newExpandedRows.delete(questionId);
        } else {
            newExpandedRows.add(questionId);
        }
        setExpandedRows(newExpandedRows);
    };

    // Get unique categories for filter
    const uniqueCategories = uploadModelQuestions ? 
        [...new Set(uploadModelQuestions.map(q => q.category).filter(Boolean))] : [];

    // Filter questions based on search and category
    const filteredQuestions = uploadModelQuestions ? uploadModelQuestions.filter(question => {
        const matchesSearch = questionFilter === '' || 
            question.question?.toLowerCase().includes(questionFilter.toLowerCase()) ||
            question.ncref?.toLowerCase().includes(questionFilter.toLowerCase()) ||
            question.subcategory?.toLowerCase().includes(questionFilter.toLowerCase());
        
        const matchesCategory = categoryFilter === 'all' || question.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    }) : [];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const getTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'risk':
                return 'bg-red-100 text-red-800';
            case 'overall':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                    <h2 className="text-2xl font-bold">Tool Details</h2>
                    <p className="mt-1 text-indigo-100">View uploaded Excel file information and ratings</p>
                </div>
                
                <div className="p-6">
                    {/* Back Button */}
                    <div className="mb-6">
                        <button
                            onClick={() => Inertia.get('/upload-models')}
                            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white font-medium rounded-lg transition-all duration-200 hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Back to Tools
                        </button>
                    </div>

                    {/* Upload Model Information */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">File Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">File Name</label>
                                <p className="mt-1 text-sm text-gray-900">{uploadModel?.file_name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <div className="mt-1">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(uploadModel?.type)}`}>
                                        {uploadModel?.type}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Uploaded At</label>
                                <p className="mt-1 text-sm text-gray-900">{formatDate(uploadModel?.created_at)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">File Size</label>
                                <p className="mt-1 text-sm text-gray-900">{uploadModel?.file_size || 'N/A'}</p>
                            </div>
                        </div>
                        {uploadModel?.description && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <p className="mt-1 text-sm text-gray-900">{uploadModel.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Risk Rating Data */}
                    {riskRatings && riskRatings.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Rating Data</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mark</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {riskRatings.map((rating, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {rating.label}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {rating.mark}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {rating.color}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div 
                                                        className="w-8 h-8 rounded border"
                                                        style={{ backgroundColor: rating.color }}
                                                        title={`Color: ${rating.color}`}
                                                    ></div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Overall Rating Data */}
                    {overallRatings && overallRatings.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Overall Rating Data</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {overallRatings.map((rating, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {rating.percentage}%
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {rating.label}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {rating.color}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div 
                                                        className="w-8 h-8 rounded border"
                                                        style={{ backgroundColor: rating.color }}
                                                        title={`Color: ${rating.color}`}
                                                    ></div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Upload Model Questions */}
                    {uploadModelQuestions && uploadModelQuestions.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Assessment Questions ({filteredQuestions.length} of {uploadModelQuestions.length} questions)</h3>
                                <p className="text-sm text-gray-500 italic">Click on a row to expand for more details</p>
                            </div>
                            
                            {/* Filter Controls */}
                            <div className="flex flex-wrap gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1 min-w-64">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Search Questions</label>
                                    <input
                                        type="text"
                                        placeholder="Search by question, NC ref, or subcategory..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={questionFilter}
                                        onChange={(e) => setQuestionFilter(e.target.value)}
                                    />
                                </div>
                                <div className="min-w-48">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                    >
                                        <option value="all">All Categories</option>
                                        {uniqueCategories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                                {(questionFilter || categoryFilter !== 'all') && (
                                    <div className="flex items-end">
                                        <button
                                            onClick={() => {
                                                setQuestionFilter('');
                                                setCategoryFilter('all');
                                            }}
                                            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NC Ref</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategory</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mark</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredQuestions.map((question, index) => (
                                            <React.Fragment key={question.id}>
                                                <tr className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 cursor-pointer`} 
                                                    onClick={() => toggleRowExpansion(question.id)}>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {question.ncref}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {question.category}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {question.subcategory}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-900 max-w-md">
                                                        <div className="truncate" title={question.question}>
                                                            {question.question}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {question.mark}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <div 
                                                                className="w-6 h-6 rounded border mr-2"
                                                                style={{ backgroundColor: question.color }}
                                                                title={`Color: ${question.color}`}
                                                            ></div>
                                                            <span className="text-xs">{question.color}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center justify-between">
                                                            <span>{question.risk_rating}</span>
                                                            <svg 
                                                                className={`w-4 h-4 transform transition-transform ${expandedRows.has(question.id) ? 'rotate-180' : ''}`}
                                                                fill="none" 
                                                                stroke="currentColor" 
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                            </svg>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {expandedRows.has(question.id) && (
                                                    <tr className="bg-gray-100">
                                                        <td colSpan="7" className="px-4 py-4">
                                                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <h5 className="font-medium text-gray-900 mb-2">Answer</h5>
                                                                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                                                                            {question.answer || 'No answer provided'}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <h5 className="font-medium text-gray-900 mb-2">Legal Reference</h5>
                                                                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                                                                            {question.legal_ref || 'No legal reference provided'}
                                                                        </p>
                                                                    </div>
                                                                    <div className="md:col-span-2">
                                                                        <h5 className="font-medium text-gray-900 mb-2">Findings</h5>
                                                                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                                                                            {question.findings || 'No findings provided'}
                                                                        </p>
                                                                    </div>
                                                                    <div className="md:col-span-2">
                                                                        <h5 className="font-medium text-gray-900 mb-2">Recommendation</h5>
                                                                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                                                                            {question.recommendation || 'No recommendation provided'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                        {filteredQuestions.length === 0 && (
                                            <tr>
                                                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                                    <div className="flex flex-col items-center">
                                                        <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                        </svg>
                                                        <p className="text-sm">No questions match your current filters.</p>
                                                        <button
                                                            onClick={() => {
                                                                setQuestionFilter('');
                                                                setCategoryFilter('all');
                                                            }}
                                                            className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 underline"
                                                        >
                                                            Clear filters to see all questions
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* No Data Message */}
                    {(!riskRatings || riskRatings.length === 0) && (!overallRatings || overallRatings.length === 0) && (!uploadModelQuestions || uploadModelQuestions.length === 0) && (
                        <div className="text-center py-8">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No rating data found</h3>
                            <p className="mt-1 text-sm text-gray-500">This upload model doesn't have any associated rating data.</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            onClick={() => Inertia.get('/upload-models/create')}
                            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg transition-all duration-200 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
                        >
                            Upload New Excel
                        </button>
                        <button
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this upload model? This action cannot be undone.')) {
                                    Inertia.delete(`/upload-models/${uploadModel.id}`, {
                                        onSuccess: () => {
                                            Inertia.get('/upload-models');
                                        }
                                    });
                                }
                            }}
                            className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg transition-all duration-200 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
