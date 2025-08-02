import React from "react";

export default function BasicInformationSection({ formData, handleChange }) {
    return (
        <div className="mb-8 bg-white rounded-xl shadow-md border border-indigo-50">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-xl border-b border-indigo-100">
                <h2 className="text-xl font-bold text-indigo-700 flex items-center">
                    <svg
                        className="w-6 h-6 mr-2 text-indigo-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                    Basic Information
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Enter the fundamental details about this job
                </p>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Report No. */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <span>Report No.</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="reportNo"
                                value={formData.reportNo}
                                onChange={handleChange}
                                className={`w-full p-3 pl-10 border ${
                                    formData.reportNoError
                                        ? "border-red-500 ring-1 ring-red-500"
                                        : "border-gray-300"
                                } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                                placeholder="Enter report number"
                                required
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className={`h-5 w-5 ${
                                        formData.reportNoError
                                            ? "text-red-500"
                                            : "text-gray-400"
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    ></path>
                                </svg>
                            </div>
                            {formData.reportNoError && (
                                <div className="text-red-500 text-xs mt-1">
                                    Report No. is required
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Service Name */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <span>Service Name</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="serviceName"
                                value={formData.serviceName}
                                onChange={handleChange}
                                className={`w-full p-3 pl-10 border ${
                                    formData.serviceNameError
                                        ? "border-red-500 ring-1 ring-red-500"
                                        : "border-gray-300"
                                } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                                placeholder="Enter service name"
                                required
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className={`h-5 w-5 ${
                                        formData.serviceNameError
                                            ? "text-red-500"
                                            : "text-gray-400"
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    ></path>
                                </svg>
                            </div>
                            {formData.serviceNameError && (
                                <div className="text-red-500 text-xs mt-1">
                                    Service Name is required
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Request received date */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <span>Request Received Date</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                name="requestReceiveDate"
                                value={formData.requestReceiveDate}
                                onChange={handleChange}
                                className={`w-full p-3 pl-10 border ${
                                    formData.requestReceiveDateError
                                        ? "border-red-500 ring-1 ring-red-500"
                                        : "border-gray-300"
                                } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                                required
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className={`h-5 w-5 ${
                                        formData.requestReceiveDateError
                                            ? "text-red-500"
                                            : "text-gray-400"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            {formData.requestReceiveDateError && (
                                <div className="text-red-500 text-xs mt-1">
                                    Request Received Date is required
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Audit Due Date */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <span>Audit Due Date</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                name="auditDueDate"
                                value={formData.auditDueDate}
                                onChange={handleChange}
                                className={`w-full p-3 pl-10 border ${
                                    formData.auditDueDateError
                                        ? "border-red-500 ring-1 ring-red-500"
                                        : "border-gray-300"
                                } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                                required
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className={`h-5 w-5 ${
                                        formData.auditDueDateError
                                            ? "text-red-500"
                                            : "text-gray-400"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            {formData.auditDueDateError && (
                                <div className="text-red-500 text-xs mt-1">
                                    Audit Due Date is required
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Audit Start Date */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <span>Audit Start Date</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                name="auditStartDate"
                                value={formData.auditStartDate}
                                onChange={handleChange}
                                className={`w-full p-3 pl-10 border ${
                                    formData.auditStartDateError
                                        ? "border-red-500 ring-1 ring-red-500"
                                        : "border-gray-300"
                                } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                                required
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className={`h-5 w-5 ${
                                        formData.auditStartDateError
                                            ? "text-red-500"
                                            : "text-gray-400"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            {formData.auditStartDateError && (
                                <div className="text-red-500 text-xs mt-1">
                                    Audit Start Date is required
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Audit End Date */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <span>Audit End Date</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                name="auditEndDate"
                                value={formData.auditEndDate}
                                onChange={handleChange}
                                className={`w-full p-3 pl-10 border ${
                                    formData.auditEndDateError
                                        ? "border-red-500 ring-1 ring-red-500"
                                        : "border-gray-300"
                                } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                                required
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className={`h-5 w-5 ${
                                        formData.auditEndDateError
                                            ? "text-red-500"
                                            : "text-gray-400"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            {formData.auditEndDateError && (
                                <div className="text-red-500 text-xs mt-1">
                                    Audit End Date is required
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Job Type */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <span>Job Type</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="jobType"
                                value={formData.jobType}
                                onChange={handleChange}
                                className={`w-full p-3 pl-10 border ${
                                    formData.jobTypeError
                                        ? "border-red-500 ring-1 ring-red-500"
                                        : "border-gray-300"
                                } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                                placeholder="Assessment / Training / Advisory / Others"
                                required
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className={`h-5 w-5 ${
                                        formData.jobTypeError
                                            ? "text-red-500"
                                            : "text-gray-400"
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    ></path>
                                </svg>
                            </div>
                            {formData.jobTypeError && (
                                <div className="text-red-500 text-xs mt-1">
                                    Job Type is required
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Service Type */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Service Type
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={handleChange}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Onsite / Desktop / Virtual / Hybrid"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Service Scope */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Service Scope
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="serviceScope"
                                value={formData.serviceScope}
                                onChange={handleChange}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Initial / Follow-up / Annual"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Type */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Schedule Type
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="scheduleType"
                                value={formData.scheduleType}
                                onChange={handleChange}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Announced / Semi-Announced / Unannounced"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Office Country */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Office Country
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="officeCountry"
                                value={formData.officeCountry}
                                onChange={handleChange}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Enter office country"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Client Shadowing */}
                <div className="mt-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center">
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <span>Client Shadowing</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                    </div>
                    <div className="mt-3 space-y-2">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="clientShadowingYes"
                                    name="clientShadowing"
                                    value="yes"
                                    checked={formData.clientShadowing === "yes"}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <label htmlFor="clientShadowingYes" className="ml-2 text-sm text-gray-700">
                                    Yes
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="clientShadowingNo"
                                    name="clientShadowing"
                                    value="no"
                                    checked={formData.clientShadowing === "no"}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <label htmlFor="clientShadowingNo" className="ml-2 text-sm text-gray-700">
                                    No
                                </label>
                            </div>
                        </div>
                        {formData.clientShadowingError && (
                            <div className="text-red-500 text-xs mt-1">
                                Client Shadowing selection is required
                            </div>
                        )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        Select whether the client will be shadowing during the audit process
                    </p>
                </div>

                {/* Remarks */}
                <div className="mt-6 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        <span>Remarks</span>
                    </label>
                    <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Add any relevant notes here..."
                    ></textarea>
                </div>

                {/* Review Section */}
                <div className="mt-8">
                    <div className="flex items-center mb-4 border-b border-gray-200 pb-2">
                        <svg
                            className="w-5 h-5 mr-2 text-indigo-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            ></path>
                        </svg>
                        <h3 className="text-lg font-semibold text-indigo-600">
                            Review Process
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center">
                                <span>Date Report Sent to QA</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="dateReportSentToQA"
                                    value={formData.dateReportSentToQA}
                                    onChange={handleChange}
                                    className={`w-full p-3 pl-10 border ${
                                        formData.dateReportSentToQAError
                                            ? "border-red-500 ring-1 ring-red-500"
                                            : "border-gray-300"
                                    } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className={`h-5 w-5 ${
                                            formData.dateReportSentToQAError
                                                ? "text-red-500"
                                                : "text-gray-400"
                                        }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center">
                                <span>Date Report Sent to Client</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="finalReportSentToClient"
                                    value={formData.finalReportSentToClient}
                                    onChange={handleChange}
                                    className={`w-full p-3 pl-10 border ${
                                        formData.finalReportSentToClientError
                                            ? "border-red-500 ring-1 ring-red-500"
                                            : "border-gray-300"
                                    } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className={`h-5 w-5 ${
                                            formData.finalReportSentToClientError
                                                ? "text-red-500"
                                                : "text-gray-400"
                                        }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
