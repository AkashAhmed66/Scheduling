import React, { useState } from 'react';
import FolderTree from '../../Components/FolderTree';

export default function Sidebar({ sideBarData = { children: [] } }) {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  // Ensure sideBarData has the expected structure
  const safeData = sideBarData && typeof sideBarData === 'object' ? sideBarData : { children: [] };

  return (
    <div
      className={`transition-all duration-300 ${
        isMinimized ? 'w-16' : 'w-64'
      } flex flex-col`}
    >
      <div className="flex justify-end p-2">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-indigo-500 text-white rounded-full shadow-md hover:bg-indigo-600 transition-colors z-10"
          aria-label={isMinimized ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isMinimized ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>
      
      {!isMinimized && (
        <div className="p-4 pt-0">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Documents
          </h2>
          <div className="space-y-2 overflow-hidden">
            <FolderTree data={safeData} />
          </div>
        </div>
      )}
    </div>
  );
}
