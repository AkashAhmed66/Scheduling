import React, { useContext, useEffect, useState } from "react";
import SidebarContext from "../Context/SideBarContext";

export default function AuditDocsComponent() {
  const { state, update } = useContext(SidebarContext);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // Use your original extractDocuments function
    const extractDocuments = (data) => {
      let documents = [];
      data.children &&
        data.children.map((item) => {
          if (item.type === "document") {
            documents.push(item);
          }
          if (item.type === "folder" && item.children) {
            documents = documents.concat(extractDocuments(item.children));
          }
        });
      return documents;
    };

    setDocuments(extractDocuments(state));
  }, [state]);

  // Handle download action
  const handleDownload = (doc) => {
    alert(`Downloading: ${doc.name}`); // Replace with real download logic
  };

  // Handle delete action
  const handleDelete = (docId) => {
    alert(`Deleting document with ID: ${docId}`); // Placeholder
    // Simulate deletion by updating the SidebarContext
    const removeDocument = (data, id) => {
      return data.map((item) => {
        if (item.children) {
          item.children = removeDocument(item.children, id);
        }
        return item.id !== id ? item : null;
      }).filter(Boolean); // Remove null values
    };

    const updatedState = removeDocument(state, docId);
    update(updatedState); // Update context
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-8">
        Audit Documents
      </h1>
      <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.length > 0 ? (
              documents.map((doc) => (
                <tr key={doc.id} className="even:bg-gray-100 odd:bg-white">
                  <td className="border border-gray-300 px-4 py-2">{doc.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{doc.name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                >
                  No documents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
