import { usePage } from '@inertiajs/react';
import React from 'react';

export default function AddAuditorReviewer({ formData, handleChange, staffList, addStaffMember, removeStaffMember }) {
  const {create, auditors, reviewers, assessmentTypes} = usePage().props;
  return (
    <div className="mb-8 bg-white rounded-xl shadow-md border border-indigo-50">
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-xl border-b border-indigo-100">
        <h2 className="text-xl font-bold text-indigo-700 flex items-center">
          <svg className="w-6 h-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          Add Auditor and Reviewer
        </h2>
        <p className="text-sm text-gray-500 mt-1">Assign qualified personnel to this job</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reviewer Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <span>Select Reviewer</span>
              <span className="ml-1 text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="reviewer"
                onChange={handleChange}
                className={`w-full p-3 pl-10 border ${formData.reviewerError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white`}
                required
              >
                <option value="">Choose a reviewer</option>
                {reviewers.map((reviewer) => (
                  <option key={reviewer.id} value={reviewer.id}>
                    {reviewer.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className={`h-5 w-5 ${formData.reviewerError ? 'text-red-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              {formData.reviewerError && (
                <div className="text-red-500 text-xs mt-1">Reviewer selection is required</div>
              )}
            </div>
          </div>

          {/* Assessment Type Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <span>Select Assessment Type</span>
              <span className="ml-1 text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="assessmentType"
                value={formData.assessmentType || ''}
                onChange={handleChange}
                className={`w-full p-3 pl-10 border ${formData.assessmentTypeError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white`}
                required
              >
                <option value="">Choose a Assessment Type</option>
                {assessmentTypes.map((types) => (
                  <option key={types} value={types}>
                    {types}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className={`h-5 w-5 ${formData.assessmentTypeError ? 'text-red-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              {formData.assessmentTypeError && (
                <div className="text-red-500 text-xs mt-1">Assessment Type selection is required</div>
              )}
            </div>
          </div>

        </div>

        {/* Staff Role Section */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Add Staff Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <span>User</span>
                <span className="ml-1 text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="user"
                  value={formData.user}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                  required
                >
                  <option value="">Choose a user</option>
                  {auditors.map((auditor) => (
                    <option key={auditor.id} value={auditor.id}>
                      {auditor.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <span>Staff Day</span>
                <span className="ml-1 text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="staffDay"
                  value={formData.staffDay}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Enter staff day"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v2a1 1 0 01-1 1h-1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8H3a1 1 0 01-1-1V5a1 1 0 011-1h4z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <span>Start Date</span>
                <span className="ml-1 text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <span>End Date</span>
                <span className="ml-1 text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
              placeholder="Enter any additional notes..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Report Writer</label>
              <div className="flex items-center mt-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="reportWriter"
                    checked={formData.reportWriter}
                    onChange={handleChange}
                    className="sr-only"
                    id="reportWriter"
                  />
                  <label
                    htmlFor="reportWriter"
                    className="flex items-center cursor-pointer"
                  >
                    <div className={`w-5 h-5 border-2 rounded transition-colors duration-200 ${
                      formData.reportWriter 
                        ? 'bg-indigo-600 border-indigo-600' 
                        : 'border-gray-300 hover:border-indigo-400'
                    }`}>
                      {formData.reportWriter && (
                        <svg
                          className="w-3 h-3 text-white ml-0.5 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="ml-3 text-sm text-gray-700">
                      {formData.reportWriter ? 'Yes' : 'No'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addStaffMember();
                }}
                className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Staff Member
              </button>
            </div>
          </div>

          {/* Staff List */}
          {staffList.length > 0 && (
            <div className="mt-8">
              <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
                Added Staff Members ({staffList.length})
              </h4>
              
              <div className="space-y-3">
                {staffList.map((staff, index) => (
                  <div key={staff.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">User:</span>
                          <p className="text-gray-600">
                            {auditors.find(auditor => auditor.id == staff.user)?.name || staff.user}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Staff Day:</span>
                          <p className="text-gray-600">{staff.staffDay}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Period:</span>
                          <p className="text-gray-600">{staff.startDate} to {staff.endDate}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Report Writer:</span>
                          <p className="text-gray-600">{staff.reportWriter ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Note:</span>
                          <p className="text-gray-600">{staff.note || 'No note provided'}</p>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeStaffMember(staff.id);
                        }}
                        className="ml-4 inline-flex items-center justify-center w-8 h-8 rounded-full text-red-600 hover:bg-red-100 transition-colors flex-shrink-0"
                        title="Remove staff member"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
