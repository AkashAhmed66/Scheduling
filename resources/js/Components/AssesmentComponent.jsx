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
    </div>
  );
}
