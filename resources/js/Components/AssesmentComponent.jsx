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
      // console.log(ques)
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
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-center">Assessment Table</h2>
        <div>
          <button
            onClick={generatePDF}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
          >
            Download PDF
          </button>
          {user.role == '0' &&
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Upload Excel
          </button>
          }
        </div>
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="p-4 text-left border-b">Question Number (ID)</th>
            <th className="p-4 text-left border-b">Question</th>
            <th className="p-4 text-left border-b">Answer</th>
            <th className="p-4 text-left border-b">Findings</th>
            <th className="p-4 text-left border-b">Risk Rating</th>
            <th className="p-4 text-left border-b">Legal Ref</th>
            <th className="p-4 text-left border-b">Recommendation</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question, index) => (
            <tr key={question.id} className="odd:bg-gray-50 even:bg-gray-100">
              <td className="p-4 border-b">{question.id}</td>
              <td className="p-4 border-b">{question.question}</td>
              <td className="p-4 border-b">
                <select
                  value={question.answer}
                  onChange={(e) => handleChange(e, index, 'answer')}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>

              {question.answer === 'No' && (
                <>
                  <td className="p-4 border-b">
                    <input
                      type="text"
                      value={question.findings}
                      onChange={(e) => handleChange(e, index, 'findings')}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </td>
                  <td className="p-4 border-b">{question.risk_rating}</td>
                  <td className="p-4 border-b">
                    <input
                      type="text"
                      value={question.legal_ref}  
                      onChange={(e) => handleChange(e, index, 'legal_ref')}  
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </td>
                  <td className="p-4 border-b">
                    <input
                      type="text"
                      value={question.recommendation}
                      onChange={(e) => handleChange(e, index, 'recommendation')}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Upload Excel</h3>
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleModalClose}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={OnUpload}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
