import React, { useMemo, useState, useLayoutEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';

// Global filter component for the table search
function GlobalFilter({ globalFilter, setGlobalFilter }) {
  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
      </div>
      <input
        value={globalFilter || ''}
        onChange={e => setGlobalFilter(e.target.value)}
        className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Search..."
      />
    </div>
  );
}

export default function FactoryHistoryComponent() {
  // Get the job history data passed from the backend
  const { factoryHistory, history } = usePage().props;
  
  // Use history if factoryHistory is not available
  const historyData = factoryHistory || history || [];

  // Define table columns
  const columns = useMemo(
    () => [
      {
        Header: 'Report No',
        accessor: 'reportNo',
      },
      {
        Header: 'Factory',
        accessor: 'factoryName',
      },
      {
        Header: 'Location',
        accessor: 'factoryCountry',
      },
      {
        Header: 'Service',
        accessor: 'jobType',
      },
      {
        Header: 'Staff Days',
        accessor: 'staffDays',
      },
      {
        Header: 'Job Status',
        accessor: 'jobStatus',
      },
      {
        Header: 'Date Request Received',
        accessor: 'dateRequestReceived',
      },
      {
        Header: 'Audit Due Date',
        accessor: 'auditDueDate',
      },
      {
        Header: 'Audit Start Date',
        accessor: 'auditStartDate',
      },
      {
        Header: 'Audit End Date',
        accessor: 'auditEndDate',
      },
      {
        Header: 'Date Report Sent To QA',
        accessor: 'dateReportSentToQA',
      },
      {
        Header: 'Final Report Sent To Client',
        accessor: 'finalReportSentToClient',
      },
    ],
    []
  );

  // Early return if no history data is available
  if (!historyData || historyData.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-lg mb-4 shadow-md">Factory History</h3>
        <div className="py-8 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-indigo-50 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">No History Available</h4>
          <p className="text-gray-500 max-w-md mx-auto">
            There is no factory history available for this job yet. History will be shown here once the job has been completed.
          </p>
        </div>
      </div>
    );
  }

  // Create table instance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    prepareRow,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: historyData,
      initialState: { pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { pageIndex, globalFilter } = state;

  // State for window width for responsive column display
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Update window width on resize
  useLayoutEffect(() => {
    function updateWidth() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Determine visible columns based on screen width
  const getVisibleColumns = () => {
    if (windowWidth < 640) {
      return ['reportNo', 'factoryName', 'jobStatus']; // Mobile view - show minimal columns
    } else if (windowWidth < 1024) {
      return ['reportNo', 'factoryName', 'factoryCountry', 'jobType', 'jobStatus', 'auditStartDate']; // Tablet view
    }
    return columns.map(column => column.accessor); // Desktop view - show all columns
  };

  const visibleColumns = getVisibleColumns();

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-lg mb-4 shadow-md">Factory History</h3>
      
      <GlobalFilter
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => {
                  if (visibleColumns.includes(column.id)) {
                    return (
                      <th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          {column.render('Header')}
                          <span>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                              ) : (
                                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                                </svg>
                              )
                            ) : (
                              ''
                            )}
                          </span>
                        </div>
                      </th>
                    )
                  }
                  return null;
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="bg-white border-b hover:bg-gray-50">
                  {row.cells.map(cell => {
                    if (visibleColumns.includes(cell.column.id)) {
                      return <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cell.render('Cell')}</td>
                    }
                    return null;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Showing page {pageIndex + 1} of {pageOptions.length}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className={`px-3 py-1 text-sm rounded-md ${
              !canPreviousPage
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className={`px-3 py-1 text-sm rounded-md ${
              !canNextPage
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
