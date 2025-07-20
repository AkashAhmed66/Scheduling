import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import NotificationDropdown from '@/Components/NotificationDropdown';

export default function Navbar() {
  const { url } = usePage(); // Get the current URL
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State for profile dropdown
  const profileRef = useRef(null); // Reference for the profile dropdown
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [user, setUser] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // State for notification dropdown
  const notificationRef = useRef(null); // Reference for the notification dropdown
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

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
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (
        !event.target.closest('a[href="/activate-user"]') &&
        !event.target.closest('a[href="/activate-user-list"]')
      ) {
        setIsSubmenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-indigo-600 text-white shadow-lg">
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/home" className="flex items-center group">
              {/* <img
                src="/images/logo.png"
                alt="logo"
                className="w-8 h-8 transition-transform duration-300 hover:scale-110"
                onError={(e) => {e.target.style.display = 'none'}}
              /> */}
              <div className="ml-3 hidden sm:block">
                <span className="text-2xl font-bold text-white tracking-wide transition-all duration-300 group-hover:text-indigo-100">
                  <span className="bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent font-serif">
                    InsighT
                  </span>
                </span>
                <div className="h-0.5 bg-gradient-to-r from-white via-indigo-200 to-transparent w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
              </div>
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-[9999] ring-1 ring-black ring-opacity-5 py-1 transform origin-top-right transition-all duration-200"
                       style={{ zIndex: 9999 }}>
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

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-4">
            {/* Desktop Notification */}
            <div className="hidden md:block">
              <NotificationDropdown />
            </div>

            {/* Profile Dropdown - Desktop */}
            <div className="hidden md:block relative" ref={profileRef}>
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
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg z-[9999]"
                     style={{ zIndex: 9999 }}>
                  <div className="py-1 bg-white rounded-md ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
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

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden" style={{ zIndex: 9998 }}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-indigo-700">
              <MobileNavLink href="/home" active={isActive('/home')}>
                Home
              </MobileNavLink>
              <MobileNavLink href="/assesment" active={isActive('/assesment')}>
                Assessment
              </MobileNavLink>
              <MobileNavLink href="/calender" active={isActive('/calender')}>
                Calendar
              </MobileNavLink>
              <MobileNavLink href="/jobs" active={isActive('/jobs')}>
                Jobs
              </MobileNavLink>
              <MobileNavLink href="/audit-docs" active={isActive('/audit-docs')}>
                Audit Docs
              </MobileNavLink>
              
              {/* Mobile Activate User Menu */}
              <div className="space-y-1">
                <button
                  className="text-indigo-100 hover:bg-indigo-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                  onClick={toggleSubmenu}
                >
                  Activate User
                </button>
                {isSubmenuOpen && (
                  <div className="pl-4 space-y-1">
                    <MobileNavLink href="/activate-user">
                      Add User
                    </MobileNavLink>
                    <MobileNavLink href="/activate-user-list">
                      User List
                    </MobileNavLink>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mobile Notifications Section */}
            <div className="pt-4 pb-3 border-t border-indigo-700 bg-indigo-700">
              <NotificationDropdown isMobile={true} />
            </div>
            
            {/* Mobile Profile Section */}
            <div className="pt-4 pb-3 border-t border-indigo-700 bg-indigo-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user && user.image_url ? user.image_url : '/images/default-avatar.png'}
                    alt="Profile"
                    onError={(e) => {e.target.src = '/images/default-avatar.png'}}
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">{user?.name}</div>
                  <div className="text-sm font-medium leading-none text-indigo-200 mt-1">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <MobileNavLink href="/profile">
                  Your Profile
                </MobileNavLink>
                <Link
                  href="/logout"
                  method="post"
                  as="button"
                  className="block px-3 py-2 rounded-md text-base font-medium text-indigo-200 hover:text-white hover:bg-indigo-600 w-full text-left"
                >
                  Sign out
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component for desktop navigation links
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

// Helper component for mobile navigation links
function MobileNavLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`${
        active
          ? 'bg-indigo-800 text-white'
          : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
      } block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out`}
    >
      {children}
    </Link>
  );
}
