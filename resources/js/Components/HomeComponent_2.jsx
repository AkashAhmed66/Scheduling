import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import React from 'react';

export default function Profile() {
  const { user, image_url } = usePage().props;
  const handleEditProfile = () => {
    Inertia.visit('/profile'); // Replace '/edit-profile' with your route
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full">
        <div className="text-center">
          <img
            src={image_url}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-gray-300 shadow-md mx-auto"
          />
          <h2 className="text-2xl font-bold text-gray-800 mt-4">{user.name}</h2>
          <p className="text-sm text-gray-500">User Profile</p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-4">
            <label className="text-gray-600 font-semibold w-20">Name:</label>
            <span className="text-gray-800 bg-gray-100 px-4 py-2 rounded-lg shadow-sm flex-1">
              {user.name}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-gray-600 font-semibold w-20">Email:</label>
            <span className="text-gray-800 bg-gray-100 px-4 py-2 rounded-lg shadow-sm flex-1">
              {user.email}
            </span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleEditProfile}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}