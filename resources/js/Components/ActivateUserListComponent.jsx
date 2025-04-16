import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function ActivateUserListComponent() {
  const { users, unactive } = usePage().props;
  const [data, setData] = useState([]);
  useEffect(() => {
    setData([...users]);
  }, []);
  const handleDelete = (id, image_url) => {
      Inertia.post('delete-user', {
        id,
        image_url
      });
    }
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">User List</h1>
      
      {/* Users Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-6 py-3 border-b">ID</th>
              <th className="px-6 py-3 border-b">Name</th>
              <th className="px-6 py-3 border-b">Email</th>
              <th className="px-6 py-3 border-b">Status</th>
              <th className="px-6 py-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-3">{user.id}</td>
                  <td className="px-6 py-3">{user.name}</td>
                  <td className="px-6 py-3">{user.email}</td>
                  <td className="px-6 py-3">{user.image_url == null ? 'Inactive' : 'Active'}</td>
                  <td className="px-6 py-3">
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      onClick={()=>handleDelete(user.id, user.image_url)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-3 text-center text-gray-500">
                  No users available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
