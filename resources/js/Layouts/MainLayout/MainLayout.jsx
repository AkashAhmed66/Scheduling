// MainLayout.js
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Body from './Body';
import SidebarContextState from '@/Context/SidebarContextState';

function MainLayout({ children, sideBarData = { children: [] } }) {
  return (
    <SidebarContextState>
      <div className="flex flex-col h-screen">
        <div className="w-full z-30 shadow-md">
          <Navbar />
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-shrink-0 h-full bg-white shadow-md border-r border-gray-200 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            <Sidebar sideBarData={sideBarData}/>
          </div>
          <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Body children={children}/>
            </div>
          </div>
        </div>
      </div>
    </SidebarContextState>
  );
}

export default MainLayout;
