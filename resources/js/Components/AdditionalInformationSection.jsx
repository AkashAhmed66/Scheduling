import React from 'react';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import the default styles for the Quill editor

export default function AdditionalInformationSection({ formData, handleChange }) {
  const handleQuillChange = (value, name) => {
    handleChange({ target: { name, value } });
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Additional Information</h2>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm">Coordination</label>
          <ReactQuill
            value={formData.coordination}
            onChange={(value) => handleQuillChange(value, 'coordination')}
            className="w-full border border-gray-300 rounded"
            theme="snow"
          />
        </div>

        <div>
          <label className="block text-sm">Auditors</label>
          <ReactQuill
            value={formData.auditors}
            onChange={(value) => handleQuillChange(value, 'auditors')}
            className="w-full border border-gray-300 rounded"
            theme="snow"
          />
        </div>

        <div>
          <label className="block text-sm">Report Review</label>
          <ReactQuill
            value={formData.reportReview}
            onChange={(value) => handleQuillChange(value, 'reportReview')}
            className="w-full border border-gray-300 rounded"
            theme="snow"
          />
        </div>
      </div>
    </div>
  );
}
