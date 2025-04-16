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
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HomeComponent />
        </div>
      </div>
    </BasicLayout>
  );
}
