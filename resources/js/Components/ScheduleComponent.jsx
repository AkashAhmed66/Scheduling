import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import moment from 'moment';

export default function ScheduleComponent() {
  const { jobs } = usePage().props;
  const [selectedDate, setSelectedDate] = useState(moment());
  const [currentView, setCurrentView] = useState('week');
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    generateScheduleData();
  }, [selectedDate, currentView, jobs]);

  const generateScheduleData = () => {
    if (!jobs || !jobs.length) {
      setScheduleData([]);
      return;
    }

    let startDate, endDate;
    
    if (currentView === 'day') {
      startDate = moment(selectedDate).startOf('day');
      endDate = moment(selectedDate).endOf('day');
    } else if (currentView === 'week') {
      startDate = moment(selectedDate).startOf('week');
      endDate = moment(selectedDate).endOf('week');
    } else if (currentView === 'month') {
      startDate = moment(selectedDate).startOf('month');
      endDate = moment(selectedDate).endOf('month');
    }

    const data = [];
    const currentDate = moment(startDate);

    while (currentDate.isSameOrBefore(endDate)) {
      const date = moment(currentDate);
      const dayJobs = jobs.filter(job => {
        const deadline = moment(job.deadline);
        return deadline.isSame(date, 'day');
      });

      data.push({
        date: date,
        jobs: dayJobs
      });

      currentDate.add(1, 'day');
    }

    setScheduleData(data);
  };

  const navigatePrevious = () => {
    if (currentView === 'day') {
      setSelectedDate(moment(selectedDate).subtract(1, 'day'));
    } else if (currentView === 'week') {
      setSelectedDate(moment(selectedDate).subtract(1, 'week'));
    } else if (currentView === 'month') {
      setSelectedDate(moment(selectedDate).subtract(1, 'month'));
    }
  };

  const navigateNext = () => {
    if (currentView === 'day') {
      setSelectedDate(moment(selectedDate).add(1, 'day'));
    } else if (currentView === 'week') {
      setSelectedDate(moment(selectedDate).add(1, 'week'));
    } else if (currentView === 'month') {
      setSelectedDate(moment(selectedDate).add(1, 'month'));
    }
  };

  const viewJob = (id) => {
    Inertia.visit(`/job/${id}`);
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatViewTitle = () => {
    if (currentView === 'day') {
      return selectedDate.format('MMMM D, YYYY');
    } else if (currentView === 'week') {
      const startOfWeek = moment(selectedDate).startOf('week');
      const endOfWeek = moment(selectedDate).endOf('week');
      return `${startOfWeek.format('MMM D')} - ${endOfWeek.format('MMM D, YYYY')}`;
    } else if (currentView === 'month') {
      return selectedDate.format('MMMM YYYY');
    }
  };

  const isToday = (date) => {
    return moment(date).isSame(moment(), 'day');
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Schedule</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentView('day')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                currentView === 'day'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setCurrentView('week')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                currentView === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setCurrentView('month')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                currentView === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Month
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-6 py-4">
            <button
              onClick={navigatePrevious}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h3 className="text-lg font-medium text-gray-800">{formatViewTitle()}</h3>
            <button
              onClick={navigateNext}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          {currentView === 'day' && (
            <div className="p-4">
              {scheduleData.length > 0 ? (
                <div className="p-4">
                  <h4 className="text-md font-medium mb-4">{scheduleData[0].date.format('dddd, MMMM D')}</h4>
                  <div className="space-y-3">
                    {scheduleData[0].jobs.length > 0 ? (
                      scheduleData[0].jobs.map(job => (
                        <div
                          key={job.id}
                          onClick={() => viewJob(job.id)}
                          className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        >
                          <div className="flex justify-between items-start">
                            <h5 className="text-md font-medium text-gray-900">{job.title}</h5>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(job.status)}`}>
                              {job.status}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{job.description}</p>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">Due: {moment(job.deadline).format('h:mm A')}</span>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityClass(job.priority)}`}>
                                {job.priority}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {job.client?.name || 'No client'}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">No jobs scheduled for this day</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">No schedule data available</div>
              )}
            </div>
          )}

          {currentView === 'week' && (
            <div className="grid grid-cols-7 divide-x divide-gray-200">
              {scheduleData.map((day, index) => (
                <div key={index} className={`min-h-[400px] ${isToday(day.date) ? 'bg-blue-50' : ''}`}>
                  <div className={`p-3 text-center border-b ${isToday(day.date) ? 'bg-blue-100 font-bold' : 'bg-gray-50'}`}>
                    <div className="text-xs text-gray-500">{day.date.format('ddd')}</div>
                    <div className={`text-sm ${isToday(day.date) ? 'text-blue-800' : 'text-gray-800'}`}>{day.date.format('D')}</div>
                  </div>
                  <div className="p-2 space-y-2">
                    {day.jobs.length > 0 ? (
                      day.jobs.map(job => (
                        <div
                          key={job.id}
                          onClick={() => viewJob(job.id)}
                          className={`p-2 rounded text-xs border ${getPriorityClass(job.priority)} hover:shadow-sm cursor-pointer`}
                        >
                          <div className="font-medium truncate">{job.title}</div>
                          <div className="flex justify-between items-center mt-1">
                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${getStatusClass(job.status)}`}>
                              {job.status}
                            </span>
                            <span className="text-xs">{moment(job.deadline).format('h:mm A')}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-xs text-gray-400">No jobs</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentView === 'month' && (
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {Array(moment(selectedDate).startOf('month').day()).fill().map((_, index) => (
                <div key={`empty-start-${index}`} className="bg-gray-100 h-24 p-1"></div>
              ))}
              
              {scheduleData.map((day, index) => (
                <div 
                  key={index} 
                  className={`bg-white h-24 p-1 overflow-hidden ${isToday(day.date) ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className={`text-right mb-1 ${isToday(day.date) ? 'font-bold text-blue-800' : ''}`}>
                    {day.date.format('D')}
                  </div>
                  <div className="space-y-1 overflow-y-auto max-h-[72px] scrollbar-thin">
                    {day.jobs.slice(0, 3).map(job => (
                      <div
                        key={job.id}
                        onClick={() => viewJob(job.id)}
                        className={`px-1 py-0.5 rounded text-xs truncate cursor-pointer ${getStatusClass(job.status)}`}
                      >
                        {job.title}
                      </div>
                    ))}
                    {day.jobs.length > 3 && (
                      <div className="text-xs text-center text-gray-500">
                        +{day.jobs.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {Array(6 - moment(selectedDate).endOf('month').day()).fill().map((_, index) => (
                <div key={`empty-end-${index}`} className="bg-gray-100 h-24 p-1"></div>
              ))}
            </div>
          )}
          
          {scheduleData.length === 0 && (
            <div className="bg-white rounded-lg p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No schedule data</h3>
              <p className="mt-1 text-sm text-gray-500">There are no jobs scheduled for this period.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 