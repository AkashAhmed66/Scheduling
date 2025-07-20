import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function AssessmentsList() {
    const { question, user, assesments } = usePage().props;

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Adjust the number of items per page
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [riskRatingData, setRiskRatingData] = useState([]);
    const [overallRatingData, setOverallRatingData] = useState([]);

    // Filter assessments based on search input
    const filteredAssessments = assesments.filter(assessment =>
        assessment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.searchId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination range
    const totalPages = Math.ceil(filteredAssessments.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAssessments.slice(indexOfFirstItem, indexOfLastItem);

    // Handle row click
    const onRowClick = (assessment) => {
        console.log(assessment);
        const res = Inertia.get("/perform-audit/" + assessment.id);
    };

    // Handle page change
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Handle file upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setUploadedFile(file);
    };

    // Handle upload submission
    const handleUploadSubmit = () => {
        if (!uploadedFile) {
            alert('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('riskRatingData', JSON.stringify(riskRatingData));
        formData.append('overallRatingData', JSON.stringify(overallRatingData));

        console.log('Uploading file:', formData);
        console.log('Risk Rating Data:', riskRatingData);
        console.log('Overall Rating Data:', overallRatingData);

        Inertia.post('/upload-excel', formData, {
            onStart: () => {
                console.log('Uploading file...');
            },
            onFinish: () => {
                console.log('File upload finished.');
                setIsModalOpen(false);
                setUploadedFile(null);
                setRiskRatingData([]);
                setOverallRatingData([]);
            },
            onError: (error) => {
                console.error('Error uploading file:', error);
            }
        });
    };

    // Close modal and reset state
    const handleModalClose = () => {
        setIsModalOpen(false);
        setUploadedFile(null);
        setRiskRatingData([]);
        setOverallRatingData([]);
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
        <div>
            <div className="w-full">
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                        <h2 className="text-2xl font-bold">Assessments</h2>
                        <p className="mt-1 text-indigo-100">View and manage audit assessments</p>
                    </div>
                    
                    <div className="p-6">
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            {user.role == '0' && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-lg transition-all duration-200 hover:from-emerald-600 hover:to-green-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                                    </svg>
                                    Upload Excel
                                </button>
                            )}
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
                                placeholder="Search by type or search ID..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto shadow-md rounded-lg">
                            <table className="w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Search ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created At</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Updated At</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentItems.length > 0 ? (
                                        currentItems.map((assessment) => (
                                            <tr 
                                                key={assessment.id} 
                                                className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                                onClick={() => onRowClick(assessment)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{assessment.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{assessment.type}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{assessment.searchId}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(assessment.created_at).toLocaleString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(assessment.updated_at).toLocaleString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                                <div className="py-8">
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                                    </svg>
                                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No assessments found</h3>
                                                    <p className="mt-1 text-sm text-gray-500">There are no assessments matching your search criteria.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-center items-center mt-6">
                            <button 
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                                Previous
                            </button>
                            <span className="px-4 py-2 mx-2 text-sm text-gray-700">
                                Page {currentPage} of {totalPages || 1}
                            </span>
                            <button 
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages || totalPages === 0}
                            >
                                Next
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Upload Excel File with Rating Data</h3>
                            <button 
                                onClick={handleModalClose}
                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* File Upload Section */}
                        <div className="mt-4 mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Excel File</label>
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
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleModalClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUploadSubmit}
                                className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
