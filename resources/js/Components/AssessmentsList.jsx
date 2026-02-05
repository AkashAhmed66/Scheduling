import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function AssessmentsList() {
    const { question, user, assesments } = usePage().props;

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [assessmentToDelete, setAssessmentToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const itemsPerPage = 5; // Adjust the number of items per page

    // Filter assessments based on search input
    const filteredAssessments = assesments.filter(assessment =>
        assessment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.searchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (assessment.assessment_info?.report_no && assessment.assessment_info.report_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (assessment.job?.factoryName && assessment.job.factoryName.toLowerCase().includes(searchTerm.toLowerCase()))
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

    // Handle delete button click
    const handleDeleteClick = (e, assessment) => {
        e.stopPropagation(); // Prevent row click from triggering
        setAssessmentToDelete(assessment);
        setShowDeleteModal(true);
    };

    // Confirm delete
    const confirmDelete = async () => {
        if (!assessmentToDelete) return;
        
        setIsDeleting(true);
        try {
            await Inertia.delete(`/delete-assessment/${assessmentToDelete.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setAssessmentToDelete(null);
                },
                onError: (errors) => {
                    console.error('Delete failed:', errors);
                    alert('Failed to delete assessment. Please try again.');
                },
                onFinish: () => {
                    setIsDeleting(false);
                }
            });
        } catch (error) {
            console.error('Delete error:', error);
            setIsDeleting(false);
        }
    };

    // Cancel delete
    const cancelDelete = () => {
        setShowDeleteModal(false);
        setAssessmentToDelete(null);
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
                                    onClick={() => Inertia.get('/upload-models')}
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-lg transition-all duration-200 hover:from-emerald-600 hover:to-green-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                                    </svg>
                                    Manage Tools
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
                                placeholder="Search by type, search ID, report number, or factory name..."
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
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Report No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Factory</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ref ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created At</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Updated At</th>
                                        {user.role == '0' && (
                                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
                                        )}
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                                                    {assessment.assessment_info?.report_no || 'Not Set'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{assessment.type}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{assessment.job?.factoryName || 'Not Set'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{assessment.searchId}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(assessment.created_at).toLocaleString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(assessment.updated_at).toLocaleString()}</td>
                                                {user.role == '0' && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <button
                                                            onClick={(e) => handleDeleteClick(e, assessment)}
                                                            className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium rounded-md transition-all duration-200 hover:from-red-600 hover:to-red-700 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-sm hover:shadow-md"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                            </svg>
                                                            Delete
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={user.role == '0' ? "7" : "6"} className="px-6 py-4 text-center text-sm text-gray-500">
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

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div 
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                            aria-hidden="true"
                            onClick={cancelDelete}
                        ></div>

                        {/* Center modal */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Delete Assessment
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete this assessment? This action cannot be undone.
                                            </p>
                                            {assessmentToDelete && (
                                                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                                    <p className="text-sm font-medium text-gray-700">Assessment Details:</p>
                                                    <p className="text-xs text-gray-600 mt-1">Type: {assessmentToDelete.type}</p>
                                                    <p className="text-xs text-gray-600">Ref ID: {assessmentToDelete.searchId}</p>
                                                    <p className="text-xs text-gray-600">Report No: {assessmentToDelete.assessment_info?.report_no || 'Not Set'}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    disabled={isDeleting}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={confirmDelete}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </button>
                                <button
                                    type="button"
                                    disabled={isDeleting}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={cancelDelete}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
