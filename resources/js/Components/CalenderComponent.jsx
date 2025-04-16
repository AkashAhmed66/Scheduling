import { usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

export default function DateRangeCalendar() {
  const { jobs } = usePage().props;

  // Convert jobs array into tasks format
  const tasks = jobs.reduce((acc, job) => {
    const { endDate, reportNo, jobStatus } = job;
    if (!acc[endDate]) {
      acc[endDate] = [];
    }
    acc[endDate].push(reportNo);
    acc[endDate].push(jobStatus);
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
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    setCurrentStartDate(formattedToday);
    setCalendarDays(generateDaysBetween(formattedToday, 7));
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Date Range Calendar</h2>

      {/* Date Range Inputs */}
      <div className="flex justify-center space-x-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleGenerateCalendar}
          className="self-end bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Show Calendar
        </button>
      </div>

      {/* Calendar */}
      {calendarDays.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {calendarDays.map((day) => (
            <div
              key={day}
              className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-blue-600">{day}</h3>
              <ul className="mt-2 text-gray-700">
                {tasks[day] ? (
                  tasks[day].map((task, index) => (
                    <li key={index} className="mt-1 text-lg text-red-500">
                      - {task}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-green-500">No tasks</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">Select a date range to display the calendar.</p>
      )}
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mb-4 mt-4">
        <button
          onClick={handlePreviousWeek}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-gray-400"
        >
          Previous
        </button>
        <button
          onClick={handleNextWeek}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}
