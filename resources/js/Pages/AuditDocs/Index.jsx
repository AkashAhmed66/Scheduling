import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout/MainLayout';
import { Inertia } from '@inertiajs/inertia';

export default function Index({ rootFolders, canManage }) {
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [folderPath, setFolderPath] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showRenameFolderDialog, setShowRenameFolderDialog] = useState(false);
  const [folderToRename, setFolderToRename] = useState(null);
  const [newName, setNewName] = useState('');
  const [showRenameFileDialog, setShowRenameFileDialog] = useState(false);
  const [fileToRename, setFileToRename] = useState(null);

  useEffect(() => {
    setFolders(rootFolders || []);
  }, [rootFolders]);

  const loadFolder = async (folderId = null) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/audit-docs/folders/${folderId || ''}`);
      const data = await response.json();
      
      setCurrentFolder(data.folder);
      setFolders(data.children);
      setFiles(data.files);
      setFolderPath(data.path || []);
    } catch (error) {
      console.error("Error loading folder:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName) return;
    
    try {
      const response = await fetch('/api/audit-docs/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({
          name: newFolderName,
          parent_id: currentFolder?.id || null
        })
      });
      
      if (response.ok) {
        const newFolder = await response.json();
        setFolders([...folders, newFolder]);
        setNewFolderName('');
        setShowNewFolderDialog(false);
      }
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files.length) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('folder_id', currentFolder?.id || folders[0]?.id);
    
    for (let i = 0; i < files.length; i++) {
      formData.append('files[]', files[i]);
    }
    
    try {
      const response = await fetch('/api/audit-docs/files', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: formData
      });
      
      if (response.ok) {
        const newFiles = await response.json();
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
      // Reset the file input
      event.target.value = null;
    }
  };

  const handleRenameFolder = async () => {
    if (!folderToRename || !newName) return;
    
    try {
      const response = await fetch(`/api/audit-docs/folders/${folderToRename.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({ name: newName })
      });
      
      if (response.ok) {
        const updatedFolder = await response.json();
        setFolders(folders.map(folder => 
          folder.id === updatedFolder.id ? updatedFolder : folder
        ));
        setShowRenameFolderDialog(false);
        setFolderToRename(null);
        setNewName('');
      }
    } catch (error) {
      console.error("Error renaming folder:", error);
    }
  };

  const handleRenameFile = async () => {
    if (!fileToRename || !newName) return;
    
    try {
      const response = await fetch(`/api/audit-docs/files/${fileToRename.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({ name: newName })
      });
      
      if (response.ok) {
        const updatedFile = await response.json();
        setFiles(files.map(file => 
          file.id === updatedFile.id ? updatedFile : file
        ));
        setShowRenameFileDialog(false);
        setFileToRename(null);
        setNewName('');
      }
    } catch (error) {
      console.error("Error renaming file:", error);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!confirm('Are you sure you want to delete this folder and all its contents?')) return;
    
    try {
      const response = await fetch(`/api/audit-docs/folders/${folderId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
      });
      
      if (response.ok) {
        setFolders(folders.filter(folder => folder.id !== folderId));
      }
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const handleDeleteFiles = async (fileIds) => {
    if (!confirm('Are you sure you want to delete the selected file(s)?')) return;
    
    try {
      const response = await fetch('/api/audit-docs/files', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({ file_ids: Array.isArray(fileIds) ? fileIds : [fileIds] })
      });
      
      if (response.ok) {
        setFiles(files.filter(file => !fileIds.includes(file.id)));
        setSelectedFiles([]);
      }
    } catch (error) {
      console.error("Error deleting files:", error);
    }
  };

  const downloadFile = (fileId) => {
    window.location.href = `/api/audit-docs/files/${fileId}/download`;
  };

  const downloadMultipleFiles = async () => {
    if (!selectedFiles.length) return;
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/audit-docs/files/download';
    
    // Add CSRF token
    const csrfToken = document.createElement('input');
    csrfToken.type = 'hidden';
    csrfToken.name = '_token';
    csrfToken.value = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    form.appendChild(csrfToken);
    
    // Add file IDs
    selectedFiles.forEach(fileId => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'file_ids[]';
      input.value = fileId;
      form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const toggleFileSelection = (fileId) => {
    setSelectedFiles(prevSelected => 
      prevSelected.includes(fileId)
        ? prevSelected.filter(id => id !== fileId)
        : [...prevSelected, fileId]
    );
  };

  return (
    <MainLayout>
      <Head title="Audit Documents" />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Audit Documents
                </h2>
                
                {canManage && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowNewFolderDialog(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150"
                    >
                      New Folder
                    </button>
                    
                    <label className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-150 cursor-pointer">
                      Upload Files
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </label>
                    
                    {selectedFiles.length > 0 && (
                      <>
                        <button
                          onClick={downloadMultipleFiles}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150"
                        >
                          Download Selected
                        </button>
                        
                        <button
                          onClick={() => handleDeleteFiles(selectedFiles)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150"
                        >
                          Delete Selected
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* Breadcrumbs */}
              <div className="flex items-center space-x-2 mb-4 overflow-x-auto whitespace-nowrap py-2">
                <button
                  onClick={() => loadFolder()}
                  className="text-indigo-600 hover:underline font-medium"
                >
                  Root
                </button>
                
                {folderPath.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <span>/</span>
                    <button
                      onClick={() => loadFolder(item.id)}
                      className={`hover:underline ${
                        index === folderPath.length - 1 ? 'font-semibold' : ''
                      }`}
                    >
                      {item.name}
                    </button>
                  </React.Fragment>
                ))}
              </div>
              
              {loading ? (
                <div className="flex justify-center my-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <>
                  {/* Folders */}
                  {folders.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-700 mb-3">Folders</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {folders.map(folder => (
                          <div key={folder.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                            <div className="flex items-start justify-between">
                              <div 
                                className="flex items-center cursor-pointer"
                                onClick={() => loadFolder(folder.id)}
                              >
                                <svg className="h-10 w-10 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                </svg>
                                <span className="ml-2 font-medium text-gray-800 truncate">{folder.name}</span>
                              </div>
                              
                              {canManage && (
                                <div className="relative group">
                                  <button className="text-gray-500 hover:text-gray-700">
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                    </svg>
                                  </button>
                                  
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 invisible group-hover:visible">
                                    <div className="py-1">
                                      <button
                                        onClick={() => {
                                          setFolderToRename(folder);
                                          setNewName(folder.name);
                                          setShowRenameFolderDialog(true);
                                        }}
                                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      >
                                        Rename
                                      </button>
                                      <button
                                        onClick={() => handleDeleteFolder(folder.id)}
                                        className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Files */}
                  {files.length > 0 ? (
                    <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-3">Files</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              {canManage && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  <input
                                    type="checkbox"
                                    onChange={() => {
                                      if (selectedFiles.length === files.length) {
                                        setSelectedFiles([]);
                                      } else {
                                        setSelectedFiles(files.map(file => file.id));
                                      }
                                    }}
                                    checked={selectedFiles.length === files.length && files.length > 0}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                  />
                                </th>
                              )}
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Size
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Uploaded
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {files.map(file => (
                              <tr key={file.id} className="hover:bg-gray-50">
                                {canManage && (
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                      type="checkbox"
                                      onChange={() => toggleFileSelection(file.id)}
                                      checked={selectedFiles.includes(file.id)}
                                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                    />
                                  </td>
                                )}
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm text-gray-900">{file.name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {(file.size / 1024).toFixed(2)} KB
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(file.created_at).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => downloadFile(file.id)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                  >
                                    Download
                                  </button>
                                  
                                  {canManage && (
                                    <>
                                      <button
                                        onClick={() => {
                                          setFileToRename(file);
                                          setNewName(file.name);
                                          setShowRenameFileDialog(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                      >
                                        Rename
                                      </button>
                                      <button
                                        onClick={() => handleDeleteFiles([file.id])}
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        Delete
                                      </button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className={folders.length === 0 ? "mt-8" : ""}>
                      <div className="text-center p-8 bg-gray-50 rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No files</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {folders.length === 0
                            ? "Get started by creating a folder or uploading files"
                            : "Upload files to this folder"}
                        </p>
                        {canManage && (
                          <div className="mt-6">
                            <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                              Upload Files
                              <input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileUpload}
                                disabled={isUploading}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* New Folder Dialog */}
      {showNewFolderDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Folder</h3>
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowNewFolderDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Rename Folder Dialog */}
      {showRenameFolderDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Rename Folder</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowRenameFolderDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRenameFolder}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Rename File Dialog */}
      {showRenameFileDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Rename File</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowRenameFileDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRenameFile}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
} 