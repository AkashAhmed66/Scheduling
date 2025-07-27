import { usePage, router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

export default function DateRangeCalendar() {
  const { jobs = [] } = usePage().props; // Default to empty array if jobs is undefined

  // Convert jobs array into tasks format - store full job objects grouped by auditEndDate
  const tasks = jobs.reduce((acc, job) => {
    const { auditEndDate } = job;
    if (!auditEndDate) return acc; // Skip jobs without audit end date
    
    if (!acc[auditEndDate]) {
      acc[auditEndDate] = [];
    }
    acc[auditEndDate].push(job);
    return acc;
  }, {});

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [calendarDays, setCalendarDays] = useState([]);
  const [currentStartDate, setCurrentStartDate] = useState("");

  // Function to generate calendar days between two dates
  const generateDaysBetween = (start, daysCount) => {
    const startObj = new Date(start);
    const days = [];

    for (let i = 0; i < daysCount; i++) {
      days.push(startObj.toISOString().split("T")[0]);
      startObj.setDate(startObj.getDate() + 1);
    }

    return days;
  };

  // Initialize calendar with the first 7 days from today
  useEffect(() => {
    console.log('jobs data:', jobs);
    console.log('tasks grouped by auditEndDate:', tasks);
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    setCurrentStartDate(formattedToday);
    setCalendarDays(generateDaysBetween(formattedToday, 7));
  }, [jobs]);

  // Generate calendar based on user-selected range
  const handleGenerateCalendar = () => {
    if (startDate && endDate) {
      const days = generateDaysBetween(startDate, (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1);
      setCalendarDays(days);
      setCurrentStartDate(startDate);
    }
  };

  // Show next 7 days
  const handleNextWeek = () => {
    const nextWeekStart = new Date(currentStartDate);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    const formattedNextStart = nextWeekStart.toISOString().split("T")[0];
    setCurrentStartDate(formattedNextStart);
    setCalendarDays(generateDaysBetween(formattedNextStart, 7));
  };

  // Show previous 7 days
  const handlePreviousWeek = () => {
    const prevWeekStart = new Date(currentStartDate);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    const formattedPrevStart = prevWeekStart.toISOString().split("T")[0];
    setCurrentStartDate(formattedPrevStart);
    setCalendarDays(generateDaysBetween(formattedPrevStart, 7));
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Determine if a date is today
  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Get day of the month
  const getDayOfMonth = (dateString) => {
    return new Date(dateString).getDate();
  };

  // Get status color
  const getStatusColor = (status) => {
    if (!status) return "";
    const statusLower = status.toLowerCase();
    if (statusLower.includes('complete') || statusLower.includes('done')) return 'bg-green-100 text-green-800 border-green-200';
    if (statusLower.includes('progress') || statusLower.includes('ongoing')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (statusLower.includes('pending') || statusLower.includes('wait')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (statusLower.includes('cancel') || statusLower.includes('abort')) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Handle navigation to specific job
  const handleJobClick = (jobId) => {
    router.visit(`/view-job/${jobId}`);
  };

  return (
    <div className="min-h-screen">
      <div className="w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Schedule Calendar</h2>
            <p className="text-gray-500">View and manage your upcoming deadlines and tasks</p>
            
            {/* Current range display */}
            <div className="mt-4 bg-indigo-50 text-indigo-700 py-2 px-4 rounded-md inline-flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span className="font-medium">
                {calendarDays.length > 0 && 
                  `${formatDate(calendarDays[0])} - ${formatDate(calendarDays[calendarDays.length - 1])}`
                }
              </span>
            </div>
          </div>

          {/* Date Range Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b border-gray-200">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10 w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10 w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>
            </div>
            <div className="col-span-1 flex items-end">
              <button
                onClick={handleGenerateCalendar}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2.5 rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  Show Calendar
                </div>
              </button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <button
              onClick={handlePreviousWeek}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Previous Week
            </button>
            <button
              onClick={handleNextWeek}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Next Week
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
          
          {/* Calendar */}
          {calendarDays.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {calendarDays.map((day) => (
                  <div
                    key={day}
                    className={`border rounded-lg overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md ${
                      isToday(day) ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-200'
                    }`}
                  >
                    <div className={`p-3 ${isToday(day) ? 'bg-indigo-500 text-white' : 'bg-gray-50 text-gray-700'}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{formatDate(day)}</span>
                        <span className={`text-xl font-bold ${isToday(day) ? 'text-white' : 'text-indigo-600'}`}>
                          {getDayOfMonth(day)}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-white max-h-96 overflow-y-auto">{/* Scrollable content */}
                      {tasks[day] && tasks[day].length > 0 ? (
                        <div className="space-y-3">
                          {tasks[day].map((job, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow duration-200">
                              {/* Report Number - Clickable */}
                              <div className="flex items-center justify-between mb-2">
                                <button
                                  onClick={() => handleJobClick(job.id)}
                                  className="text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200"
                                >
                                  {job.reportNo}
                                </button>
                                <div className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(job.jobStatus)}`}>
                                  {job.jobStatus || 'No Status'}
                                </div>
                              </div>
                              
                              {/* Staff Days */}
                              <div className="mb-1">
                                <span className="text-xs font-medium text-gray-600">Staff days: {job.totalStaffDays || job.staffDays || 'N/A'}</span>
                              </div>
                              
                              {/* Factory Name */}
                              <div className="mb-1">
                                <p className="text-sm text-gray-800 truncate" title={job.factoryName}>
                                  {job.factoryName || 'N/A'}
                                </p>
                              </div>
                              
                              {/* Location */}
                              <div className="mb-1">
                                <p className="text-sm text-gray-800 truncate" title={`${job.factoryAddress || ''}, ${job.factoryCity || ''}, ${job.factoryCountry || ''}`}>
                                  {job.factoryAddress || job.factoryCity || job.factoryCountry ? 
                                    `${job.factoryAddress || ''}, ${job.factoryCity || ''}, ${job.factoryCountry || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',') 
                                    : 'N/A'
                                  }
                                </p>
                              </div>
                              
                              {/* Service Name */}
                              <div>
                                <p className="text-sm text-gray-800 truncate" title={job.serviceName}>
                                  {job.serviceName || job.jobType || 'N/A'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-2 text-center text-sm text-gray-500">
                          <p>No tasks</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-10 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No date range selected</h3>
              <p className="mt-1 text-sm text-gray-500">Select a date range to display the calendar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
