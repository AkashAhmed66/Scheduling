// MainLayout.js
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Body from './Body';
import SidebarContextState from '@/Context/SidebarContextState';

function MainLayout({ children, sideBarData }) {
  return (
    <SidebarContextState>
      <div className="grid grid-rows-[60px_1fr] grid-cols-[auto_1fr] h-screen">
        <div className="row-span-1 col-span-2 z-30">
          <Navbar />
        </div>
        <div className="row-span-2 h-full bg-gray-100 overflow-y-scroll border-r hover-scrollbar">
          <Sidebar sideBarData={sideBarData}/>
        </div>
        <div className="row-span-2 col-span-1 h-full overflow-y-scroll hover-scrollbar">
          <Body children={ children }/>
        </div>
      </div>
    </SidebarContextState>
  );
}

export default MainLayout;
