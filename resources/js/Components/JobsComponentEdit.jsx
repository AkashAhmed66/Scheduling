import React, { useState, useMemo, useEffect } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { usePage } from '@inertiajs/react';  // Inertia.js hook
import { Inertia } from "@inertiajs/inertia";
import ConfirmationModal from './ConfirmationModal';

// Search component
function GlobalFilter({ filter, setFilter }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <input
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search jobs..."
        className="pl-10 py-3 px-4 block w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
      />
    </div>
  );
}

export default function JobsComponent() {
  const { jobs, user } = usePage().props; // Get data from Inertia.js props
  const [data, setData] = useState([]); // Local state to store jobs data
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    if (jobs) {
      setData(jobs); // Set the received data to the local state
    }
  }, [jobs]);

  const handlePass = (id, status) => {
    Inertia.post("/pass-job", { id, status });
  };

  const columns = useMemo(
    () => [
      { 
        Header: "Report No.", 
        accessor: "reportNo",
        Cell: ({ value }) => (
          <span className="text-indigo-600 hover:text-indigo-800 cursor-pointer">{value || 'N/A'}</span>
        )
      },
      { 
        Header: "Factory", 
        accessor: "factoryName",
        Cell: ({ value }) => (
          <span className="text-gray-700">{value || 'N/A'}</span>
        )
      },
      { 
        Header: "Factory Location", 
        accessor: (row) => `${row.factoryCity || ''}, ${row.factoryCountry || ''}`.replace(/^,\s*|,\s*$/g, '') || 'N/A',
        Cell: ({ value }) => (
          <span className="text-gray-700">{value}</span>
        )
      },
      { 
        Header: "Service Name", 
        accessor: "serviceName",
        Cell: ({ value }) => (
          <span className="text-gray-700">{value || 'N/A'}</span>
        )
      },
      { 
        Header: "Staff Day", 
        accessor: "totalStaffDays",
        Cell: ({ value }) => (
          <span className="text-gray-700">{value || 0}</span>
        )
      },
      { 
        Header: "Job Status", 
        accessor: "jobStatus", 
        Cell: ({ value }) => (
          <span className={`px-2 py-1 rounded-full ${
            value?.toLowerCase() === "completed" ? "bg-green-100 text-green-800" : 
            value?.toLowerCase() === "in progress" ? "bg-blue-100 text-blue-800" : 
            value?.toLowerCase() === "pending" ? "bg-yellow-100 text-yellow-800" : 
            value?.toLowerCase() === "review" ? "bg-purple-100 text-purple-800" :
            value?.toLowerCase() === "re-audit" ? "bg-red-100 text-red-800" :
            "bg-gray-100 text-gray-800"
          }`}>
            {value || 'N/A'}
          </span>
        )
      },
      { 
        Header: "Request Received Date", 
        accessor: "requestReceiveDate",
        Cell: ({ value }) => (
          <span className="text-gray-700">{value || 'N/A'}</span>
        )
      },
      { 
        Header: "Audit Start Date", 
        accessor: "auditStartDate",
        Cell: ({ value }) => (
          <span className="text-gray-700">{value || 'N/A'}</span>
        )
      },
      { 
        Header: "Audit End Date", 
        accessor: "auditEndDate",
        Cell: ({ value }) => (
          <span className="text-gray-700">{value || 'N/A'}</span>
        )
      },
      { 
        Header: "Audit Due Date", 
        accessor: "auditDueDate",
        Cell: ({ value }) => (
          <span className="text-gray-700">{value || 'N/A'}</span>
        )
      },
      { 
        Header: "Client Name", 
        accessor: "clientName",
        Cell: ({ value }) => (
          <span className="text-gray-700">{value || 'N/A'}</span>
        )
      },
      { 
        Header: "Field Staffs", 
        accessor: "fieldStaffNames",
        Cell: ({ value }) => (
          <div className="text-gray-700">
            {value && value.length > 0 ? (
              <ul className="space-y-1">
                {value.map((name, index) => (
                  <li key={index} className="text-gray-700">• {name}</li>
                ))}
              </ul>
            ) : (
              <span className="text-gray-700">No staff assigned</span>
            )}
          </div>
        )
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handlePass(row.original.id, 2)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-sm hover:from-green-600 hover:to-emerald-700 transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center"
            >
              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Complete
            </button>
            <button
              onClick={() => handleFiles(row.original.id)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-sm hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
            >
              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Files
            </button>
            <button
              onClick={() => handleEdit(row.original.id)}
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-sm hover:from-amber-500 hover:to-orange-600 transition-all duration-200 focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50 flex items-center"
            >
              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Edit
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-sm hover:from-red-600 hover:to-rose-700 transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center"
            >
              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data, // Use dynamic data here
    },
    useGlobalFilter,
    usePagination
  );

  const { globalFilter, pageIndex } = state;

  const handleReportClick = (id) => {
    Inertia.get("/view-job/" + id);
  };

  const handleEdit = (id) => {
    Inertia.get(`/edit-job/${id}`);
  };
  
  const handleFiles = (id) => {
    Inertia.get(`/add-files-job/${id}`);
  };

  const handleDelete = (id) => {
    setJobToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (jobToDelete) {
      Inertia.delete(`/delete-job/${jobToDelete}`);
    }
    setShowDeleteConfirm(false);
    setJobToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Jobs Management</h2>
              <button
                onClick={() => Inertia.get("/create-job")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md flex items-center font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create Job
              </button>
            </div>
            <div className="mb-6">
              <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table {...getTableProps()} className="w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        className="px-4 py-3 text-left text-xs font-medium tracking-wider text-white uppercase"
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="hover:bg-gray-50 transition-colors duration-150">
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className={`px-4 py-3 whitespace-nowrap ${
                            cell.column.id === "reportNo"
                              ? "cursor-pointer hover:underline"
                              : ""
                          }`}
                          onClick={
                            cell.column.id === "reportNo"
                              ? () => handleReportClick(row.original.id)
                              : null
                          }
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center p-5 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{pageIndex + 1}</span> of <span className="font-medium">{pageOptions.length}</span>
            </span>
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone."
        confirmButtonText="Delete Job"
        type="danger"
      />
    </div>
  );
}
