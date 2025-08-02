import React, { useState, useMemo, useEffect } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { usePage } from '@inertiajs/react';  // Inertia.js hook
import { Inertia } from "@inertiajs/inertia";

// Search component
function GlobalFilter({ filter, setFilter }) {
  return (
    <div className="mb-6 relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <input
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search jobs..."
        className="bg-white w-full pl-10 p-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
      />
    </div>
  );
}

export default function JobsComponent() {
  const { jobs, user } = usePage().props; // Get data from Inertia.js props
  const [data, setData] = useState([]); // Local state to store jobs data

  // Update data when jobs from props change
  useEffect(() => {
    if (jobs) {
      console.log("Jobs data received:", jobs);
      setData(jobs); // Set the received data to the local state
    }
  }, [jobs]);

  const handlePass = (id, status) => {
    Inertia.post("/pass-job", { id, status });
  };

  // Function to check if user can perform forward/backward actions
  const canPerformAction = (jobStatus, userRole, actionType) => {
    const status = jobStatus?.toLowerCase();
    
    // Admin (0) and Coordinator (1) can always do both actions, except when job is completed/done
    if ((userRole === 0 || userRole === 1) && !['completed', 'done'].includes(status)) {
      // Coordinator cannot do anything when status is completed
      if (userRole === 1 && status === 'completed') {
        return false;
      }
      return true;
    }
    
    // Auditor (2) permissions
    if (userRole === 2) {
      // Can do actions when job is NOT in review status and NOT completed/done
      if (!['review', 'completed', 'done'].includes(status)) {
        return true;
      }
      // Can do actions when job is in 're-audit' status
      if (status === 're-audit') {
        return true;
      }
      return false;
    }
    
    // Reviewer (3) permissions
    if (userRole === 3) {
      // Can only do actions when job is in 'review' status
      return status === 'review';
    }
    
    return false;
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
        Cell: ({ row }) => {
          const jobStatus = row.original.jobStatus;
          const canForward = canPerformAction(jobStatus, user.role, 'forward');
          const canBackward = canPerformAction(jobStatus, user.role, 'backward');
          
          const getDisabledReason = (actionType) => {
            const status = jobStatus?.toLowerCase();
            const roleName = user.role === 0 ? 'Admin' : 
                           user.role === 1 ? 'Coordinator' : 
                           user.role === 2 ? 'Auditor' : 'Reviewer';
            
            if (['completed', 'done'].includes(status)) {
              return `Cannot ${actionType} - Job is ${status}`;
            }
            
            if (user.role === 2 && status === 'review') {
              return `Cannot ${actionType} - Job is in review (Reviewer only)`;
            }
            
            if (user.role === 3 && status !== 'review') {
              return `Cannot ${actionType} - Reviewers can only act on jobs in review status`;
            }
            
            return `${roleName} cannot ${actionType} job with status: ${jobStatus}`;
          };
          
          return (
            <div className="flex gap-2">
              {canBackward ? (
                <button
                  onClick={() => handlePass(row.original.id, 0)}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Backward
                </button>
              ) : (
                <button
                  disabled
                  title={getDisabledReason('move backward')}
                  className="bg-gray-300 text-gray-500 px-3 py-1.5 rounded-md text-sm font-medium cursor-not-allowed opacity-50"
                >
                  Backward
                </button>
              )}
              
              {canForward ? (
                <button
                  onClick={() => handlePass(row.original.id, 1)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm hover:from-green-600 hover:to-emerald-700 transition-all duration-200 hover:shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  Forward
                </button>
              ) : (
                <button
                  disabled
                  title={getDisabledReason('move forward')}
                  className="bg-gray-300 text-gray-500 px-3 py-1.5 rounded-md text-sm font-medium cursor-not-allowed opacity-50"
                >
                  Forward
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [user.role]
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
    const res = Inertia.get("/view-job/" + id);
  };

  return (
    <div className="min-h-screen">
      <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-3">
            <h2 className="text-2xl font-bold text-gray-800">Jobs Management</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Role:</span>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                user.role === 0 ? 'bg-purple-100 text-purple-800' :
                user.role === 1 ? 'bg-blue-100 text-blue-800' :
                user.role === 2 ? 'bg-green-100 text-green-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {user.role === 0 ? 'Admin' : 
                 user.role === 1 ? 'Coordinator' : 
                 user.role === 2 ? 'Auditor' : 'Reviewer'}
              </span>
            </div>
          </div>
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          <div className="overflow-x-auto rounded-lg shadow">
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
                          className={`px-4 py-3 whitespace-nowrap ${cell.column.id === "reportNo" ? "cursor-pointer hover:underline" : ""}`}
                          onClick={
                            cell.column.id === "reportNo" ? () => handleReportClick(row.original.id) : null
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
          <div className="flex justify-between items-center pt-4 mt-4 border-t">
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="flex items-center gap-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
              className="flex items-center gap-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
