import React, { useState, useEffect } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

// Search component
function GlobalFilter({ filter, setFilter }) {
  return (
    <div className="mb-4">
      <input
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search..."
        className="p-2 border border-gray-300 rounded w-full"
      />
    </div>
  );
}

export default function TistoryComponent() {
  const { job, assesmentDocuments, history } = usePage().props;
  // State to store the table data
  const [factoryHistory, setFactoryHistory] = useState(history);

  const columns = [
    { Header: "Report No.", accessor: "reportNo" },
    { Header: "Factory", accessor: "factory" },
    { Header: "Location", accessor: "location" },
    { Header: "Service", accessor: "service" },
    { Header: "Staff Days", accessor: "staffDays" },
    { Header: "Job Status", accessor: "jobStatus" },
    { Header: "Request Received On", accessor: "requestReceivedOn" },
    { Header: "Audit Start Date", accessor: "auditStartDate" },
    { Header: "Audit End Date", accessor: "auditEndDate" },
    { Header: "Audit Due Date", accessor: "auditDueDate" },
    { Header: "Client Name", accessor: "clientName" },
    { Header: "Field Staff", accessor: "fieldStaff" },
  ];

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
      data: factoryHistory,
    },
    useGlobalFilter,
    usePagination
  );

  const { globalFilter, pageIndex } = state;

  const handleReportClick = (id) => {
    // alert(`You clicked on report: ${reportNo}`);
    Inertia.get("/view-job/" + id);
    // You can replace the alert with routing or other actions.
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-center">Factory History</h2>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full border-collapse border border-gray-300">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="bg-blue-500 text-white">
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="border border-gray-300 px-4 py-2"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="even:bg-gray-100 odd:bg-white">
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className={`border border-gray-300 px-4 py-2 ${cell.column.id === "reportNo" ? "cursor-pointer text-blue-500 hover:underline" : ""}`}
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
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
