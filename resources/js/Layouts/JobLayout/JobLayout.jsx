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
        <div className="w-full">
          <Body children={children} />
        </div>
      </div>
    </div>
  );
}

export default JobLayout;
