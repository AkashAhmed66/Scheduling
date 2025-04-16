import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';
import axios from "axios";

export default function AssesmentComponent() {
  const { question, user, assessment } = usePage().props;
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    setQuestions(question);
    console.log(questions);
  }, [question]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleChange = async (e, index, field) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = e.target.value;
    setQuestions(updatedQuestions);
  
    try {
      await axios.put(`/update-assessment/${updatedQuestions[index].id}`, {
        [field]: updatedQuestions[index][field],
      });
  
      console.log("Update successful");
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Assessment Report', 14, 20);

    const columns = [
      'ID',
      'Question',
      'Answer',
      'Findings',
      'Risk Rating',
      'Legal Ref',
      'Recommendation',
    ];

    const rows = questions.map((ques) => [
      ques.id,
      ques.question,
      ques.answer,
      ques.answer === 'No' ? ques.findings : 'N/A',
      ques.answer === 'No' ? ques.risk_rating : 'N/A',
      ques.answer === 'No' ? ques.legal_ref : 'N/A',
      ques.answer === 'No' ? ques.recommendation : 'N/A',
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 30,
    });

    doc.save('Assessment_Report.pdf');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setUploadedFile(file);
  };

  const OnUpload = (e) => {
    const formData = new FormData();
    formData.append('file', uploadedFile);

    console.log('on upload file:', formData);

    Inertia.post('/upload-excel', formData, {
      onStart: () => {
        console.log('Uploading file...');
      },
      onFinish: () => {
        console.log('File upload finished.');
      },
      onError: (error) => {
        console.error('Error uploading file:', error);
      }
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setUploadedFile(null);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <h2 className="text-2xl font-bold">Assessment Evaluation</h2>
            <p className="mt-1 text-indigo-100">Evaluate and manage your assessment questions</p>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={generatePDF}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Download PDF
              </button>
              {user.role == '0' && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-lg transition-all duration-200 hover:from-emerald-600 hover:to-green-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                  </svg>
                  Upload Excel
                </button>
              )}
            </div>

            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Question ID</th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Question</th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Answer</th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Findings</th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Risk Rating</th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Legal Ref</th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {questions.map((question, index) => (
                    <tr key={question.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{question.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-800">{question.question}</td>
                      <td className="py-3 px-4">
                        <select
                          value={question.answer}
                          onChange={(e) => handleChange(e, index, 'answer')}
                          className={`w-full py-2 px-3 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:outline-none transition-colors ${
                            question.answer === 'Yes' 
                              ? 'text-green-800 bg-green-50 border-green-200 focus:border-green-300 focus:ring-green-200' 
                              : 'text-red-800 bg-red-50 border-red-200 focus:border-red-300 focus:ring-red-200'
                          }`}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        {question.answer === 'No' ? (
                          <input
                            type="text"
                            value={question.findings}
                            onChange={(e) => handleChange(e, index, 'findings')}
                            className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300 focus:ring-opacity-50 focus:outline-none"
                            placeholder="Enter findings..."
                          />
                        ) : (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {question.answer === 'No' ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            question.risk_rating === 'High' ? 'bg-red-100 text-red-800' :
                            question.risk_rating === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {question.risk_rating}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {question.answer === 'No' ? (
                          <input
                            type="text"
                            value={question.legal_ref}
                            onChange={(e) => handleChange(e, index, 'legal_ref')}
                            className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300 focus:ring-opacity-50 focus:outline-none"
                            placeholder="Enter legal reference..."
                          />
                        ) : (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {question.answer === 'No' ? (
                          <input
                            type="text"
                            value={question.recommendation}
                            onChange={(e) => handleChange(e, index, 'recommendation')}
                            className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300 focus:ring-opacity-50 focus:outline-none"
                            placeholder="Enter recommendation..."
                          />
                        ) : (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Upload Excel File</h3>
              <button 
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-4 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Excel File</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input 
                        type="file" 
                        accept=".xls,.xlsx" 
                        onChange={handleFileUpload}
                        className="sr-only" 
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">Excel files only (.xls, .xlsx)</p>
                </div>
              </div>
              {uploadedFile && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected file: <span className="font-medium">{uploadedFile.name}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={handleModalClose}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={OnUpload}
                disabled={!uploadedFile}
                className={`inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${!uploadedFile ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
