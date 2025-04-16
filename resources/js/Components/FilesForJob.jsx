import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react'; 
import { Inertia } from '@inertiajs/inertia'; 

export default function FilesForJob() {
  const { fileStructure, jobId } = usePage().props;
  const [fileSystem, setFileSystem] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadFolder, setUploadFolder] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  const simplifyFiles = (files, parent) => {
    var obj = {};
    Object.keys(files).forEach((key) => {
      if(files[key] != null &&files[key].folder == parent){
        // console.log('here', files[key].name, files[key].folder)
        if(files[key].path != null){
          obj[files[key].name] = files;
        }else{
          var ret = simplifyFiles(files, files[key].id);
          obj[files[key].name] = ret;
        }
      }
    });
    return obj;
  };
  useEffect(() => {
    var ret = simplifyFiles(fileStructure, null);
    console.log('simp', ret);
  }, [fileStructure]);  


  // Collect FileSystem Data into FormData
  const collectFileSystemData = (data, parentPath = '', formData = new FormData()) => {
    Object.keys(data).forEach((key) => {
      const currentPath = parentPath ? `${parentPath}/${key}` : key;

      if (typeof data[key] === 'object') {
        // Recursively collect folder contents
        collectFileSystemData(data[key], currentPath, formData);
      } else {
        // Append files to FormData
        formData.append(`files[${currentPath}]`, data[key]);
      }
    });

    return formData;
  };

  // Handle file selection
  const handleFileSelection = (event) => {
    setSelectedFiles([...event.target.files]);
  };

  // Handle file upload
  const handleUploadFile = () => {
    if (selectedFiles.length > 0) {
      let currentFolder = fileSystem;
      currentPath.split('/').forEach((folder) => {
        currentFolder = currentFolder[folder];
      });

      selectedFiles.forEach((file) => {
        currentFolder[file.name] = file;
      });

      setFileSystem({ ...fileSystem });
      setSelectedFiles([]);
      setUploadFolder(false);
    } else {
      alert('No files selected!');
    }
  };

  // Create Folder
  const handleCreateFolder = (parentPath, folderName) => {
    const pathParts = parentPath.split('/');
    let current = fileSystem;

    if (parentPath) {
      pathParts.forEach((part) => {
        current = current[part];
      });
    }

    current[folderName] = {};
    setFileSystem({ ...fileSystem });
  };

  // Delete File or Folder
  const handleDelete = (parentPath, key) => {
    const pathParts = parentPath.split('/');
    let current = fileSystem;

    if (parentPath) {
      pathParts.forEach((part) => {
        current = current[part];
      });
    }

    delete current[key];
    setFileSystem({ ...fileSystem });
  };

  // Submit form data
  const handleSubmit = () => {
    var formData = [];
    formData.push(jobId);
    formData.push(fileSystem);
   console.log(fileSystem);
    // Inertia.post('/submit-audit-files', formData, {
    //   onSuccess: (response) => {
    //     console.log('Data successfully submitted:', response);
    //     // Handle successful submission (e.g., show a success message)
    //   },
    //   onError: (errors) => {
    //     console.error('Error during submission:', errors);
    //     // Handle form validation errors (if any)
    //   },
    // });
  };

  // Render File System
  const renderFileSystem = (files, parentPath = '') => {
    return Object.keys(files).map((key) => {
      const currentPath = parentPath ? `${parentPath}/${key}` : key;

      if (typeof files[key] === 'object' && files[key].lastModified == null) {
        return (
          <div key={key} className="ml-4">
            <div className="flex justify-between items-center bg-blue-100 p-2 rounded-lg mt-2">
              <span className="font-bold text-blue-600">{key}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleCreateFolder(currentPath, prompt('Enter folder name:'))}
                  className="px-2 py-1 bg-green-500 text-white rounded-md text-xs hover:bg-green-600"
                >
                  Create Folder
                </button>
                <button
                  onClick={() => {
                    setUploadFolder(true);
                    setCurrentPath(currentPath);
                  }}
                  className="px-2 py-1 bg-yellow-500 text-white rounded-md text-xs hover:bg-yellow-600"
                >
                  Upload File
                </button>
                <button
                  onClick={() => handleDelete(parentPath, key)}
                  className="px-2 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
            {renderFileSystem(files[key], currentPath)}
          </div>
        );
      }

      return (
        <div key={key} className="ml-6 flex justify-between items-center p-2 hover:bg-gray-100 rounded-lg mt-2">
          <span>{key}</span>
          <button
            onClick={() => handleDelete(parentPath, key)}
            className="px-2 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      );
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Assessment Documents</h2>

      <div className="mb-6">
        <button
          onClick={() => handleCreateFolder('', prompt('Enter folder name:'))}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Create Folder
        </button>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">File System</h3>
        <div className="space-y-2">{renderFileSystem(fileSystem)}</div>
      </div>

      {uploadFolder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Select Files to Upload</h3>
            <input
              type="file"
              multiple
              onChange={handleFileSelection}
              className="mb-4 p-2 border border-gray-300 rounded-md w-full"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setUploadFolder(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Close
              </button>
              <button
                onClick={handleUploadFile}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Upload Files
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Submit All Files and Folders
        </button>
      </div>
    </div>
  );
}
