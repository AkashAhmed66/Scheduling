import React, { useState, useEffect, useRef, useContext } from 'react';
import { Head, usePage } from '@inertiajs/react';
import BasicLayout from '@/Layouts/BasicLayout/BasicLayout';
import axios from 'axios';
import SidebarContext from '../Context/SidebarContext';
import ConfirmationModal from '@/Components/ConfirmationModal';

export default function Index({ rootFolders, canManage }) {
  const { csrf_token } = usePage().props;
  
  // Add a safe check for context and destructure only if available
  const sidebarContextValue = useContext(SidebarContext);
  const selectedSidebarFolder = sidebarContextValue ? sidebarContextValue.state : null;
  
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folders, setFolders] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState(new Set());  // Track expanded folders
  const [folderChildren, setFolderChildren] = useState({}); // Store nested folders
  const [files, setFiles] = useState([]);
  const [folderPath, setFolderPath] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [showRenameFolderDialog, setShowRenameFolderDialog] = useState(false);
  const [folderToRename, setFolderToRename] = useState(null);
  const [newName, setNewName] = useState('');
  const [showRenameFileDialog, setShowRenameFileDialog] = useState(false);
  const [fileToRename, setFileToRename] = useState(null);
  const [showFolders, setShowFolders] = useState(true); // State to toggle folders sidebar visibility
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // Can be folder or files
  const fileInputRef = useRef(null);

  // Set up Axios defaults to include CSRF token
  axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token;

  useEffect(() => {
    setFolders(rootFolders || []);
  }, [rootFolders]);

  // Watch for changes to the selected folder in sidebar
  useEffect(() => {
    if (selectedSidebarFolder && selectedSidebarFolder.id) {
      loadFolder(selectedSidebarFolder.id);
    }
  }, [selectedSidebarFolder]);

  const fetchAllFolders = async (currentFolderId) => {
    console.log('fetch', currentFolder);
    try {
      const response = await axios.get('/api/audit-docs/folders');
      setFolders(response.data.children);
      if(currentFolder){
        const res = await axios.get(`/api/audit-docs/folders/${currentFolderId}`);
        setFolderChildren(prev => ({
          ...prev,
          [currentFolderId]: res.data.children
        }));
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  const loadFolder = async (folderId = null) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/audit-docs/folders/${folderId || ''}`);
      const data = response.data;
      
      setCurrentFolder(data.folder);
      setFiles(data.files);
      setFolderPath(data.path || []);
      
      // Update the sidebar context if we have a sidebarContextValue
      if (sidebarContextValue && sidebarContextValue.setSelectedFolder) {
        sidebarContextValue.setSelectedFolder(folderId);
      }
    } catch (error) {
      console.error("Error loading folder:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderFolder = (folder, level = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const hasChildren = folderChildren[folder.id]?.length > 0;
    const handleDownArrowClick = async (e) => {
      e.stopPropagation();
      if (!isExpanded) {
        try {
          // Only fetch children if we haven't loaded them yet
          if (!folderChildren[folder.id]) {
            const response = await axios.get(`/api/audit-docs/folders/${folder.id}`);
            setFolderChildren(prev => ({
              ...prev,
              [folder.id]: response.data.children
            }));
          }
          setExpandedFolders(prev => new Set([...prev, folder.id]));
        } catch (error) {
          console.error("Error loading nested folders:", error);
        }
      } else {
        setExpandedFolders(prev => {
          const next = new Set(prev);
          next.delete(folder.id);
          return next;
        });
      }
    }

    return (
      <div key={folder.id} style={{ paddingLeft: `${level * 16}px` }}>
        <div 
          className={`rounded-md hover:bg-gray-100 transition-colors ${currentFolder?.id === folder.id ? 'bg-gray-100' : ''}`}
        >
          <div className="flex items-center p-2">
            <button
              onClick={(e) => handleDownArrowClick(e)}
              className="p-1 mr-1 hover:bg-gray-200 rounded-sm focus:outline-none"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 text-gray-500 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div 
              onClick={(e) => {
                loadFolder(folder.id)
                handleDownArrowClick(e)
              }}
              className="flex items-center flex-1 cursor-pointer"
            >
              <svg className="h-5 w-5 text-yellow-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
              <span className="truncate text-sm">{folder.name}</span>
            </div>
            
            {canManage && (
              <div className="relative group">
                <button className="text-gray-500 hover:text-gray-700 p-1">
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 hover:opacity-100 hover:visible">
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
                      onClick={() => handleDeleteFolder(folder.id, folder.parent_id)}
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
        
        {isExpanded && folderChildren[folder.id] && (
          <div className="ml-2">
            {folderChildren[folder.id].map(childFolder => renderFolder(childFolder, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const handleCreateFolder = async () => {
    if (!newFolderName) return;
    
    try {
      const response = await axios.post('/api/audit-docs/folders', {
        name: newFolderName,
        parent_id: currentFolder?.id || null
      });
      
      if (response.status === 201) {
        // Clear the input and close dialog
        setNewFolderName('');
        setShowNewFolderDialog(false);
        // Fetch updated folder list
        await fetchAllFolders(currentFolder.id);
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      setUploadError(error.response?.data?.message || "Failed to create folder");
    }
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files.length) return;
    
    // Reset states
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    const formData = new FormData();
    formData.append('folder_id', currentFolder?.id || folders[0]?.id);
    
    // Add all files to the FormData
    for (let i = 0; i < files.length; i++) {
      formData.append('files[]', files[i]);
    }
    
    try {
      const response = await axios.post('/api/audit-docs/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      // Update the files state with the newly uploaded files
      setFiles(prevFiles => [...prevFiles, ...response.data]);
      
      // Reset the file input
      if (event.target) {
        event.target.value = null;
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadError(error.response?.data?.message || "Failed to upload files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRenameFolder = async () => {
    if (!folderToRename || !newName) return;
    
    try {
      const response = await axios.put(`/api/audit-docs/folders/${folderToRename.id}`, {
        name: newName
      });
      
      const updatedFolder = response.data;
      // Update local state first for immediate feedback
      setFolders(folders.map(folder => 
        folder.id === updatedFolder.id ? updatedFolder : folder
      ));
      setShowRenameFolderDialog(false);
      setFolderToRename(null);
      setNewName('');
      // Fetch updated folder list
      await fetchAllFolders(updatedFolder.parent_id);
    } catch (error) {
      console.error("Error renaming folder:", error);
      setUploadError(error.response?.data?.message || "Failed to rename folder");
    }
  };

  const handleRenameFile = async () => {
    if (!fileToRename || !newName) return;
    
    try {
      const response = await axios.put(`/api/audit-docs/files/${fileToRename.id}`, {
        name: newName
      });
      
      const updatedFile = response.data;
      setFiles(files.map(file => 
        file.id === updatedFile.id ? updatedFile : file
      ));
      setShowRenameFileDialog(false);
      setFileToRename(null);
      setNewName('');
    } catch (error) {
      console.error("Error renaming file:", error);
      setUploadError(error.response?.data?.message || "Failed to rename file");
    }
  };

  const handleDeleteFolder = async (folderId, parent_id) => {
    setDeleteTarget({ type: 'folder', folderId, parent_id });
    setShowDeleteConfirm(true);
  };

  const handleDeleteFiles = async (fileIds) => {
    setDeleteTarget({ type: 'files', fileIds });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === 'folder') {
        await axios.delete(`/api/audit-docs/folders/${deleteTarget.folderId}`);
        
        // Remove from local state for immediate feedback
        setFolders(folders.filter(folder => folder.id !== deleteTarget.folderId));
        // Fetch updated folder list
        await fetchAllFolders(deleteTarget.parent_id);
      } else if (deleteTarget.type === 'files') {
        await axios.delete('/api/audit-docs/files', {
          data: { file_ids: Array.isArray(deleteTarget.fileIds) ? deleteTarget.fileIds : [deleteTarget.fileIds] }
        });
        
        setFiles(files.filter(file => !deleteTarget.fileIds.includes(file.id)));
        setSelectedFiles([]);
      }
    } catch (error) {
      console.error("Error deleting:", error);
      setUploadError(error.response?.data?.message || "Failed to delete");
    }

    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  const downloadFile = (fileId) => {
    window.location.href = `/api/audit-docs/files/${fileId}/download`;
  };

  const downloadFolder = (folderId) => {
    window.location.href = `/api/audit-docs/folders/${folderId}/download`;
  };

  const downloadMultipleFiles = () => {
    if (!selectedFiles.length) return;
    
    // Create a form to post the download request
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/audit-docs/files/download';
    
    // Add CSRF token
    const csrfInput = document.createElement('input');
    csrfInput.type = 'hidden';
    csrfInput.name = '_token';
    csrfInput.value = csrf_token;
    form.appendChild(csrfInput);
    
    // Add selected file IDs
    selectedFiles.forEach(fileId => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'file_ids[]';
      input.value = fileId;
      form.appendChild(input);
    });
    
    // Append form to body, submit it, and then remove it
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
    <BasicLayout>
      <Head title="Audit Documents" />
      
      <div className="flex h-full min-h-screen">
        {/* Collapsible Folders Sidebar */}
        <div className={`bg-gray-50 border-r border-gray-200 overflow-hidden transition-all duration-300 ${showFolders ? 'w-64' : 'w-0'}`}>
          {/* Top Header with Toggle Button */}
          <div className="p-4 border-b border-gray-200 flex justify-center">
            <h2 className="text-lg font-medium text-gray-700">Audit Documents</h2>
          </div>
          
          {/* Folders Content */}
          <div className="overflow-y-auto h-[calc(100vh-5rem)]">
            <div className="p-4">              
              {folders ? (
                <div className="space-y-1">
                  {folders.map(folder => renderFolder(folder))}
                </div>
              ):null}
            </div>
          </div>
        </div>

        {/* Uncollapse button - now positioned next to collapsed sidebar */}
        <div className="relative">
          <button 
            onClick={() => setShowFolders(!showFolders)}
            className="p-2 hover:bg-gray-100 rounded-md focus:outline-none flex items-center justify-center shadow-sm bg-white absolute border border-gray-200"
            title="Show folders"
          >
            {!showFolders ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ): (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div>
            <div className="w-full">
              <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div>
                  {/* Upload Progress Indicator */}
                  {isUploading && (
                    <div className="mb-4 bg-indigo-50 p-4 rounded-md">
                      <div className="mb-1 flex justify-between">
                        <span className="text-sm font-medium text-indigo-700">Uploading files...</span>
                        <span className="text-sm font-medium text-indigo-700">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    </div>
                  )}
                  
                  {uploadError && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{uploadError}</span>
                      </div>
                    </div>
                  )}
                  
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
                      {/* Main content area - Files */}
                      {files.length > 0 ? (
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-medium text-gray-700">Files</h3>
                            {canManage && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setShowNewFolderDialog(true)}
                                  className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                  </svg>
                                  New Folder
                                </button>
                                
                                <label className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                                  <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                  </svg>
                                  Upload Files
                                  <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                    ref={fileInputRef}
                                  />
                                </label>
                                
                                {selectedFiles.length > 0 && (
                                  <button
                                    onClick={downloadMultipleFiles}
                                    className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                  >
                                    <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Download Selected
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-gray-200">
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
                            <div className="mt-6 space-x-3">
                              <button
                                onClick={() => setShowNewFolderDialog(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                New Folder
                              </button>
                              <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
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
                      )}
                    </>
                  )}
                </div>
              </div>
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
              autoFocus
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
                disabled={!newFolderName.trim()}
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

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title={deleteTarget?.type === 'folder' ? 'Delete Folder' : 'Delete Files'}
        message={
          deleteTarget?.type === 'folder'
            ? 'Are you sure you want to delete this folder and all its contents? This action cannot be undone.'
            : 'Are you sure you want to delete the selected file(s)? This action cannot be undone.'
        }
        confirmButtonText={deleteTarget?.type === 'folder' ? 'Delete Folder' : 'Delete Files'}
        type="danger"
      />
    </BasicLayout>
  );
}