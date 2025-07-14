import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function NotificationDropdown({ isMobile = false, className = '' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'document',
            title: 'New assessment document uploaded',
            message: 'Assessment for Factory ABC has been uploaded by John Doe',
            time: '2 minutes ago',
            unread: true,
            icon: {
                color: 'blue',
                svg: 'M9 12h3.75M9 15h3.75M9 18h3.75m3.75-12.75H18a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0118 21.75H6a2.25 2.25 0 01-2.25-2.25V6A2.25 2.25 0 016 3.75h.75a2.25 2.25 0 012.25 2.25V6a.75.75 0 00.75.75h3a.75.75 0 00.75-.75V3.75a2.25 2.25 0 012.25-2.25H18z'
            }
        },
        {
            id: 2,
            type: 'success',
            title: 'Assessment completed',
            message: 'The assessment for Project XYZ has been completed successfully',
            time: '1 hour ago',
            unread: true,
            icon: {
                color: 'green',
                svg: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            }
        },
        {
            id: 3,
            type: 'warning',
            title: 'Audit deadline approaching',
            message: 'The audit for Manufacturing Plant A is due in 3 days',
            time: '3 hours ago',
            unread: true,
            icon: {
                color: 'yellow',
                svg: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
            }
        },
        {
            id: 4,
            type: 'user',
            title: 'New user registered',
            message: 'Jane Smith has registered and is waiting for approval',
            time: '1 day ago',
            unread: false,
            icon: {
                color: 'purple',
                svg: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
            }
        }
    ]);

    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const unreadCount = notifications.filter(n => n.unread).length;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => 
            n.id === id ? { ...n, unread: false } : n
        ));
    };

    const getDropdownPosition = () => {
        if (!buttonRef.current) return { top: 0, right: 0 };
        
        const buttonRect = buttonRef.current.getBoundingClientRect();
        return {
            top: buttonRect.bottom + 8,
            right: window.innerWidth - buttonRect.right,
        };
    };

    const getIconColorClasses = (color) => {
        const colorMap = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            yellow: 'bg-yellow-100 text-yellow-600',
            purple: 'bg-purple-100 text-purple-600',
            red: 'bg-red-100 text-red-600'
        };
        return colorMap[color] || 'bg-gray-100 text-gray-600';
    };

    const getBadgeColor = (color) => {
        const colorMap = {
            blue: 'bg-blue-600',
            green: 'bg-green-600',
            yellow: 'bg-yellow-600',
            purple: 'bg-purple-600',
            red: 'bg-red-600'
        };
        return colorMap[color] || 'bg-gray-600';
    };

    if (isMobile) {
        return (
            <div className={`${className}`}>
                <button
                    className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full transition duration-150 ease-in-out"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="sr-only">View notifications</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-white">{unreadCount}</span>
                        </span>
                    )}
                </button>

                {isOpen && (
                    <div className="border-t border-gray-200 pb-3 pt-4">
                        <div className="px-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-base font-medium text-gray-800">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={markAllAsRead}
                                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {notifications.map((notification) => (
                                    <div 
                                        key={notification.id} 
                                        className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition duration-150 ease-in-out"
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className={`h-6 w-6 rounded-full flex items-center justify-center ${getIconColorClasses(notification.icon.color)}`}>
                                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d={notification.icon.svg} />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <p className={`text-sm ${notification.unread ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                                                        {notification.title}
                                                    </p>
                                                    {notification.unread && (
                                                        <div className={`h-2 w-2 rounded-full ml-2 mt-1 ${getBadgeColor(notification.icon.color)}`}></div>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                                                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-4">
                                <button className="w-full text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium py-2 bg-indigo-50 rounded-md transition duration-150 ease-in-out">
                                    View all notifications
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                ref={buttonRef}
                className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full transition duration-150 ease-in-out"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="sr-only">View notifications</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">{unreadCount}</span>
                    </span>
                )}
            </button>
            
            {isOpen && createPortal(
                <div 
                    className="fixed w-80 bg-white rounded-md shadow-xl max-h-96 overflow-hidden border border-gray-200"
                    style={{ 
                        top: getDropdownPosition().top,
                        right: getDropdownPosition().right,
                        zIndex: 99999 
                    }}
                >
                    <div className="py-1">
                        {/* Header */}
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={markAllAsRead}
                                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition duration-150 ease-in-out"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {/* Notification List */}
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.map((notification) => (
                                <div 
                                    key={notification.id} 
                                    className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer transition duration-150 ease-in-out"
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getIconColorClasses(notification.icon.color)}`}>
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d={notification.icon.svg} />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <p className={`text-sm ${notification.unread ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                                                    {notification.title}
                                                </p>
                                                {notification.unread && (
                                                    <div className={`h-2 w-2 rounded-full ml-2 mt-1 ${getBadgeColor(notification.icon.color)}`}></div>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Footer */}
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                            <button className="w-full text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium transition duration-150 ease-in-out">
                                View all notifications
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
