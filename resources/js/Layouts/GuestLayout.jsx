import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import React from 'react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                {/* Logo and Header */}
                <div className="text-center">
                    <Link href="/">
                        <div className="flex justify-center mb-3">
                            <ApplicationLogo className="w-16 h-16 fill-current text-indigo-600" />
                        </div>
                    </Link>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                        Audit Management System
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Secure, reliable, and compliant audit management platform
                    </p>
                </div>

                {/* Authentication Card */}
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
                    {/* Security Badge */}
                    <div className="mb-6 flex justify-center">
                        <div className="inline-flex items-center justify-center p-2 bg-indigo-50 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="w-full">
                        {children}
                    </div>

                    {/* Compliance Badges */}
                    <div className="mt-8 pt-4 border-t border-gray-200">
                        <div className="flex justify-center space-x-6">
                            <div className="flex items-center text-xs text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>ISO 27001</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>GDPR Compliant</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>SOC 2</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Audit Management System. All rights reserved.</p>
                    <p className="mt-1">Secure login | Data encryption | Compliance focused</p>
                </div>
            </div>
        </div>
    );
}
