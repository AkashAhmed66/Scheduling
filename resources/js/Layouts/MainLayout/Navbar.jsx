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
    <div className="bg-gray-800 text-white flex items-center p-4 justify-between">
      {/* Logo on the left */}
      <img
        src="/images/logo.png"
        alt="logo"
        className="w-8 h-8"
      />

      {/* Menu items on the right */}
      <div className="flex items-center space-x-4">
        {/* Navigation Links */}
        <Link
          href="/home"
          className={`hover:text-gray-400 ${isActive('/home') ? 'text-blue-400 font-bold' : ''}`}
        >
          Home
        </Link>
        <Link
          href="/assesment"
          className={`hover:text-gray-400 ${isActive('/assesment') ? 'text-blue-400 font-bold' : ''}`}
        >
          Assesment
        </Link>
        <Link
          href="/calender"
          className={`hover:text-gray-400 ${isActive('/calender') ? 'text-blue-400 font-bold' : ''}`}
        >
          Calender
        </Link>
        <Link
          href="/jobs"
          className={`hover:text-gray-400 ${isActive('/jobs') ? 'text-blue-400 font-bold' : ''}`}
        >
          Job
        </Link>
        {/* <Link
          href="/docs"
          className={`hover:text-gray-400 ${isActive('/docs') ? 'text-blue-400 font-bold' : ''}`}
        >
          Audit Docs
        </Link> */}
        
        {/* Activate User Dropdown (on hover) */}
        <div className="relative">
          {/* Main Button */}
          <button
            className="hover:text-gray-400 focus:outline-none"
            onClick={toggleSubmenu}
          >
            <span
              className={`text-gray-300 ${
                isSubmenuOpen ? 'text-blue-400 font-bold' : ''
              }`}
            >
              Activate User
            </span>
          </button>

          {/* Submenu */}
          {isSubmenuOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
              <Link
                href="/activate-user"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
              >
                Add User
              </Link>
              <Link
                href="/activate-user-list"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
              >
                User List
              </Link>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <img
              src={user.image_url}
              alt="."
              className="w-8 h-8 rounded-full border-2 border-white"
            />
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg overflow-hidden z-20">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
              >
                Profile
              </Link>
              <Link
                href="/logout"
                method="post"
                as="button"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
