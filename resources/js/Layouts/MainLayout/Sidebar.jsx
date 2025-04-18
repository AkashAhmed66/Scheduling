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
      } flex flex-col bg-gray-50 border-r border-gray-200`}
    >
      <div className="flex justify-end p-2">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-600 hover:text-gray-800 rounded-md transition-colors z-10"
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
        <div className="p-3 pt-0 flex-1">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm uppercase tracking-wider text-gray-500 font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              EXPLORER
            </h2>
          </div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-2 px-2 bg-gray-100 rounded">
            FOLDERS
          </div>
          <div className="mt-2 overflow-y-auto">
            <FolderTree data={safeData} />
          </div>
        </div>
      )}
    </div>
  );
}
