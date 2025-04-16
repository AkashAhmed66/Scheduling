import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
                                    <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-5">
                                    <h3 className="text-lg font-medium text-gray-900">Welcome to your Audit Management System</h3>
                                    <p className="mt-1 text-sm text-gray-500">Hello, {auth.user.name}! Your audit dashboard provides a comprehensive overview of all your audit activities and responsibilities.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                                        <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h3 className="ml-3 text-lg font-medium text-gray-900">Job Management</h3>
                                </div>
                                <p className="mt-4 text-sm text-gray-600">
                                    Create, track, and manage audit jobs. View job status, assign team members, and monitor progress through the audit lifecycle.
                                </p>
                                <div className="mt-5">
                                    <a href="#" className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150">
                                        View Jobs
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                                        <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="ml-3 text-lg font-medium text-gray-900">Assessments</h3>
                                </div>
                                <p className="mt-4 text-sm text-gray-600">
                                    Complete and review audit assessments, mark compliance items, and generate detailed reports with findings and recommendations.
                                </p>
                                <div className="mt-5">
                                    <a href="#" className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150">
                                        View Assessments
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-purple-100 rounded-full p-3">
                                        <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="ml-3 text-lg font-medium text-gray-900">Calendar</h3>
                                </div>
                                <p className="mt-4 text-sm text-gray-600">
                                    Manage your audit schedule, view upcoming deadlines, and coordinate team availability for efficient resource allocation.
                                </p>
                                <div className="mt-5">
                                    <a href="#" className="inline-flex items-center px-4 py-2 bg-purple-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-purple-700 focus:bg-purple-700 active:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150">
                                        View Calendar
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mt-6">
                        <div className="p-6 border-t border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                            <div className="border-l-4 border-indigo-500 pl-4 mb-4">
                                <p className="text-sm text-gray-600">System maintenance completed successfully. All audit logs have been archived.</p>
                                <p className="text-xs text-gray-500 mt-1">Today at 10:30 AM</p>
                            </div>
                            <div className="border-l-4 border-blue-500 pl-4 mb-4">
                                <p className="text-sm text-gray-600">New compliance requirements added to assessment templates.</p>
                                <p className="text-xs text-gray-500 mt-1">Yesterday at 2:15 PM</p>
                            </div>
                            <div className="text-right">
                                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">View all activity →</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
