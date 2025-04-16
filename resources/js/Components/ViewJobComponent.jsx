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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
    { id: 'assessment', label: 'Assessment Document', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'history', label: 'Factory History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'supporting', label: 'Audit Docs', icon: 'M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ];

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h1 className="text-2xl font-bold text-white">Job Details</h1>
            <p className="text-indigo-100 mt-1">View and manage the details for this job</p>
          </div>
          
          <nav className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <svg 
                    className={`mr-2 h-5 w-5 ${activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon}></path>
                  </svg>
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="p-6">
            {renderContent()} {/* Display the active component */}
          </div>
        </div>
      </div>
    </div>
  );
}
