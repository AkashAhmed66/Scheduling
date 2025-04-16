import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function TempFolders() {
  const { job, supportingDocuments, dontDelete } = usePage().props;
  const [documents, setDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({ name: '', file: null });

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
        },
        onError: (errors) => {
          console.error('Upload failed:', errors);
        },
      });
    } else {
      alert('Please fill all fields and upload a file.');
    }
  };

  // Delete a document
  const deleteDocument = (id) => {
    Inertia.delete('/delete-supporting-document/' + id, {
      onSuccess: () => {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      },
      onError: (errors) => {
        console.error('delete failed:', errors);
      },
    });
  };

  // Download a document (mock functionality)
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

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Audit Documents</h2>
      {/* Upload Button */}
      {job.jobStatus != 'completed' && 
        <div className="mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            onClick={() => setIsModalOpen(true)}
          >
            Upload Document
          </button>
        </div>
      }
      {/* Documents Table */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Document Name</th>
            <th className="border border-gray-300 px-4 py-2">Date Uploaded</th>
            <th className="border border-gray-300 px-4 py-2">Download</th>
            {dontDelete &&
                <th className="border border-gray-300 px-4 py-2">Delete</th>
            }
          </tr>
        </thead>
        <tbody>
          {documents && documents.map((doc) => (
            <tr key={doc.id}>
              <td className="border border-gray-300 px-4 py-2">{doc.name}</td>
              <td className="border border-gray-300 px-4 py-2">{doc.created_at}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => downloadDocument(doc.path)}
                >
                  Download
                </button>
              </td>
              {dontDelete &&
                <td className="border border-gray-300 px-4 py-2">
                    <button
                    className="text-red-500 hover:underline"
                    onClick={() => deleteDocument(doc.id)}
                    >
                    Delete
                    </button>
                </td>
              }
            </tr>
          ))}
          {documents && documents.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4">No documents uploaded.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for Uploading Documents */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Upload Document</h3>
            <div className="mb-4">
              <label className="block font-medium mb-2">Document Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={newDocument.name}
                onChange={(e) => setNewDocument((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Upload File</label>
              <input
                type="file"
                className="w-full"
                onChange={handleFileUpload}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={addDocument}
              >
                Add Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
