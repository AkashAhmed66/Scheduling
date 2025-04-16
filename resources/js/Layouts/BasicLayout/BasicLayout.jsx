// MainLayout.js
import React from 'react';
import Navbar from '../MainLayout/Navbar';
import Body from '../MainLayout/Body';

function BasicLayout({ children, sideBarData }) {
  return (
    <div className="grid grid-rows-[60px_1fr] h-screen">
      <div className="row-span-1 z-30">
        <Navbar />
      </div>
      <div className="row-span-2 col-span-1 h-full overflow-y-scroll hover-scrollbar">
        <Body children={ children }/>
      </div>
    </div>
  );
}

export default BasicLayout;
