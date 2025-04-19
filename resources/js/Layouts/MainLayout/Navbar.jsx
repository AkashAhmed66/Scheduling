import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Navbar() {
  const { url } = usePage(); // Get the current URL
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State for profile dropdown
  const profileRef = useRef(null); // Reference for the profile dropdown
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [user, setUser] = useState(false);

  useEffect(() => {
    // Fetch data on component mount
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/get-profile-data'); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setUser(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const toggleSubmenu = () => {
    setIsSubmenuOpen((prev) => !prev);
  };
  
  const isActive = (path) => url.startsWith(path);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
        if (
          !event.target.closest('a[href="/activate-user"]') &&
          !event.target.closest('a[href="/activate-user-list"]')
        ) setIsSubmenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/home" className="flex items-center">
              <img
                src="/images/logo.png"
                alt="logo"
                className="w-10 h-10 transition-transform duration-300 hover:scale-110"
              />
              <span className="ml-6 text-xl font-bold text-white hidden sm:block">InsighT</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <NavLink href="/home" active={isActive('/home')}>
                Home
              </NavLink>
              <NavLink href="/assesment" active={isActive('/assesment')}>
                Assessment
              </NavLink>
              <NavLink href="/calender" active={isActive('/calender')}>
                Calendar
              </NavLink>
              <NavLink href="/jobs" active={isActive('/jobs')}>
                Jobs
              </NavLink>
              <NavLink href="/audit-docs" active={isActive('/audit-docs')}>
                Audit Docs
              </NavLink>

              {/* Activate User Dropdown */}
              <div className="relative">
                <button
                  className={`px-3 py-2 rounded-md text-sm font-medium focus:outline-none transition duration-150 ease-in-out ${
                    isSubmenuOpen ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:text-white hover:bg-indigo-500'
                  }`}
                  onClick={toggleSubmenu}
                >
                  <span className="flex items-center">
                    Activate User
                    <svg className={`ml-1 h-5 w-5 transition-transform duration-200 ${isSubmenuOpen ? 'transform rotate-180' : ''}`} 
                      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </button>

                {isSubmenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5 py-1 transform origin-top-right transition-all duration-200">
                    <Link
                      href="/activate-user"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      Add User
                    </Link>
                    <Link
                      href="/activate-user-list"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      User List
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="ml-4 flex items-center">
            <div className="relative" ref={profileRef}>
              <button
                className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-white transition duration-150 ease-in-out"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <img
                  src={user && user.image_url ? user.image_url : '/images/default-avatar.png'}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                  onError={(e) => {e.target.src = '/images/default-avatar.png'}}
                />
              </button>
              
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg z-20">
                  <div className="py-1 bg-white rounded-md ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/logout"
                      method="post"
                      as="button"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      Sign out
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button - can be added here if needed */}
        </div>
      </div>
    </div>
  );
}

// Helper component for navigation links
function NavLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        active
          ? 'bg-indigo-700 text-white'
          : 'text-indigo-100 hover:text-white hover:bg-indigo-500'
      } transition duration-150 ease-in-out`}
    >
      {children}
    </Link>
  );
}
