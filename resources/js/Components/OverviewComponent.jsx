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
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Report No:</span> <span className="text-gray-800">{job.reportNo || 'N/A'}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Service Name:</span> <span className="text-gray-800">{job.serviceName || 'N/A'}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Job Type:</span> <span className="text-gray-800">{job.jobType || 'N/A'}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Assessment Type:</span> <span className="text-gray-800">{job.assessmentType || 'N/A'}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Service Type:</span> <span className="text-gray-800">{job.serviceType || 'N/A'}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Service Scope:</span> <span className="text-gray-800">{job.serviceScope || 'N/A'}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Schedule Type:</span> <span className="text-gray-800">{job.scheduleType || 'N/A'}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Office Country:</span> <span className="text-gray-800">{job.officeCountry || 'N/A'}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Client Shadowing:</span> <span className="text-gray-800">{job.clientShadowing || 'N/A'}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Remarks:</span> <span className="text-gray-800">{job.remarks || 'N/A'}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Request Receive Date:</span> <span className="text-gray-800">{job.requestReceiveDate || 'N/A'}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Audit Due Date:</span> <span className="text-gray-800">{job.auditDueDate || 'N/A'}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Audit Start Date:</span> <span className="text-gray-800">{job.auditStartDate || 'N/A'}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Audit End Date:</span> <span className="text-gray-800">{job.auditEndDate || 'N/A'}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Date Report Sent to QA:</span> <span className="text-gray-800">{job.dateReportSentToQA || 'N/A'}</span></p>
          <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Final Report Sent to Client:</span> <span className="text-gray-800">{job.finalReportSentToClient || 'N/A'}</span></p>
        </div>
      </section>

      {/* Staff Information */}
      <section className="mb-6">
        <h3 className="text-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-lg mb-4 shadow-md">Staff Information</h3>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {/* Assigned Staff Members */}
          {job.staffList && job.staffList.length > 0 ? (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-indigo-700 mb-3">Assigned Staff Members</h4>
              {job.staffList.map((staff, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="flex items-center">
                        <span className="font-medium text-gray-700 w-20">Name:</span> 
                        <span className="text-gray-800 font-semibold">{staff.userName || 'Unknown User'}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="font-medium text-gray-700 w-20">Email:</span> 
                        <span className="text-gray-800">{staff.userEmail || 'N/A'}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="font-medium text-gray-700 w-20">Role:</span> 
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          staff.userRole === 'Auditor' ? 'bg-blue-100 text-blue-800' : 
                          staff.userRole === 'Reviewer' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {staff.userRole || 'Unknown'}
                        </span>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="flex items-center">
                        <span className="font-medium text-gray-700 w-24">Staff Days:</span> 
                        <span className="text-gray-800">{staff.staffDay || 'N/A'}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="font-medium text-gray-700 w-24">Start Date:</span> 
                        <span className="text-gray-800">{staff.startDate || 'N/A'}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="font-medium text-gray-700 w-24">End Date:</span> 
                        <span className="text-gray-800">{staff.endDate || 'N/A'}</span>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="flex items-center">
                        <span className="font-medium text-gray-700 w-28">Report Writer:</span> 
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          staff.reportWriter ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {staff.reportWriter ? 'Yes' : 'No'}
                        </span>
                      </p>
                      {staff.note && (
                        <p className="flex items-start">
                          <span className="font-medium text-gray-700 w-28">Note:</span> 
                          <span className="text-gray-800 text-sm">{staff.note}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <p className="text-gray-500 text-lg mt-2">No staff members assigned</p>
              <p className="text-gray-400 text-sm">Staff assignments will appear here once added</p>
            </div>
          )}
          
          {/* Primary Reviewer Information */}
          {job.reviewerInfo && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-indigo-700 mb-3">Primary Reviewer</h4>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="flex items-center">
                    <span className="font-medium text-gray-700 w-20">Name:</span> 
                    <span className="text-gray-800 font-semibold">{job.reviewerInfo.name}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium text-gray-700 w-20">Email:</span> 
                    <span className="text-gray-800">{job.reviewerInfo.email}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium text-gray-700 w-20">Role:</span> 
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {job.reviewerInfo.role}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contacts */}
      <section className="mb-6">
        <h3 className="text-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-lg mb-4 shadow-md">Contacts</h3>

        {/* Client Section */}
        <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-md font-semibold text-indigo-700 border-b border-gray-200 pb-2 mb-3">Client</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Name:</span> <span className="text-gray-800">{job.clientName || 'N/A'}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">City:</span> <span className="text-gray-800">{job.clientCity || 'N/A'}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Province:</span> <span className="text-gray-800">{job.clientProvince || 'N/A'}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Country:</span> <span className="text-gray-800">{job.clientCountry || 'N/A'}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Postal Code:</span> <span className="text-gray-800">{job.clientPostalCode || 'N/A'}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Address:</span> <span className="text-gray-800">{job.clientAddress || 'N/A'}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Tel:</span> <span className="text-gray-800">{job.clientTel || 'N/A'}</span></p>
          </div>
        </div>

        {/* Vendor Section */}
        <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-md font-semibold text-indigo-700 border-b border-gray-200 pb-2 mb-3">Vendor</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Name:</span> <span className="text-gray-800">{job.vendorName || 'N/A'}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">City:</span> <span className="text-gray-800">{job.vendorCity || 'N/A'}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Province:</span> <span className="text-gray-800">{job.vendorProvince || 'N/A'}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Country:</span> <span className="text-gray-800">{job.vendorCountry || 'N/A'}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Postal Code:</span> <span className="text-gray-800">{job.vendorPostalCode || 'N/A'}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Address:</span> <span className="text-gray-800">{job.vendorAddress || 'N/A'}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Tel:</span> <span className="text-gray-800">{job.vendorTel || 'N/A'}</span></p>
          </div>
        </div>

        {/* Factory Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-md font-semibold text-indigo-700 border-b border-gray-200 pb-2 mb-3">Factory</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Name:</span> <span className="text-gray-800">{job.factoryName || 'N/A'}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">City:</span> <span className="text-gray-800">{job.factoryCity || 'N/A'}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Province:</span> <span className="text-gray-800">{job.factoryProvince || 'N/A'}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Country:</span> <span className="text-gray-800">{job.factoryCountry || 'N/A'}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Postal Code:</span> <span className="text-gray-800">{job.factoryPostalCode || 'N/A'}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Address:</span> <span className="text-gray-800">{job.factoryAddress || 'N/A'}</span></p>
            <p className="flex items-center"><span className="font-medium text-gray-700 w-1/2">Tel:</span> <span className="text-gray-800">{job.factoryTel || 'N/A'}</span></p>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section>
        <h3 className="text-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-lg mb-4 shadow-md">Additional Information</h3>
        <div className="space-y-6 bg-white p-4 rounded-lg shadow-sm">
          <div>
            <h4 className="text-md font-semibold text-indigo-700 mb-2">Coordination</h4>
            <div className="bg-gray-50 p-3 rounded-md border">
              <p className="text-gray-800 whitespace-pre-wrap">{job.add_info_coordination || 'N/A'}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-semibold text-indigo-700 mb-2">Auditors</h4>
            <div className="bg-gray-50 p-3 rounded-md border">
              <p className="text-gray-800 whitespace-pre-wrap">{job.add_info_auditors || 'N/A'}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-semibold text-indigo-700 mb-2">Report Review</h4>
            <div className="bg-gray-50 p-3 rounded-md border">
              <p className="text-gray-800 whitespace-pre-wrap">{job.add_info_report_review || 'N/A'}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
