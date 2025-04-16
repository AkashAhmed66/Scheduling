import React from 'react';
import { usePage } from '@inertiajs/react';

export default function OverviewComponent() {
  // Get the job data passed from the backend
  const { job } = usePage().props;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Basic Information */}
      <section className="mb-6">
        <h3 className="text-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-lg mb-4 shadow-md">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-sm">
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Job Type:</span> <span className="text-gray-800">{job.jobType}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Report No:</span> <span className="text-gray-800">{job.reportNo}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Request Type:</span> <span className="text-gray-800">{job.requestType}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Job Status:</span> <span className="text-gray-800">{job.jobStatus}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Office Country:</span> <span className="text-gray-800">{job.officeCountry}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Staff Days:</span> <span className="text-gray-800">{job.staffDays}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Client Shadow Audit:</span> <span className="text-gray-800">{job.isClientShadowAudit ? 'Yes' : 'No'}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Date Request Received:</span> <span className="text-gray-800">{job.dateRequestReceived}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Audit Due Date:</span> <span className="text-gray-800">{job.auditDueDate}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Audit Start Date:</span> <span className="text-gray-800">{job.auditStartDate}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Audit End Date:</span> <span className="text-gray-800">{job.auditEndDate}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Remarks:</span> <span className="text-gray-800">{job.remarks}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Date Report Sent to QA:</span> <span className="text-gray-800">{job.dateReportSentToQA}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Final Report Sent to Client:</span> <span className="text-gray-800">{job.finalReportSentToClient}</span></p>
        </div>
      </section>

      {/* Staff Role */}
      <section className="mb-6">
        <h3 className="text-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-lg mb-4 shadow-md">Staff Role</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-sm">
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Role:</span> <span className="text-gray-800">{job.role}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">User:</span> <span className="text-gray-800">{job.user}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Staff Day:</span> <span className="text-gray-800">{job.staffDay}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Start Date:</span> <span className="text-gray-800">{job.startDate}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">End Date:</span> <span className="text-gray-800">{job.endDate}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Report Writer:</span> <span className="text-gray-800">{job.reportWriter ? 'Yes' : 'No'}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Note:</span> <span className="text-gray-800">{job.note}</span></p>
        </div>
      </section>

      {/* Contacts */}
      <section className="mb-6">
        <h3 className="text-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-lg mb-4 shadow-md">Contacts</h3>

        {/* Client Section */}
        <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-md font-semibold text-indigo-700 border-b border-gray-200 pb-2 mb-3">Client</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Name:</span> <span className="text-gray-800">{job.clientName}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">City:</span> <span className="text-gray-800">{job.clientCity}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Province:</span> <span className="text-gray-800">{job.clientProvince}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Country:</span> <span className="text-gray-800">{job.clientCountry}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Postal Code:</span> <span className="text-gray-800">{job.clientPostalCode}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Address:</span> <span className="text-gray-800">{job.clientAddress}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Tel:</span> <span className="text-gray-800">{job.clientTel}</span></p>
          </div>
        </div>

        {/* Vendor Section */}
        <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-md font-semibold text-indigo-700 border-b border-gray-200 pb-2 mb-3">Vendor</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Name:</span> <span className="text-gray-800">{job.vendorName}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">City:</span> <span className="text-gray-800">{job.vendorCity}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Province:</span> <span className="text-gray-800">{job.vendorProvince}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Country:</span> <span className="text-gray-800">{job.vendorCountry}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Postal Code:</span> <span className="text-gray-800">{job.vendorPostalCode}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Address:</span> <span className="text-gray-800">{job.vendorAddress}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Tel:</span> <span className="text-gray-800">{job.vendorTel}</span></p>
          </div>
        </div>

        {/* Factory Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-md font-semibold text-indigo-700 border-b border-gray-200 pb-2 mb-3">Factory</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Name:</span> <span className="text-gray-800">{job.factoryName}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">City:</span> <span className="text-gray-800">{job.factoryCity}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Province:</span> <span className="text-gray-800">{job.factoryProvince}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Country:</span> <span className="text-gray-800">{job.factoryCountry}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Postal Code:</span> <span className="text-gray-800">{job.factoryPostalCode}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Address:</span> <span className="text-gray-800">{job.factoryAddress}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Tel:</span> <span className="text-gray-800">{job.factoryTel}</span></p>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section>
        <h3 className="text-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-lg mb-4 shadow-md">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-sm">
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Coordination:</span> <span className="text-gray-800">{job.coordination}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Auditors:</span> <span className="text-gray-800">{job.auditors}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Report Review:</span> <span className="text-gray-800">{job.reportReview}</span></p>
        </div>
      </section>
    </div>
  );
}
