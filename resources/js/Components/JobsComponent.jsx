import React, { useState, useMemo, useEffect } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { usePage } from '@inertiajs/react';  // Inertia.js hook
import { Inertia } from "@inertiajs/inertia";

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

export default function JobsComponent() {
  const { jobs, user } = usePage().props; // Get data from Inertia.js props
  const [data, setData] = useState([]); // Local state to store jobs data

  // Update data when jobs from props change
  useEffect(() => {
    if (jobs) {
      setData(jobs); // Set the received data to the local state
    }
  }, [jobs]);

  const handlePass = (id, status) => {
    Inertia.post("/pass-job", { id,
      status
    });
  };

  const columns = useMemo(
    () => [
      { Header: "Report No.", accessor: "reportNo" },
      { Header: "Factory Name", accessor: "factoryName" },
      { Header: "Factory Address", accessor: "factoryAddress" },
      { Header: "Job Status", accessor: "jobStatus" },
      { Header: "Request Type", accessor: "requestType" },
      { Header: "Client Name", accessor: "clientName" },
      { Header: "Start Date", accessor: "startDate" },
      { Header: "End Date", accessor: "endDate" },
      { Header: "Audit Start Date", accessor: "auditStartDate" },
      { Header: "Audit End Date", accessor: "auditEndDate" },
      { Header: "Staff Days", accessor: "staffDay" },
      { Header: "Remarks", accessor: "remarks" },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handlePass(row.original.id, 0)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Backward
            </button>
            <button
              onClick={() => handlePass(row.original.id, 1)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Forward
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
    const res = Inertia.get("/view-job/" + id);
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-center">Jobs Table</h2>
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
