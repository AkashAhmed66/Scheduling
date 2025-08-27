import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import ConfirmationModal from './ConfirmationModal';

export default function ActivateUserListComponent() {
  const { users, unactive } = usePage().props;
  const [data, setData] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [userToRestore, setUserToRestore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Role mapping function
  const getRoleName = (roleValue) => {
    const roleMap = {
      0: 'Admin',
      1: 'Coordinator',
      2: 'Auditor',
      3: 'Reviewer'
    };
    return roleMap[roleValue] || 'Unknown';
  };

  useEffect(() => {
    setData([...users]);
  }, []);
  
  const handleDelete = (id, image_url) => {
    setUserToDelete({ id, image_url });
    setShowDeleteConfirm(true);
  };

  const handleRestore = (id) => {
    setUserToRestore({ id });
    setShowRestoreConfirm(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      setIsLoading(true);
      try {
        const response = await fetch('/delete-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
          },
          body: JSON.stringify({
            id: userToDelete.id,
            image_url: userToDelete.image_url
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          setData(result.users);
        } else {
          console.error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        setIsLoading(false);
      }
    }
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const confirmRestore = async () => {
    if (userToRestore) {
      setIsLoading(true);
      try {
        const response = await fetch('/restore-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
          },
          body: JSON.stringify({
            id: userToRestore.id
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          setData(result.users);
        } else {
          console.error('Failed to restore user');
        }
      } catch (error) {
        console.error('Error restoring user:', error);
      } finally {
        setIsLoading(false);
      }
    }
    setShowRestoreConfirm(false);
    setUserToRestore(null);
  };
  return (
    <div className="relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-50">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="text-gray-700 font-medium">Processing...</span>
          </div>
        </div>
      )}
      
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <h2 className="text-2xl font-bold">User Management</h2>
            <p className="mt-1 text-indigo-100">View and manage user accounts</p>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.length > 0 ? (
                    data.map((user) => (
                      <tr key={user.id} className={`${
                        user.deleted_at !== null 
                          ? 'bg-red-50 hover:bg-red-100 opacity-75' 
                          : 'hover:bg-gray-50'
                      } transition-colors duration-150`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.id}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          user.deleted_at !== null ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}>{user.name}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          user.deleted_at !== null ? 'text-gray-500 line-through' : 'text-gray-700'
                        }`}>{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getRoleName(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.deleted_at !== null 
                              ? 'bg-red-100 text-red-800' 
                              : user.image_url == null 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {user.deleted_at !== null 
                              ? 'Deleted' 
                              : user.image_url == null 
                                ? 'Inactive' 
                                : 'Active'
                            }
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {user.role !== 0 && user.deleted_at === null && (
                            <button 
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                              onClick={()=>handleDelete(user.id, user.image_url)}
                              disabled={isLoading}
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                              Delete
                            </button>
                          )}
                          {user.deleted_at !== null && (
                            <div className="flex flex-col space-y-2">
                              <span className="text-red-600 text-sm font-medium">
                                Deleted on {new Date(user.deleted_at).toLocaleDateString()}
                              </span>
                              <button 
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                onClick={()=>handleRestore(user.id)}
                                disabled={isLoading}
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                Restore
                              </button>
                            </div>
                          )}
                          {user.role === 0 && user.deleted_at === null && (
                            <span className="text-gray-500 text-sm">Admin user</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        <div className="py-8">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No users available</h3>
                          <p className="mt-1 text-sm text-gray-500">There are no users to display at this time.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action will deactivate the user account but can be restored later."
        confirmButtonText="Delete User"
        type="danger"
      />

      {/* Restore Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRestoreConfirm}
        onClose={() => setShowRestoreConfirm(false)}
        onConfirm={confirmRestore}
        title="Restore User"
        message="Are you sure you want to restore this user? This will reactivate the user account and allow them to log in again."
        confirmButtonText="Restore User"
        type="info"
      />
    </div>
  );
}
