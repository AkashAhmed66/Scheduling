import { usePage } from '@inertiajs/react';
import React from 'react';

export default function AddAuditorReviewer({ formData, handleChange }) {
  const {create, auditors, reviewers} = usePage().props;
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
          {/* Auditor Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <span>Select Auditor</span>
              <span className="ml-1 text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="auditor"
                value={formData.auditors || ''}
                onChange={handleChange}
                className={`w-full p-3 pl-10 border ${formData.auditorError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white`}
                required
              >
                <option value="">Choose an auditor</option>
                {auditors.map((auditor) => (
                  <option key={auditor.id} value={auditor.id}>
                    {auditor.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className={`h-5 w-5 ${formData.auditorError ? 'text-red-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              {formData.auditorError && (
                <div className="text-red-500 text-xs mt-1">Auditor selection is required</div>
              )}
            </div>
          </div>

          {/* Reviewer Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <span>Select Reviewer</span>
              <span className="ml-1 text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="reviewer"
                value={formData.reviewers || ''}
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
        </div>
      </div>
    </div>
  );
}
