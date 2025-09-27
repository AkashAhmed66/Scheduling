import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import JSZip from 'jszip';

export default function AssessmentDocumentComponent() {
    const { job, assesmentDocuments } = usePage().props;
    const [documents, setDocuments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDocuments, setNewDocuments] = useState({ name: '', files: [] });
    const [uploading, setUploading] = useState(false);
  
    useEffect(() => {
      setDocuments(assesmentDocuments);
    }, [assesmentDocuments]);
  
    const handleFileUpload = (e) => {
      const files = Array.from(e.target.files);
      if (files.length) {
        setNewDocuments((prev) => ({ ...prev, files }));
      }
    };
  
    const addDocuments = () => {
      if (newDocuments.name && newDocuments.files.length) {
        setUploading(true);
        const formData = new FormData();
        formData.append('documentName', newDocuments.name);
        formData.append('jobId', job.id);
  
        newDocuments.files.forEach((file, index) => {
          formData.append(`files[]`, file);
        });
  
        Inertia.post('/upload-assesment-document', formData, {
          onSuccess: () => {
            const uploadedDocs = newDocuments.files.map((file) => ({
              id: Date.now() + Math.random(),
              name: newDocuments.name,
              fileName: file.name,
              dateUploaded: new Date().toLocaleDateString(),
            }));
            setDocuments((prev) => [...prev, ...uploadedDocs]);
            setNewDocuments({ name: '', files: [] });
            setIsModalOpen(false);
            setUploading(false);
          },
          onError: (errors) => {
            console.error('Upload failed:', errors);
            setUploading(false);
          },
        });
      } else {
        alert('Please enter a document name and select at least one file.');
      }
    };
  
    const deleteDocument = (id) => {
      if (confirm('Are you sure you want to delete this document?')) {
        Inertia.delete('/delete-assesment-document/' + id, {
          onSuccess: () => {
            setDocuments((prev) => prev.filter((doc) => doc.id !== id));
          },
          onError: (errors) => {
            console.error('Delete failed:', errors);
          },
        });
      }
    };

    const deleteAllDocuments = (files) => {
      files.forEach((file) => {
        Inertia.delete('/delete-assesment-document/' + file.id, {
          onSuccess: () => {
            setDocuments((prev) => prev.filter((doc) => doc.id !== file.id));
          },
          onError: (errors) => {
            console.error('Delete failed:', errors);
          },
        });
      });
    };

    const downloadDocumentsAsZip = async (docName, files) => {
        try {
            console.log("files", files);
            const zip = new JSZip();
            
            // Fetch all files concurrently
            const fetchPromises = files.map(async (file) => {
                try {
                    const response = await fetch(`/storage/${file.filePath}`);
                    if (!response.ok) throw new Error(`Failed to fetch ${file.fileName}`);
                    const blob = await response.blob();
                    zip.file(file.fileName, blob); // Add each file to the ZIP
                } catch (err) {
                    console.error(`Error fetching ${file.fileName}:`, err);
                }
            });
    
            await Promise.all(fetchPromises); // Ensure all files are fetched and added
    
            // Generate ZIP and download
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = `${docName}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error creating ZIP:", error);
            alert("Failed to download files. Please try again.");
        }
    };
  
    const groupedDocuments = documents.reduce((acc, doc) => {
      if (!acc[doc.documentName]) {
        acc[doc.documentName] = {
          documentName: doc.documentName,
          created_at: doc.created_at,
          files: []
        };
      }
      acc[doc.documentName].files.push(doc);
      return acc;
    }, {});

    // Helper functions to get file icons
    const getFileIcon = (fileName) => {
      if (!fileName) return null;
      const extension = fileName.split('.').pop().toLowerCase();
      
      if (['pdf'].includes(extension)) {
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      } else if (['doc', 'docx'].includes(extension)) {
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      } else if (['xls', 'xlsx', 'csv'].includes(extension)) {
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
          </svg>
        );
      } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
        return (
          <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        );
      } else {
        return (
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
      }
    };
  
    return (
      <div>
        <div className="w-full">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <h2 className="text-2xl font-bold">Assessment Documents</h2>
              <p className="mt-1 text-indigo-100">Manage your assessment files and documentation</p>
            </div>
            
            <div className="p-6">
              {job.jobStatus !== 'completed' && (
                <div className="mb-6">
                  <button
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    Upload Document
                  </button>
                </div>
              )}
              
              <div className="overflow-x-auto shadow-md rounded-lg">
                {Object.keys(groupedDocuments).length > 0 ? (
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Document Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Uploader</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Files</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date Uploaded</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.values(groupedDocuments).map((group) => (
                        <tr key={group.documentName} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{group.documentName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{group.files[0].uploader}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              {group.files.map((file) => (
                                <div key={file.id} className="flex items-center text-sm text-gray-500">
                                  {getFileIcon(file.fileName)}
                                  <span className="ml-1">{file.fileName}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {group.created_at}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            <div className="flex justify-center space-x-3">
                              <button
                                onClick={() => downloadDocumentsAsZip(group.documentName, group.files)}
                                className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                              >
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                </svg>
                                <span>Download ZIP</span>
                              </button>
                              
                              <div className="border-r border-gray-300 h-6"></div>
                              
                              <button 
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete all files in this document group?')) {
                                    deleteAllDocuments(group.files);
                                  }
                                }}
                                className="text-red-600 hover:text-red-900 inline-flex items-center"
                              >
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                <span>Delete All</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
                    <p className="mt-1 text-sm text-gray-500">Upload documents to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Modal for Uploading Documents */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full transform transition-all">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                <h3 className="text-lg font-bold text-white">Upload Assessment Documents</h3>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2 border"
                    placeholder="Enter document name"
                    value={newDocuments.name}
                    onChange={(e) => setNewDocuments((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Files</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                          <span>Upload files</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="sr-only"
                            onChange={handleFileUpload}
                            multiple
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        You can select multiple files
                      </p>
                    </div>
                  </div>
                  {newDocuments.files.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">Selected files ({newDocuments.files.length}):</p>
                      <div className="max-h-32 overflow-y-auto pr-2 space-y-1">
                        {newDocuments.files.map((file, index) => (
                          <div key={index} className="text-sm text-gray-700 flex items-center">
                            <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span className="truncate">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={uploading || !newDocuments.name || !newDocuments.files.length}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${(uploading || !newDocuments.name || !newDocuments.files.length) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={addDocuments}
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : 'Upload Documents'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}
