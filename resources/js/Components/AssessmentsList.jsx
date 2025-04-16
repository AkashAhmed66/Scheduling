import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function AssessmentsList() {
    const { question, user, assesments } = usePage().props;

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Adjust the number of items per page

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

    return (
        <div className="overflow-x-auto p-4">
            <h1 className="text-xl font-bold mb-4">Assessments</h1>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by type or search ID..."
                className="mb-4 p-2 border rounded w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Table */}
            <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 border">ID</th>
                        <th className="px-4 py-2 border">Type</th>
                        <th className="px-4 py-2 border">Search ID</th>
                        <th className="px-4 py-2 border">Created At</th>
                        <th className="px-4 py-2 border">Updated At</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((assessment) => (
                            <tr 
                                key={assessment.id} 
                                className="hover:bg-gray-200 cursor-pointer"
                                onClick={() => onRowClick(assessment)}
                            >
                                <td className="px-4 py-2 border text-blue-600 underline">{assessment.id}</td>
                                <td className="px-4 py-2 border">{assessment.type}</td>
                                <td className="px-4 py-2 border">{assessment.searchId}</td>
                                <td className="px-4 py-2 border">{new Date(assessment.created_at).toLocaleString()}</td>
                                <td className="px-4 py-2 border">{new Date(assessment.updated_at).toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-4">No assessments available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-4">
                <button 
                    className="px-3 py-1 mx-1 border rounded bg-gray-200 hover:bg-gray-300"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                <span className="px-4">{currentPage} of {totalPages}</span>
                <button 
                    className="px-3 py-1 mx-1 border rounded bg-gray-200 hover:bg-gray-300"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
