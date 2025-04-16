import React from 'react';
import { usePage } from '@inertiajs/react';

export default function OverviewComponent() {
  // Get the job data passed from the backend
  const { job } = usePage().props;

  return (
    <div className="p-6">
      {/* Basic Information */}
      <section className="mb-6">
        <h3 className="text-xl font-semibold text-white bg-blue-600 p-3 rounded-md mb-2">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Job Type:</strong> {job.jobType}</p>
          <p><strong>Report No:</strong> {job.reportNo}</p>
          <p><strong>Request Type:</strong> {job.requestType}</p>
          <p><strong>Job Status:</strong> {job.jobStatus}</p>
          <p><strong>Office Country:</strong> {job.officeCountry}</p>
          <p><strong>Staff Days:</strong> {job.staffDays}</p>
          <p><strong>Client Shadow Audit:</strong> {job.isClientShadowAudit ? 'Yes' : 'No'}</p>
          <p><strong>Date Request Received:</strong> {job.dateRequestReceived}</p>
          <p><strong>Audit Due Date:</strong> {job.auditDueDate}</p>
          <p><strong>Audit Start Date:</strong> {job.auditStartDate}</p>
          <p><strong>Audit End Date:</strong> {job.auditEndDate}</p>
          <p><strong>Remarks:</strong> {job.remarks}</p>
          <p><strong>Date Report Sent to QA:</strong> {job.dateReportSentToQA}</p>
          <p><strong>Final Report Sent to Client:</strong> {job.finalReportSentToClient}</p>
        </div>
      </section>

      {/* Staff Role */}
      <section className="mb-6">
        <h3 className="text-xl font-semibold text-white bg-blue-600 p-3 rounded-md mb-2">Staff Role</h3>
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Role:</strong> {job.role}</p>
          <p><strong>User:</strong> {job.user}</p>
          <p><strong>Staff Day:</strong> {job.staffDay}</p>
          <p><strong>Start Date:</strong> {job.startDate}</p>
          <p><strong>End Date:</strong> {job.endDate}</p>
          <p><strong>Report Writer:</strong> {job.reportWriter ? 'Yes' : 'No'}</p>
          <p><strong>Note:</strong> {job.note}</p>
        </div>
      </section>

      {/* Contacts */}
      <section className="mb-6">
        <h3 className="text-xl font-semibold text-white bg-blue-600 p-3 rounded-md mb-2">Contacts</h3>

        {/* Client Section */}
        <h4 className="text-md font-semibold text-gray-600 text-center">Client</h4>
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Name:</strong> {job.clientName}</p>
          <p><strong>City:</strong> {job.clientCity}</p>
          <p><strong>Province:</strong> {job.clientProvince}</p>
          <p><strong>Country:</strong> {job.clientCountry}</p>
          <p><strong>Postal Code:</strong> {job.clientPostalCode}</p>
          <p><strong>Address:</strong> {job.clientAddress}</p>
          <p><strong>Tel:</strong> {job.clientTel}</p>
        </div>

        {/* Vendor Section */}
        <h4 className="text-md font-semibold text-gray-600 text-center mt-4">Vendor</h4>
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Name:</strong> {job.vendorName}</p>
          <p><strong>City:</strong> {job.vendorCity}</p>
          <p><strong>Province:</strong> {job.vendorProvince}</p>
          <p><strong>Country:</strong> {job.vendorCountry}</p>
          <p><strong>Postal Code:</strong> {job.vendorPostalCode}</p>
          <p><strong>Address:</strong> {job.vendorAddress}</p>
          <p><strong>Tel:</strong> {job.vendorTel}</p>
        </div>

        {/* Factory Section */}
        <h4 className="text-md font-semibold text-gray-600 text-center mt-4">Factory</h4>
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Name:</strong> {job.factoryName}</p>
          <p><strong>City:</strong> {job.factoryCity}</p>
          <p><strong>Province:</strong> {job.factoryProvince}</p>
          <p><strong>Country:</strong> {job.factoryCountry}</p>
          <p><strong>Postal Code:</strong> {job.factoryPostalCode}</p>
          <p><strong>Address:</strong> {job.factoryAddress}</p>
          <p><strong>Tel:</strong> {job.factoryTel}</p>
        </div>
      </section>

      {/* Additional Information */}
      <section>
        <h3 className="text-xl font-semibold text-white bg-blue-600 p-3 rounded-md mb-2">Additional Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Coordination:</strong> {job.coordination}</p>
          <p><strong>Auditors:</strong> {job.auditors}</p>
          <p><strong>Report Review:</strong> {job.reportReview}</p>
        </div>
      </section>
    </div>
  );
}
