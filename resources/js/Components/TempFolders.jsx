import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function TempFolders() {
  const { job, supportingDocuments, dontDelete } = usePage().props;
  const [documents, setDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({ name: '', file: null });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setDocuments(supportingDocuments);
    console.log(supportingDocuments);
  }, [supportingDocuments]);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDocument((prev) => ({ ...prev, file }));
    }
  };

  // Add new document and upload to server
  const addDocument = () => {
    if (newDocument.name && newDocument.file) {
      setUploading(true);
      const formData = new FormData();
      formData.append('documentName', newDocument.name);
      formData.append('file', newDocument.file);
      formData.append('fileName', newDocument.file.name);
      formData.append('jobId', job.id); 

      console.log(formData);
      // Send POST request using Inertia
      Inertia.post('/upload-supporting-document', formData, {
        onSuccess: () => {
          setDocuments((prev) => [
            ...prev,
            {
              id: Date.now(),
              name: newDocument.name,
              fileName: newDocument.file.name,
              dateUploaded: new Date().toLocaleDateString(),
            },
          ]);
          setNewDocument({ name: '', file: null });
          setIsModalOpen(false);
          setUploading(false);
        },
        onError: (errors) => {
          console.error('Upload failed:', errors);
          setUploading(false);
        },
      });
    } else {
      alert('Please fill all fields and upload a file.');
    }
  };

  // Delete a document
  const deleteDocument = (id) => {
    if(confirm('Are you sure you want to delete this document?')) {
      Inertia.delete('/delete-supporting-document/' + id, {
        onSuccess: () => {
          setDocuments((prev) => prev.filter((doc) => doc.id !== id));
        },
        onError: (errors) => {
          console.error('delete failed:', errors);
        },
      });
    }
  };

  // Download a document
  const downloadDocument = (filePath) => {
    // Assuming 'filePath' is a relative path, like 'public/assesment_documents/yourfile.xlsx'
    const baseURL = '/storage/'; // Laravel's default public folder is mapped to 'storage'

    // Create the complete file URL by joining the base URL and the file path
    const fullFileURL = `${baseURL}${filePath}`;

    // Create an invisible anchor element to trigger the download
    const link = document.createElement('a');
    link.href = fullFileURL;
    link.download = filePath.split('/').pop(); // Get the file name from the path for the download

    // Append the link to the body (it won't be visible)
    document.body.appendChild(link);

    // Trigger the click event on the link to initiate the download
    link.click();

    // Clean up by removing the link element
    document.body.removeChild(link);
  };

  // Helper function to get file icon based on file name
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Audit Documents</h2>
        
        {/* Upload Button */}
        {job.jobStatus != 'completed' && (
          <button
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
            onClick={() => setIsModalOpen(true)}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            Upload Document
          </button>
        )}
      </div>
      
      {/* Documents Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Document Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date Uploaded</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents && documents.length > 0 ? (
              documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getFileIcon(doc.path)}
                      <span className="ml-2 text-sm font-medium text-gray-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.created_at}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => downloadDocument(doc.path)}
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                        <span className="ml-1">Download</span>
                      </button>
                      
                      {dontDelete && (
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                          <span className="ml-1">Delete</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
                  <p className="mt-1 text-sm text-gray-500">Upload documents to get started.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Uploading Documents */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full transform transition-all">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
              <h3 className="text-lg font-bold text-white">Upload Document</h3>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                <input
                  type="text"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2 border"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter document name"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only"
                          onChange={handleFileUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, Word, Excel or image files
                    </p>
                  </div>
                </div>
                {newDocument.file && (
                  <div className="mt-2 text-sm text-gray-700 flex items-center">
                    <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="font-medium">{newDocument.file.name}</span>
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
                  disabled={uploading || !newDocument.name || !newDocument.file}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${(uploading || !newDocument.name || !newDocument.file) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={addDocument}
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : 'Upload Document'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
