// ViewJobComponent.js
import React, { useState } from 'react';
import OverviewComponent from './OverviewComponent';
import AssessmentDocumentComponent from './AssessmentDocumentComponent';
import FactoryHistoryComponent from './FactoryHistoryComponent';
import TempFolders from './TempFolders';

export default function ViewJobComponent() {
  const [activeTab, setActiveTab] = useState('overview'); // Set default tab

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewComponent />;
      case 'assessment':
        return <AssessmentDocumentComponent />;
      case 'history':
        return <FactoryHistoryComponent />;
      case 'supporting':
        return <TempFolders/>;
      default:
        return <OverviewComponent />;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Job Details</h1>
      <nav className="bg-white shadow rounded-lg mb-6">
        <ul className="flex space-x-4 justify-center border-b border-gray-200">
          <li
            className={`px-4 py-2 font-medium text-lg cursor-pointer ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-4 border-blue-600'
                : 'text-gray-600 hover:text-blue-500'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </li>
          <li
            className={`px-4 py-2 font-medium text-lg cursor-pointer ${
              activeTab === 'assessment'
                ? 'text-blue-600 border-b-4 border-blue-600'
                : 'text-gray-600 hover:text-blue-500'
            }`}
            onClick={() => setActiveTab('assessment')}
          >
            Assessment Document
          </li>
          <li
            className={`px-4 py-2 font-medium text-lg cursor-pointer ${
              activeTab === 'history'
                ? 'text-blue-600 border-b-4 border-blue-600'
                : 'text-gray-600 hover:text-blue-500'
            }`}
            onClick={() => setActiveTab('history')}
          >
            Factory History
          </li>
          <li
            className={`px-4 py-2 font-medium text-lg cursor-pointer ${
              activeTab === 'supporting'
                ? 'text-blue-600 border-b-4 border-blue-600'
                : 'text-gray-600 hover:text-blue-500'
            }`}
            onClick={() => setActiveTab('supporting')}
          >
            Audit Docs
          </li>
        </ul>
      </nav>

      <div className="bg-white shadow rounded-lg p-6">
        {renderContent()} {/* Display the active component */}
      </div>
    </div>
  );
}
