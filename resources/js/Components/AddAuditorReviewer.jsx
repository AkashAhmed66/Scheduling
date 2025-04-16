import { usePage } from '@inertiajs/react';
import React from 'react';

export default function AddAuditorReviewer({ formData, handleChange }) {
  const {create, auditors, reviewers} = usePage().props;
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Add Auditor and Reviewer</h2>

      <div className="grid grid-cols-1 gap-4">
        {/* Auditor Selection */}
        <div>
          <label className="block text-sm mb-2">Select Auditor</label>
          <select
            name="auditor"
            value={formData.selectedAuditor || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="" disabled>
              Choose an auditor
            </option>
            {auditors.map((auditor) => (
              <option key={auditor.id} value={auditor.id}>
                {auditor.name}
              </option>
            ))}
          </select>
        </div>

        {/* Reviewer Selection */}
        <div>
          <label className="block text-sm mb-2">Select Reviewer</label>
          <select
            name="reviewer"
            value={formData.selectedReviewer || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="" disabled>
              Choose a reviewer
            </option>
            {reviewers.map((reviewer) => (
              <option key={reviewer.id} value={reviewer.id}>
                {reviewer.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
