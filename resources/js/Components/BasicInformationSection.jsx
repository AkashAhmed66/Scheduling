import React from 'react';

export default function BasicInformationSection({ formData, handleChange }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Basic Information</h2>
      
      <div className="grid grid-cols-3 gap-4">
        {/* General */}
        <div>
          <label className="block text-sm">Job Type</label>
          <input
            type="text"
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm">Report No.</label>
          <input
            type="text"
            name="reportNo"
            value={formData.reportNo}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm">Request Type</label>
          <input
            type="text"
            name="requestType"
            value={formData.requestType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {/* Job Status */}
        <div>
          <label className="block text-sm">Job Status</label>
          <input
            type="text"
            name="jobStatus"
            value={formData.jobStatus}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm">Office (Country Select)</label>
          <input
            type="text"
            name="officeCountry"
            value={formData.officeCountry}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm">Staff Days</label>
          <input
            type="number"
            name="staffDays"
            value={formData.staffDays}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Is Client Shadow Audit */}
      <div className="mt-4">
        <label className="block text-sm">Is Client Shadow Audit?</label>
        <select
          name="isClientShadowAudit"
          value={formData.isClientShadowAudit}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {/* Scheduling Section */}
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Scheduling</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm">Date Request Received</label>
            <input
              type="date"
              name="dateRequestReceived"
              value={formData.dateRequestReceived}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Audit Due Date</label>
            <input
              type="date"
              name="auditDueDate"
              value={formData.auditDueDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Audit Start Date</label>
            <input
              type="date"
              name="auditStartDate"
              value={formData.auditStartDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm">Audit End Date</label>
            <input
              type="date"
              name="auditEndDate"
              value={formData.auditEndDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Review</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Date Report Sent to QA</label>
            <input
              type="date"
              name="dateReportSentToQA"
              value={formData.dateReportSentToQA}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Final Report Sent to Client</label>
            <input
              type="date"
              name="finalReportSentToClient"
              value={formData.finalReportSentToClient}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
