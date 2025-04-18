import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import React, { useState, useEffect } from 'react';

export default function Profile() {
  const { user, image_url } = usePage().props;
  const [userStats, setUserStats] = useState({
    jobsCompleted: 24,
    projectsInProgress: 5,
    totalAssessments: 38,
    recentActivity: [
      { type: 'updated', item: 'Audit schedule', time: '2 hours ago' },
      { type: 'completed', item: 'Quality assessment review', time: '1 day ago' },
      { type: 'started', item: 'New client audit project', time: '3 days ago' },
    ]
  });

  const handleEditProfile = () => {
    Inertia.visit('/profile');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Card - 4 columns on large screens */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
            {/* Cover Photo & Profile Section */}
            
            <div className="h-32 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 flex justify-center items-center">
              <h1 className="text-3xl font-bold text-white mb-2"> {user.name} </h1>              
            </div>
            <div className="relative px-6 pb-6">
              <div className="absolute -top-16 w-full left-0 flex justify-center">
                <div className="relative">
                  <img
                    src={image_url}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg transform transition-all duration-200 hover:scale-105"
                  />
                  <div className="absolute bottom-3 right-3 bg-green-500 h-5 w-5 rounded-full border-2 border-white"></div>
                </div>
              </div>
              
              <div className="mt-16 text-center">
                <h2 className="text-2xl font-bold text-gray-800">10</h2>
                <p className="text-indigo-600 font-medium">{user.role || 'System User'}</p>
                
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={handleEditProfile}
                    className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 focus:outline-none"
                  >
                    Edit Profile
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 focus:ring-2 focus:ring-gray-300">
                    View Activity
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* User Info Card */}
          <div className="mt-6 bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-4">User Information</h3>
            
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 font-medium">
                  {user.name}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 font-medium">
                  {user.email}
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Team / Department</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 font-medium">
                  {user.team || 'Not Assigned'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content - 8 columns on large screens */}
        <div className="lg:col-span-8 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Jobs Completed</p>
                  <p className="text-2xl font-bold text-gray-800">{userStats.jobsCompleted}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Projects In Progress</p>
                  <p className="text-2xl font-bold text-gray-800">{userStats.projectsInProgress}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Assessments</p>
                  <p className="text-2xl font-bold text-gray-800">{userStats.totalAssessments}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-4">Recent Activity</h3>
            
            <div className="space-y-4">
              {userStats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className={`mt-1 p-2 rounded-full mr-3 ${
                    activity.type === 'updated' ? 'bg-yellow-100 text-yellow-600' :
                    activity.type === 'completed' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {activity.type === 'updated' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    ) : activity.type === 'completed' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      <span className="capitalize">{activity.type}</span> {activity.item}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-4">Quick Actions</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/jobs" className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                <div className="p-3 rounded-full bg-white text-indigo-600 shadow-sm mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">View Jobs</span>
              </a>
              
              <a href="/create-job" className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="p-3 rounded-full bg-white text-green-600 shadow-sm mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Create Job</span>
              </a>
              
              <a href="/calender" className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="p-3 rounded-full bg-white text-blue-600 shadow-sm mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Calendar</span>
              </a>
              
              <a href="/docs" className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <div className="p-3 rounded-full bg-white text-purple-600 shadow-sm mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Documents</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}