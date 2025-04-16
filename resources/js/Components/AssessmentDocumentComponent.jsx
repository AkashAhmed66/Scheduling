import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import JSZip from 'jszip';

export default function AssessmentDocumentComponent() {
    const { job, assesmentDocuments } = usePage().props;
    const [documents, setDocuments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDocuments, setNewDocuments] = useState({ name: '', files: [] });
  
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
          },
          onError: (errors) => {
            console.error('Upload failed:', errors);
          },
        });
      } else {
        alert('Please enter a document name and select at least one file.');
      }
    };
  
    const deleteDocument = (id) => {
      Inertia.delete('/delete-assesment-document/' + id, {
        onSuccess: () => {
          setDocuments((prev) => prev.filter((doc) => doc.id !== id));
        },
        onError: (errors) => {
          console.error('Delete failed:', errors);
        },
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
  
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Assessment Documents</h2>
        {job.jobStatus !== 'completed' && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            onClick={() => setIsModalOpen(true)}
          >
            Upload Document
          </button>
        )}
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Document Name</th>
              <th className="border border-gray-300 px-4 py-2">File Names</th>
              <th className="border border-gray-300 px-4 py-2">Date Uploaded</th>
              <th className="border border-gray-300 px-4 py-2">Download</th>
              <th className="border border-gray-300 px-4 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(groupedDocuments).map((group) => (
              <tr key={group.documentName}>
                <td className="border border-gray-300 px-4 py-2">{group.documentName}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {group.files.map((file) => (
                    <div key={file.id}>{file.fileName}</div>
                  ))}
                </td>
                <td className="border border-gray-300 px-4 py-2">{group.created_at}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => downloadDocumentsAsZip(group.documentName, group.files)}
                  >
                    Download ZIP
                  </button>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {group.files.map((file) => (
                    <button
                      key={file.id}
                      className="text-red-500 hover:underline block"
                      onClick={() => deleteDocument(file.id)}
                    >
                      Delete {file.fileName}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">No documents uploaded.</td>
              </tr>
            )}
          </tbody>
        </table>
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md w-96">
              <h3 className="text-lg font-bold mb-4">Upload Documents</h3>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                placeholder="Document Name"
                value={newDocuments.name}
                onChange={(e) => setNewDocuments((prev) => ({ ...prev, name: e.target.value }))}
              />
              <input type="file" multiple onChange={handleFileUpload} className="w-full mt-2" />
              <div className="flex justify-end gap-2 mt-4">
                <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addDocuments}>Upload</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}
