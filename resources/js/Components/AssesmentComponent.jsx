import React, { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';
import axios from "axios";
import ConfirmationModal from './ConfirmationModal';
import { Editor } from '@tinymce/tinymce-react';
import '../../css/quill-custom.css';

// TinyMCE editor configuration
const editorConfig = {
  height: 200,
  menubar: false,
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
  ],
  toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
};

export default function AssesmentComponent() {
  const { question, user, assessment, riskRatings, overallRatings } = usePage().props;
  const [questions, setQuestions] = useState([]);
  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [collapsedSubcategories, setCollapsedSubcategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [currentRiskRatings, setCurrentRiskRatings] = useState([]);
  const [currentOverallRatings, setCurrentOverallRatings] = useState([]);
  const [showTextEditorModal, setShowTextEditorModal] = useState(false);
  const [currentEditingField, setCurrentEditingField] = useState(null);
  const [currentEditingQuestion, setCurrentEditingQuestion] = useState(null);
  const [editorContent, setEditorContent] = useState('');

  // Toggle functions for collapsible sections
  const toggleCategory = (category) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleSubcategory = (categorySubcategoryKey) => {
    setCollapsedSubcategories(prev => ({
      ...prev,
      [categorySubcategoryKey]: !prev[categorySubcategoryKey]
    }));
  };

  const scrollToCategory = (category) => {
    const categoryElement = document.getElementById(`category-${category}`);
    if (categoryElement) {
      categoryElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };
  const [assessmentInfo, setAssessmentInfo] = useState({
    // Assessor Information
    auditCompany: '',
    reportNo: '',
    assessmentType: '',
    reportHeading: '',
    scheduleType: '',
    assessors: '',
    assessmentDate: '',
    capaHeading: '',
    
    // Facility Information
    facilityName: '',
    facilityAddress: '',
    businessLicense: '',
    country: '',
    yearEstablishment: '',
    buildingDescription: '',
    multipleTenants: '',
    siteOwned: '',
    monthlyProduction: '',
    primaryContactName: '',
    position: '',
    email: '',
    contactNumber: '',
    socialComplianceContact: '',
    
    // Employee Information
    numberOfEmployees: '',
    numberOfWorkers: '',
    maleEmployees: '',
    femaleEmployees: '',
    localWorkers: '',
    foreignWorkers: '',
    workerTurnoverRate: '',
    laborAgentUsed: '',
    managementLanguage: '',
    workersLanguage: '',
    
    // Assessment Overviews
    generalAssessmentOverview: '',
    facilityGoodPractices: '',
    workerInterview: '',
    additionalInfo: '',
    disclaimer: '',
    
    // Image
    facilityImage: null
  });

  useEffect(() => {
    setQuestions(question);
    
    // Group questions by category and subcategory
    const grouped = question.reduce((acc, q) => {
      const category = q.category || 'Uncategorized';
      const subcategory = q.subcategory || 'General';
      
      if (!acc[category]) {
        acc[category] = {};
      }
      if (!acc[category][subcategory]) {
        acc[category][subcategory] = [];
      }
      
      acc[category][subcategory].push(q);
      return acc;
    }, {});
    
    setGroupedQuestions(grouped);
    console.log('Grouped questions:', grouped);

    // Set risk ratings and overall ratings for current assessment type
    if (assessment && assessment.type) {
      const filteredRiskRatings = (riskRatings || []).filter(rating => rating.type === assessment.type);
      const filteredOverallRatings = (overallRatings || []).filter(rating => rating.type === assessment.type);
      setCurrentRiskRatings(filteredRiskRatings);
      setCurrentOverallRatings(filteredOverallRatings);
    }

    // Load existing assessment info
    loadAssessmentInfo();
  }, [question, riskRatings, overallRatings, assessment]);

  const loadAssessmentInfo = async () => {
    try {
      const assessmentId = assessment?.id;
      if (!assessmentId) {
        // Load default values from JSON files even if no assessment ID
        await loadDefaultValues();
        return;
      }

      const response = await axios.get(`/assessment-info/${assessmentId}`);
      
      if (response.data.success && response.data.data) {
        const data = response.data.data;
        
        // Convert snake_case to camelCase for state
        const convertedData = {
          auditCompany: data.audit_company || '',
          reportNo: data.report_no || '',
          assessmentType: data.assessment_type || '',
          reportHeading: data.report_heading || '',
          scheduleType: data.schedule_type || '',
          assessors: data.assessors || '',
          assessmentDate: data.assessment_date || '',
          capaHeading: data.capa_heading || '',
          facilityName: data.facility_name || '',
          facilityAddress: data.facility_address || '',
          businessLicense: data.business_license || '',
          country: data.country || '',
          yearEstablishment: data.year_establishment || '',
          buildingDescription: data.building_description || '',
          multipleTenants: data.multiple_tenants || '',
          siteOwned: data.site_owned || '',
          monthlyProduction: data.monthly_production || '',
          primaryContactName: data.primary_contact_name || '',
          position: data.position || '',
          email: data.email || '',
          contactNumber: data.contact_number || '',
          socialComplianceContact: data.social_compliance_contact || '',
          numberOfEmployees: data.number_of_employees || '',
          numberOfWorkers: data.number_of_workers || '',
          maleEmployees: data.male_employees || '',
          femaleEmployees: data.female_employees || '',
          localWorkers: data.local_workers || '',
          foreignWorkers: data.foreign_workers || '',
          workerTurnoverRate: data.worker_turnover_rate || '',
          laborAgentUsed: data.labor_agent_used || '',
          managementLanguage: data.management_language || '',
          workersLanguage: data.workers_language || '',
          generalAssessmentOverview: data.general_assessment_overview || '',
          facilityGoodPractices: data.facility_good_practices || '',
          workerInterview: data.worker_interview || '',
          additionalInfo: data.additional_info || '',
          disclaimer: data.disclaimer || '',
          facilityImage: null // We don't load the file, just show path if exists
        };
        
        setAssessmentInfo(convertedData);
        
        // If any of the rich text fields are empty, load defaults for those fields
        if (!data.general_assessment_overview || !data.facility_good_practices || 
            !data.worker_interview || !data.additional_info || !data.disclaimer) {
          await loadDefaultValues(convertedData);
        }
      } else {
        // If no existing data, load default values from JSON files
        await loadDefaultValues();
      }
    } catch (error) {
      // Load default values from JSON files if no assessment info exists yet
      console.log('No existing assessment info found, loading defaults:', error);
      await loadDefaultValues();
    }
  };

  const loadDefaultValues = async (existingData = null) => {
    try {
      // Load default values from JSON files
      const [overviewResponse, goodPracticeResponse, workerInterviewResponse, additionalInfoResponse, disclaimerResponse] = await Promise.all([
        fetch('/json/assessmentOverview.json'),
        fetch('/json/goodPractice.json'),
        fetch('/json/workerInterview.json'),
        fetch('/json/additionalInformation.json'),
        fetch('/json/disclaimerAndMethod.json')
      ]);

      const overviewData = await overviewResponse.json();
      const goodPracticeData = await goodPracticeResponse.json();
      const workerInterviewData = await workerInterviewResponse.json();
      const additionalInfoData = await additionalInfoResponse.json();
      const disclaimerData = await disclaimerResponse.json();

      setAssessmentInfo(prev => ({
        ...prev,
        generalAssessmentOverview: (existingData?.generalAssessmentOverview || prev.generalAssessmentOverview) || overviewData.assessmentOverview || '',
        facilityGoodPractices: (existingData?.facilityGoodPractices || prev.facilityGoodPractices) || goodPracticeData.goodPractices || '',
        workerInterview: (existingData?.workerInterview || prev.workerInterview) || workerInterviewData.detailsOfWorkersInterview || '',
        additionalInfo: (existingData?.additionalInfo || prev.additionalInfo) || additionalInfoData.additionalInformation || '',
        disclaimer: (existingData?.disclaimer || prev.disclaimer) || disclaimerData.disclaimer || ''
      }));
    } catch (error) {
      console.log('Error loading default values from JSON files:', error);
    }
  };

  const handleChange = async (e, questionItem, field) => {
    const updatedQuestions = questions.map(q => 
      q.id === questionItem.id ? { ...q, [field]: e.target.value } : q
    );
    setQuestions(updatedQuestions);

    // Update grouped questions as well
    const grouped = updatedQuestions.reduce((acc, q) => {
      const category = q.category || 'Uncategorized';
      const subcategory = q.subcategory || 'General';
      
      if (!acc[category]) {
        acc[category] = {};
      }
      if (!acc[category][subcategory]) {
        acc[category][subcategory] = [];
      }
      
      acc[category][subcategory].push(q);
      return acc;
    }, {});
    
    setGroupedQuestions(grouped);
  
    try {
      await axios.put(`/update-assessment/${questionItem.id}`, {
        [field]: e.target.value,
      });
  
      console.log("Update successful");
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleInfoChange = (field, value) => {
    setAssessmentInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const openTextEditor = (questionItem, field) => {
    setCurrentEditingQuestion(questionItem);
    setCurrentEditingField(field);
    // If the field contains plain text without HTML tags, keep it as is
    // If it contains HTML tags, use it directly
    const currentValue = questionItem[field] || '';
    setEditorContent(currentValue);
    setShowTextEditorModal(true);
  };

  const saveTextEditorContent = async () => {
    if (!currentEditingQuestion || !currentEditingField) return;

    // Update local state
    const updatedQuestions = questions.map(q => 
      q.id === currentEditingQuestion.id ? { ...q, [currentEditingField]: editorContent } : q
    );
    setQuestions(updatedQuestions);

    // Update grouped questions as well
    const grouped = updatedQuestions.reduce((acc, q) => {
      const category = q.category || 'Uncategorized';
      const subcategory = q.subcategory || 'General';
      
      if (!acc[category]) {
        acc[category] = {};
      }
      if (!acc[category][subcategory]) {
        acc[category][subcategory] = [];
      }
      
      acc[category][subcategory].push(q);
      return acc;
    }, {});
    
    setGroupedQuestions(grouped);

    try {
      await axios.put(`/update-assessment/${currentEditingQuestion.id}`, {
        [currentEditingField]: editorContent,
      });
      console.log("Update successful");
    } catch (error) {
      console.error("Update failed", error);
    }

    // Close modal
    setShowTextEditorModal(false);
    setCurrentEditingQuestion(null);
    setCurrentEditingField(null);
    setEditorContent('');
  };

  const closeTextEditor = () => {
    setShowTextEditorModal(false);
    setCurrentEditingQuestion(null);
    setCurrentEditingField(null);
    setEditorContent('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAssessmentInfo(prev => ({
        ...prev,
        facilityImage: file
      }));
    }
  };

  const saveAssessmentInfo = async () => {
    try {
      // Get assessment ID if available
      const assessmentId = assessment?.id;
      
      if (!assessmentId) {
        alert('Assessment ID not found. Please try again.');
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      
      // Add assessment ID
      formData.append('assessment_id', assessmentId);
      
      // Add all assessment info fields
      Object.keys(assessmentInfo).forEach(key => {
        if (key === 'facilityImage' && assessmentInfo[key]) {
          formData.append('facility_image', assessmentInfo[key]);
        } else if (assessmentInfo[key] !== null && assessmentInfo[key] !== '') {
          formData.append(key.replace(/([A-Z])/g, '_$1').toLowerCase(), assessmentInfo[key]);
        }
      });

      const response = await axios.post('/assessment-info', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setShowModal(false);
      } else {
        alert('Failed to save assessment information: ' + response.data.message);
      }
      
    } catch (error) {
      console.error('Error saving assessment info:', error);
      if (error.response?.data?.message) {
        alert('Error: ' + error.response.data.message);
      } else {
        alert('Failed to save assessment information. Please try again.');
      }
    }
  };

  const generatePDF = async () => {
    try {
      setLoading(true);
      
      // Get assessment ID if available
      const assessmentId = assessment?.id || '';
      
      // Send the current questions state (with updated answers) instead of the original question prop
      const response = await axios({
        url: `/download-assessment-pdf/${assessmentId}`, //  Endpoint
        method: 'POST', // Change to POST
        responseType: 'blob',
        // Include updated questions data in the request body
        data: {
          questions: questions, // Send current state with all updates
        },
      });

      console.log("PDF generation successful", response);
      console.log("Questions sent to backend:", questions.slice(0, 3)); // Log first 3 questions for debugging

      // Create a blob URL from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Assessment_Report_${assessmentId}_${new Date().getTime()}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setLoading(false);
      
    } catch (error) {
      console.error("Failed to generate PDF", error);
      setLoading(false);
      // Handle error - perhaps show a notification to the user
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const generateCAPAPDF = async () => {
    try {
      setLoading(true);
      
      // Get assessment ID if available
      const assessmentId = assessment?.id || '';
      
      // Send the current questions state (with updated answers) instead of the original question prop
      const response = await axios({
        url: `/download-capa-pdf/${assessmentId}`, //  Endpoint for CAPA PDF
        method: 'POST', // Change to POST
        responseType: 'blob',
        // Include updated questions data in the request body
        data: {
          questions: questions, // Send current state with all updates
        },
      });

      console.log("CAPA PDF generation successful", response);

      // Create a blob URL from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CAPA_Report_${assessmentId}_${new Date().getTime()}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setLoading(false);
      
    } catch (error) {
      console.error("Failed to generate CAPA PDF", error);
      setLoading(false);
      // Handle error - perhaps show a notification to the user
      alert("Failed to generate CAPA PDF. Please try again.");
    }
  };

  const generateDoc = async () => {
    try {
      setLoading(true);
      
      // Get assessment ID if available
      const assessmentId = assessment?.id || '';
      
      // Send the current questions state (with updated answers) instead of the original question prop
      const response = await axios({
        url: `/download-assessment-doc/${assessmentId}`, //  Endpoint for Word document
        method: 'POST', // Change to POST
        responseType: 'blob',
        // Include updated questions data in the request body
        data: {
          questions: questions, // Send current state with all updates
        },
      });

      console.log("Word document generation successful", response);

      // Create a blob URL from the response data
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Assessment_Report_${assessmentId}_${new Date().getTime()}.docx`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setLoading(false);
      
    } catch (error) {
      console.error("Failed to generate Word document", error);
      setLoading(false);
      // Handle error - perhaps show a notification to the user
      alert("Failed to generate Word document. Please try again.");
    }
  };

  const generateCertificatePDF = async () => {
    try {
      setLoading(true);
      
      // Get assessment ID if available
      const assessmentId = assessment?.id || '';
      
      // Send the current questions state (with updated answers) instead of the original question prop
      const response = await axios({
        url: `/download-certificate-pdf/${assessmentId}`, //  Endpoint for Certificate PDF
        method: 'POST', // Change to POST
        responseType: 'blob',
        // Include updated questions data in the request body
        data: {
          questions: questions, // Send current state with all updates
        },
      });

      console.log("Certificate PDF generation successful", response);

      // Create a blob URL from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate_${assessmentId}_${new Date().getTime()}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setLoading(false);
      
    } catch (error) {
      console.error("Failed to generate Certificate PDF", error);
      setLoading(false);
      // Handle error - perhaps show a notification to the user
      alert("Failed to generate Certificate PDF. Please try again.");
    }
  };

  const resetAssessment = async () => {
    try {
      setResetLoading(true);
      
      const assessmentId = assessment?.id;
      if (!assessmentId) {
        alert('Assessment ID not found. Please try again.');
        return;
      }

      const response = await axios.post(`/reset-assessment/${assessmentId}`);

      if (response.data.success) {
        // Refresh the page to load the reset questions
        window.location.reload();
      } else {
        alert('Failed to reset assessment: ' + response.data.message);
      }
      
    } catch (error) {
      console.error('Error resetting assessment:', error);
      if (error.response?.data?.message) {
        alert('Error: ' + error.response.data.message);
      } else {
        alert('Failed to reset assessment. Please try again.');
      }
      setResetLoading(false);
    }
  };

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setShowResetConfirm(false);
    resetAssessment();
  };

  return (
    <div>
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <h2 className="text-2xl font-bold">Assessment Evaluation</h2>
            <p className="mt-1 text-indigo-100">Evaluate and manage your assessment questions</p>
          </div>
          
          <div className="p-6">
            {/* Top Row - Action Buttons */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
              {/* Left Side - Statistics Counters */}
              <div className="flex flex-wrap gap-3 items-center">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg shadow-md">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Compliance: {questions.filter(q => q.answer === 'Compliance').length}
                </div>
                
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg shadow-md">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Non-Compliance: {questions.filter(q => q.answer === 'Non-Compliance').length}
                </div>
                
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium rounded-lg shadow-md">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                  </svg>
                  Not Applicable: {questions.filter(q => q.answer === 'Not Applicable').length}
                </div>
                
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Total: {questions.length}
                </div>
              </div>

              {/* Right Side - Category Navigation Dropdown */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    if (e.target.value) {
                      scrollToCategory(e.target.value);
                      setSelectedCategory(''); // Reset to show placeholder
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-700 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 transition-all duration-200 cursor-pointer border-none appearance-none pr-10 min-w-[160px]"
                  style={{
                    color: selectedCategory === '' ? '#acafb5ff' : 'white'
                  }}
                >
                  <option value="" disabled style={{color: '#6b7280', backgroundColor: '#f9fafb'}}>
                    {Object.keys(groupedQuestions).length > 0 ? 'Jump to Category' : 'Loading Categories...'}
                  </option>
                  {Object.keys(groupedQuestions).map((category) => (
                    <option key={category} value={category} style={{color: '#374151'}}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none ">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom Row - Statistics Counters (left) and Dropdown (right) */}
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={generatePDF}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                {loading ? 'Generating Report...' : 'Report'}
              </button>
              
              <button
                onClick={generateDoc}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg transition-all duration-200 hover:from-blue-700 hover:to-cyan-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                {loading ? 'Generating Doc...' : 'Doc'}
              </button>
              
              <button
                onClick={generateCAPAPDF}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-lg transition-all duration-200 hover:from-orange-700 hover:to-red-700 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                {loading ? 'Generating CAPA...' : 'CAPA'}
              </button>
              
              <button
                onClick={generateCertificatePDF}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg transition-all duration-200 hover:from-green-700 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                </svg>
                {loading ? 'Generating Certificate...' : 'Certificate'}
              </button>
              
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg transition-all duration-200 hover:from-emerald-600 hover:to-teal-700 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Info
              </button>

              <button
                onClick={handleResetClick}
                disabled={resetLoading}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium rounded-lg transition-all duration-200 hover:from-red-600 hover:to-pink-700 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                {resetLoading ? 'Resetting...' : 'Reset'}
              </button>
            </div>
            

            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="w-full bg-white rounded-lg overflow-hidden">
                <thead className="sticky z-50" style={{ position: 'sticky', top: '0px', backgroundColor: 'white' }}>
                  <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
                    <th className="py-3 px-4 text-center text-xs font-medium uppercase tracking-wider w-32">Ques Ref</th>
                    <th className="py-3 px-4 text-center text-xs font-medium uppercase tracking-wider w-1/3">Question</th>
                    <th className="py-3 px-4 text-center text-xs font-medium uppercase tracking-wider w-16">Instruction</th>
                    <th className="py-3 px-4 text-center text-xs font-medium uppercase tracking-wider w-32">Answer</th>
                    <th className="py-3 px-4 text-center text-xs font-medium uppercase tracking-wider w-56">Findings</th>
                    <th className="py-3 px-4 text-center text-xs font-medium uppercase tracking-wider w-56">Risk Rating</th>
                    <th className="py-3 px-4 text-center text-xs font-medium uppercase tracking-wider w-52">Legal Reference / Standard</th>
                    <th className="py-3 px-4 text-center text-xs font-medium uppercase tracking-wider w-56">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.keys(groupedQuestions).map((category) => (
                    <React.Fragment key={category}>
                      {/* Category Header - Show only once per category */}
                      <tr id={`category-${category}`} className="bg-gradient-to-r from-indigo-500 to-purple-500 sticky z-40" style={{ top: '48px' }}>
                        <td colSpan="8" className="py-4 px-6 text-left font-bold text-base text-white uppercase tracking-wide border-b-2 border-indigo-300 shadow-md">
                          <div 
                            className="flex items-center gap-2 cursor-pointer hover:bg-white hover:bg-opacity-10 rounded p-2 -m-2 transition-colors"
                            onClick={() => toggleCategory(category)}
                          >
                            <svg 
                              className={`w-5 h-5 text-white transition-transform duration-200 ${collapsedCategories[category] ? '-rotate-90' : 'rotate-0'}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                            </svg>
                            {category}
                          </div>
                        </td>
                      </tr>
                      
                      {/* Render all subcategories under this category */}
                      {!collapsedCategories[category] && Object.keys(groupedQuestions[category]).map((subcategory) => {
                        const subcategoryKey = `${category}-${subcategory}`;
                        return (
                          <React.Fragment key={subcategoryKey}>
                            {/* Subcategory Header */}
                            <tr className="bg-gradient-to-r from-indigo-100 to-purple-100 border-l-4 border-indigo-400 sticky z-30" style={{ top: '112px' }}>
                              <td colSpan="8" className="py-3 px-6 text-left font-semibold text-sm text-indigo-800 border-b border-indigo-200 shadow-sm">
                                <div 
                                  className="flex items-center gap-2 pl-4 cursor-pointer hover:bg-indigo-200 hover:bg-opacity-50 rounded p-2 -m-2 transition-colors"
                                  onClick={() => toggleSubcategory(subcategoryKey)}
                                >
                                  <svg 
                                    className={`w-4 h-4 text-indigo-600 transition-transform duration-200 ${collapsedSubcategories[subcategoryKey] ? '-rotate-90' : 'rotate-0'}`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24" 
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                  </svg>
                                  {subcategory}
                                </div>
                              </td>
                            </tr>
                            
                            {/* All questions under this subcategory */}
                            {!collapsedSubcategories[subcategoryKey] && groupedQuestions[category][subcategory].map((questionItem) => (
                            <tr key={questionItem.ncref} className="hover:bg-gray-50 transition-colors duration-150">
                              <td className="py-3 px-4 text-sm font-medium text-gray-900 w-32">{questionItem.ncref}</td>
                              <td className="py-3 px-4 text-sm text-gray-800">{questionItem.question}</td>
                              <td className="py-3 px-4 w-48">
                                <div
                                  onClick={() => openTextEditor(questionItem, 'instruction')}
                                  className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 focus:ring focus:ring-indigo-200 focus:border-indigo-300 focus:ring-opacity-50 focus:outline-none min-h-[40px] max-w-48 overflow-hidden text-ellipsis"
                                  title="Click to edit instruction"
                                  style={{ maxWidth: '12rem', minWidth: '12rem' }}
                                >
                                  {questionItem.instruction ? (
                                    questionItem.instruction.includes('<') || questionItem.instruction.includes('>') ? (
                                      <div className="table-cell-content truncate" dangerouslySetInnerHTML={{ __html: questionItem.instruction }} />
                                    ) : (
                                      <div className="table-cell-content truncate">{questionItem.instruction}</div>
                                    )
                                  ) : (
                                    <span className="text-gray-400 italic">Instruction</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 w-32">
                                <select
                                  value={questionItem.answer || ''}
                                  onChange={(e) => handleChange(e, questionItem, 'answer')}
                                  className={`w-full py-2 px-3 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:outline-none transition-colors ${
                                    questionItem.answer === 'Compliance' 
                                      ? 'text-green-800 bg-green-50 border-green-200 focus:border-green-300 focus:ring-green-200' 
                                      : questionItem.answer === 'Non-Compliance'
                                      ? 'text-red-800 bg-red-50 border-red-200 focus:border-red-300 focus:ring-red-200'
                                      : questionItem.answer === 'Not Applicable'
                                      ? 'text-gray-800 bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-200'
                                      : 'text-gray-600 bg-white border-gray-300 focus:border-indigo-300 focus:ring-indigo-200'
                                  }`}
                                >
                                  <option value="">Select Answer</option>
                                  <option value="Compliance">Compliance</option>
                                  <option value="Non-Compliance">Non-Compliance</option>
                                  <option value="Not Applicable">Not Applicable</option>
                                </select>
                              </td>
                              <td className="py-3 px-4 w-56">
                                {questionItem.answer === 'Non-Compliance' ? (
                                  <div
                                    onClick={() => openTextEditor(questionItem, 'findings')}
                                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 focus:ring focus:ring-indigo-200 focus:border-indigo-300 focus:ring-opacity-50 focus:outline-none min-h-[40px] max-w-56 overflow-hidden"
                                    title="Click to edit findings"
                                    style={{ maxWidth: '14rem', minWidth: '14rem' }}
                                  >
                                    {questionItem.findings ? (
                                      questionItem.findings.includes('<') || questionItem.findings.includes('>') ? (
                                        <div className="table-cell-content truncate" dangerouslySetInnerHTML={{ __html: questionItem.findings }} />
                                      ) : (
                                        <div className="table-cell-content truncate">{questionItem.findings}</div>
                                      )
                                    ) : (
                                      <span className="text-gray-400 italic">Click to enter findings...</span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-400 italic">N/A</span>
                                )}
                              </td>
                              <td className="py-3 px-4 w-56">
                                <select
                                  value={questionItem.risk_rating || questionItem.original_risk_rating || ''}
                                  onChange={(e) => handleChange(e, questionItem, 'risk_rating')}
                                  className={`w-full py-2 px-3 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:outline-none transition-colors ${
                                    currentRiskRatings.find(r => r.label === (questionItem.risk_rating || questionItem.original_risk_rating))?.color ? 
                                    `text-${currentRiskRatings.find(r => r.label === (questionItem.risk_rating || questionItem.original_risk_rating))?.color}-800 bg-${currentRiskRatings.find(r => r.label === (questionItem.risk_rating || questionItem.original_risk_rating))?.color}-50` :
                                    'text-blue-800 bg-blue-50'
                                  }`}
                                >
                                  <option value="">Select Rating</option>
                                  {currentRiskRatings.map((rating) => (
                                    <option key={rating.id} value={rating.label}>
                                      {rating.label}
                                    </option>
                                  ))}
                                </select>
                                {/* {questionItem.risk_rating} */}
                              </td>
                              <td className="py-3 px-4 w-52">
                                {questionItem.answer === 'Non-Compliance' ? (
                                  <div
                                    onClick={() => openTextEditor(questionItem, 'legal_ref')}
                                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 focus:ring focus:ring-indigo-200 focus:border-indigo-300 focus:ring-opacity-50 focus:outline-none min-h-[40px] max-w-52 overflow-hidden"
                                    title="Click to edit legal reference"
                                    style={{ maxWidth: '13rem', minWidth: '13rem' }}
                                  >
                                    {questionItem.legal_ref ? (
                                      questionItem.legal_ref.includes('<') || questionItem.legal_ref.includes('>') ? (
                                        <div className="table-cell-content truncate" dangerouslySetInnerHTML={{ __html: questionItem.legal_ref }} />
                                      ) : (
                                        <div className="table-cell-content truncate">{questionItem.legal_ref}</div>
                                      )
                                    ) : (
                                      <span className="text-gray-400 italic">Click to enter legal reference...</span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-400 italic">N/A</span>
                                )}
                              </td>
                              <td className="py-3 px-4 w-56">
                                {questionItem.answer === 'Non-Compliance' ? (
                                  <div
                                    onClick={() => openTextEditor(questionItem, 'recommendation')}
                                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 focus:ring focus:ring-indigo-200 focus:border-indigo-300 focus:ring-opacity-50 focus:outline-none min-h-[40px] max-w-56 overflow-hidden"
                                    title="Click to edit recommendation"
                                    style={{ maxWidth: '14rem', minWidth: '14rem' }}
                                  >
                                    {questionItem.recommendation ? (
                                      questionItem.recommendation.includes('<') || questionItem.recommendation.includes('>') ? (
                                        <div className="table-cell-content truncate" dangerouslySetInnerHTML={{ __html: questionItem.recommendation }} />
                                      ) : (
                                        <div className="table-cell-content truncate">{questionItem.recommendation}</div>
                                      )
                                    ) : (
                                      <span className="text-gray-400 italic">Click to enter recommendation...</span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-400 italic">N/A</span>
                                )}
                              </td>
                            </tr>                            ))}
                          </React.Fragment>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Info Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowModal(false)}
            ></div>

            {/* Modal content */}
            <div className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Assessment Information</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto">
                {/* Assessor Information Section */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-center text-gray-700 mb-6 pb-2 border-b border-gray-200">
                    Assessment Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Audit Company</label>
                      <input
                        type="text"
                        value={assessmentInfo.auditCompany}
                        onChange={(e) => handleInfoChange('auditCompany', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Type</label>
                      <input
                        type="text"
                        placeholder='Announced/Semi-Announced/Unannounced'
                        value={assessmentInfo.scheduleType}
                        onChange={(e) => handleInfoChange('scheduleType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Report No</label>
                      <input
                        type="text"
                        value={assessmentInfo.reportNo}
                        onChange={(e) => handleInfoChange('reportNo', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assessors</label>
                      <input
                        type="text"
                        value={assessmentInfo.assessors}
                        onChange={(e) => handleInfoChange('assessors', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Type</label>
                      <input
                        type="text"
                        placeholder='Initial/Follow-Up/Annual'
                        value={assessmentInfo.assessmentType}
                        onChange={(e) => handleInfoChange('assessmentType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Date</label>
                      <input
                        type="date"
                        value={assessmentInfo.assessmentDate}
                        onChange={(e) => handleInfoChange('assessmentDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Report Heading</label>
                      <input
                        type="text"
                        value={assessmentInfo.reportHeading}
                        onChange={(e) => handleInfoChange('reportHeading', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CAPA Heading</label>
                      <input
                        type="text"
                        value={assessmentInfo.capaHeading}
                        onChange={(e) => handleInfoChange('capaHeading', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Facility Information Section */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-center text-gray-700 mb-6 pb-2 border-b border-gray-200">
                    Facility Information
                  </h4>
                  
                  {/* Facility Image Upload */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facility Image</label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> facility image
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {assessmentInfo.facilityImage && (
                      <p className="mt-2 text-sm text-green-600">
                        Selected: {assessmentInfo.facilityImage.name}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Facility Name</label>
                      <input
                        type="text"
                        value={assessmentInfo.facilityName}
                        onChange={(e) => handleInfoChange('facilityName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Site owned or rented?</label>
                      <select
                        value={assessmentInfo.siteOwned}
                        onChange={(e) => handleInfoChange('siteOwned', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select...</option>
                        <option value="Owned">Owned</option>
                        <option value="Rented">Rented</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Facility Address</label>
                      <input
                        type="text"
                        value={assessmentInfo.facilityAddress}
                        onChange={(e) => handleInfoChange('facilityAddress', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Production Capacity</label>
                      <input
                        type="text"
                        value={assessmentInfo.monthlyProduction}
                        onChange={(e) => handleInfoChange('monthlyProduction', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business License #</label>
                      <input
                        type="text"
                        value={assessmentInfo.businessLicense}
                        onChange={(e) => handleInfoChange('businessLicense', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Contact Name</label>
                      <input
                        type="text"
                        value={assessmentInfo.primaryContactName}
                        onChange={(e) => handleInfoChange('primaryContactName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        value={assessmentInfo.country}
                        onChange={(e) => handleInfoChange('country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                      <input
                        type="text"
                        value={assessmentInfo.position}
                        onChange={(e) => handleInfoChange('position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year of establishment</label>
                      <input
                        type="number"
                        value={assessmentInfo.yearEstablishment}
                        onChange={(e) => handleInfoChange('yearEstablishment', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                      <input
                        type="email"
                        value={assessmentInfo.email}
                        onChange={(e) => handleInfoChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Building description</label>
                      <textarea
                        type="text"
                        value={assessmentInfo.buildingDescription}
                        onChange={(e) => handleInfoChange('buildingDescription', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />

                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                      <input
                        type="tel"
                        value={assessmentInfo.contactNumber}
                        onChange={(e) => handleInfoChange('contactNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Multiple Tenants?</label>
                      <select
                        value={assessmentInfo.multipleTenants}
                        onChange={(e) => handleInfoChange('multipleTenants', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select...</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Social Compliance Contact</label>
                      <input
                        type="text"
                        value={assessmentInfo.socialComplianceContact}
                        onChange={(e) => handleInfoChange('socialComplianceContact', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Employee Information Section */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-center text-gray-700 mb-6 pb-2 border-b border-gray-200">
                    Employee Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of employees</label>
                      <input
                        type="number"
                        value={assessmentInfo.numberOfEmployees}
                        onChange={(e) => handleInfoChange('numberOfEmployees', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Foreign Migrant Workers</label>
                      <input
                        type="number"
                        value={assessmentInfo.foreignWorkers}
                        onChange={(e) => handleInfoChange('foreignWorkers', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of workers</label>
                      <input
                        type="number"
                        value={assessmentInfo.numberOfWorkers}
                        onChange={(e) => handleInfoChange('numberOfWorkers', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Worker Turnover Rate</label>
                      <input
                        type="text"
                        value={assessmentInfo.workerTurnoverRate}
                        onChange={(e) => handleInfoChange('workerTurnoverRate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Male employees</label>
                      <input
                        type="number"
                        value={assessmentInfo.maleEmployees}
                        onChange={(e) => handleInfoChange('maleEmployees', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Labor Agent Used</label>
                      <select
                        value={assessmentInfo.laborAgentUsed}
                        onChange={(e) => handleInfoChange('laborAgentUsed', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select...</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Female Employees</label>
                      <input
                        type="number"
                        value={assessmentInfo.femaleEmployees}
                        onChange={(e) => handleInfoChange('femaleEmployees', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Management Spoken Language</label>
                      <input
                        type="text"
                        value={assessmentInfo.managementLanguage}
                        onChange={(e) => handleInfoChange('managementLanguage', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Local workers</label>
                      <input
                        type="number"
                        value={assessmentInfo.localWorkers}
                        onChange={(e) => handleInfoChange('localWorkers', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Workers Spoken Language</label>
                      <input
                        type="text"
                        value={assessmentInfo.workersLanguage}
                        onChange={(e) => handleInfoChange('workersLanguage', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Text Areas Section */}
                <div className="mb-8 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">General Assessment Overview</label>
                    <Editor
                      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                      value={assessmentInfo.generalAssessmentOverview}
                      onEditorChange={(content) => handleInfoChange('generalAssessmentOverview', content)}
                      init={{
                        ...editorConfig,
                        height: 200
                      }}
                    />
                    <div className="mb-12"></div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facility Good Practices</label>
                    <Editor
                      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                      value={assessmentInfo.facilityGoodPractices}
                      onEditorChange={(content) => handleInfoChange('facilityGoodPractices', content)}
                      init={{
                        ...editorConfig,
                        height: 200
                      }}
                    />
                    <div className="mb-12"></div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Worker Interview</label>
                    <Editor
                      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                      value={assessmentInfo.workerInterview}
                      onEditorChange={(content) => handleInfoChange('workerInterview', content)}
                      init={{
                        ...editorConfig,
                        height: 200
                      }}
                    />
                    <div className="mb-12"></div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
                    <Editor
                      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                      value={assessmentInfo.additionalInfo}
                      onEditorChange={(content) => handleInfoChange('additionalInfo', content)}
                      init={{
                        ...editorConfig,
                        height: 200
                      }}
                    />
                    <div className="mb-12"></div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Disclaimer & Methods</label>
                    <Editor
                      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                      value={assessmentInfo.disclaimer}
                      onEditorChange={(content) => handleInfoChange('disclaimer', content)}
                      init={{
                        ...editorConfig,
                        height: 150
                      }}
                    />
                    <div className="mb-12"></div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveAssessmentInfo}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-md hover:shadow-lg"
                >
                  Save Information
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Text Editor Modal */}
      {showTextEditorModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeTextEditor}></div>
          
          {/* Modal content */}
          <div className="relative w-full max-w-4xl mx-4 p-6 bg-white shadow-xl rounded-2xl z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Edit {currentEditingField === 'findings' ? 'Findings' : 
                     currentEditingField === 'legal_ref' ? 'Legal Reference' : 
                     currentEditingField === 'instruction' ? 'Instruction' :
                     'Recommendation'}
              </h3>
              <button
                onClick={closeTextEditor}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                value={editorContent}
                onEditorChange={setEditorContent}
                init={{
                  ...editorConfig,
                  height: 300
                }}
              />
              <div className="mb-12"></div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                onClick={closeTextEditor}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveTextEditorContent}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-md hover:shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={confirmReset}
        title="Reset Assessment"
        message="Are you sure you want to reset this assessment? This will delete all current answers and restore the original questions. This action cannot be undone."
        confirmButtonText="Reset Assessment"
        type="danger"
      />
    </div>
  );
}
