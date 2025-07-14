import React from 'react';
import HomeComponent from '../Components/HomeComponent';
import BasicLayout from '../Layouts/BasicLayout/BasicLayout';
import { Head } from '@inertiajs/react';

export default function Home(props) {
  // Define sideBarData with empty children array for the home page
  const sideBarData = {
    children: []
  };
  
  return (
    <BasicLayout>
      <Head title="Home" />
      <div>
        <div className="w-full">
          <HomeComponent />
        </div>
      </div>
    </BasicLayout>
  );
}
