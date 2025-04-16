// JobLayout.js
import React from 'react';
import Navbar from '../MainLayout/Navbar';
import Body from '../MainLayout/Body';

function JobLayout({ children, sideBarData }) {
  return (
    <div className="flex flex-col h-screen">
      <div className="w-full z-30 shadow-md">
        <Navbar />
      </div>
      <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Body children={children} />
        </div>
      </div>
    </div>
  );
}

export default JobLayout;
