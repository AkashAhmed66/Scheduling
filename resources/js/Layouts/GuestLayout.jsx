import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import React from 'react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Top-left audit icon */}
                <div className="absolute top-20 left-12 opacity-5 transform rotate-[-10deg]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-48 w-48 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                
                {/* Bottom-right compliance icon */}
                <div className="absolute bottom-10 right-12 opacity-5 transform rotate-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-64 w-64 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                
                {/* Middle-left factory icon */}
                <div className="absolute top-1/2 -translate-y-1/2 left-24 opacity-5 transform -rotate-12 hidden md:block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-56 w-56 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                
                {/* Middle-right checklist icon */}
                <div className="absolute top-1/3 right-20 opacity-5 transform rotate-6 hidden md:block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                </div>
                
                {/* Bottom-left calendar icon */}
                <div className="absolute bottom-16 left-20 opacity-5 transform -rotate-6 hidden lg:block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-36 w-36 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            </div>
            
            <div className="w-full max-w-md space-y-8 relative z-10">
                {/* Logo and Header */}
                {/* <div className="text-center">
                    <Link href="/">
                        <div className="flex justify-center mb-3">
                            <img
                                src="/images/logo.png"
                                alt="logo"
                                className="w-10 h-10 transition-transform duration-300 hover:scale-110"
                            />
                        </div>
                    </Link>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                        InsighT
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Audit Management Platform
                    </p>
                </div> */}

                {/* Authentication Card */}
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
                    {/* Security Badge */}
                    {/* <div className="mb-6 flex justify-center">
                        <div className="inline-flex items-center justify-center p-2 bg-indigo-50 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                    </div> */}

                    {/* Form Content */}
                    <div className="w-full">
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} InsighT. All rights reserved by NBM.</p>
                </div>
            </div>
        </div>
    );
}
