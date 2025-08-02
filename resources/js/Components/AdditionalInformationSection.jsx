import React from 'react';

export default function AdditionalInformationSection({ formData, handleChange }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Additional Information</h2>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coordination
          </label>
          <textarea
            name="add_info_coordination"
            value={formData.add_info_coordination || ''}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical"
            placeholder="Enter coordination details..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Auditors
          </label>
          <textarea
            name="add_info_auditors"
            value={formData.add_info_auditors || ''}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical"
            placeholder="Enter auditor information..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Review
          </label>
          <textarea
            name="add_info_report_review"
            value={formData.add_info_report_review || ''}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical"
            placeholder="Enter report review details..."
          />
        </div>
      </div>
    </div>
  );
}
