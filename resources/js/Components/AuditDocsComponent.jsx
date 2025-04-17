import React, { useContext } from 'react';
import { Inertia } from '@inertiajs/inertia';
// import { AuditContext } from '@/Context/AuditContext';

export default function AuditDocsComponent() {
  // const { state } = useContext(AuditContext);

  const extractDocuments = () => {
    if (!state || !state.audit || !state.audit.documents) {
      return [];
    }
    return state.audit.documents;
  };

  const handleDownload = (documentId, fileName) => {
    const url = `/document/${documentId}/download`;
    
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(error => {
        console.error('Error downloading document:', error);
      });
  };

  const handleDelete = (documentId) => {
    if (confirm('Are you sure you want to delete this document?')) {
      Inertia.delete(`/document/${documentId}`);
    }
  };

  const getDocumentIcon = (fileType) => {
    const type = fileType ? fileType.toLowerCase() : '';
    
    if (type.includes('pdf')) {
      return (
        <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      );
    } else if (type.includes('doc') || type.includes('docx')) {
      return (
        <svg className="w-10 h-10 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      );
    } else if (type.includes('xls') || type.includes('xlsx')) {
      return (
        <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
        </svg>
      );
    } else if (type.includes('jpg') || type.includes('jpeg') || type.includes('png') || type.includes('gif')) {
      return (
        <svg className="w-10 h-10 text-purple-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    }
  };
  
  const documents = extractDocuments();

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Audit Documents</h2>
            <p className="text-gray-600 mt-1">Manage and view your audit documentation</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="text-sm text-gray-500 mr-2">{documents.length} documents</span>
            <span className="inline-block h-6 w-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
              {documents.length}
            </span>
          </div>
        </div>

        {documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((document) => (
              <div 
                key={document.id} 
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <div className="p-5 flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-gradient-to-br from-indigo-50 to-purple-50 p-3 rounded-lg">
                    {getDocumentIcon(document.file_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors duration-200">{document.file_name}</h3>
                    <p className="mt-1 text-xs text-gray-500 flex items-center">
                      <span className="uppercase font-semibold tracking-wider bg-gray-100 px-2 py-1 rounded-full">{document.file_type}</span>
                      <span className="mx-2">•</span>
                      <span>{document.file_size}</span>
                    </p>
                  </div>
                </div>
                
                <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 flex justify-between">
                  <button
                    onClick={() => handleDownload(document.id, document.file_name)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Download
                  </button>
                  
                  <button
                    onClick={() => handleDelete(document.id)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex items-center justify-center">
              <svg className="h-10 w-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No documents found</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Upload documents to your audit to get started with document management.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
