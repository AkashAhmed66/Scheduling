import React, { useState } from 'react';
import FolderTree from '../../Components/FolderTree';

export default function Sidebar({ sideBarData }) {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div
      className={`bg-gray-100 p-4 border-gray-300 transition-all h-auto duration-300 ${
        isMinimized ? 'w-16' : 'w-64'
      } flex flex-col`}
    >
      <div className="flex justify-end">
        <button
          onClick={toggleSidebar}
          className="mb-4 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 absolute"
        >
          {isMinimized ? <i className="fa-solid fa-angle-right"></i> : <i className="fa-solid fa-angle-left"></i>}
        </button>
      </div>
      {!isMinimized && (
        <>
          <h2 className="text-xl font-semibold mb-4">Documents</h2>
          <div className="space-y-2">
            <FolderTree data={sideBarData} />
          </div>
        </>
      )}
    </div>
  );
}
