import React, { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

// Import all the individual segments
import BasicInformationSection from './BasicInformationSection';
import StaffRoleSection from './StaffRoleSection';
import ContactsSection from './ContactsSection';
import AdditionalInformationSection from './AdditionalInformationSection';
import FilesForJob from './FilesForJob';
import AddAuditorReviewer from './AddAuditorReviewer';
import { usePage } from '@inertiajs/react';

export default function CreateJobComponent() {
  const {create, auditors, job} = usePage().props;
  
  const [formData, setFormData] = useState({
    // Basic Information
    jobType: '',
    reportNo: '',
    requestType: '',
    jobStatus: '',
    officeCountry: '',
    staffDays: '',
    isClientShadowAudit: false,
    dateRequestReceived: '',
    auditDueDate: '',
    auditStartDate: '',
    auditEndDate: '',
    remarks: '',
    dateReportSentToQA: '',
    finalReportSentToClient: '',

    // Staff Role
    role: '',
    user: '',
    staffDay: '',
    startDate: '',
    endDate: '',
    reportWriter: false,
    note: '',

    // Contacts
    clientName: '',
    clientCity: '',
    clientProvince: '',
    clientCountry: '',
    clientPostalCode: '',
    clientAddress: '',
    clientTel: '',
    vendorName: '',
    vendorCity: '',
    vendorProvince: '',
    vendorCountry: '',
    vendorPostalCode: '',
    vendorAddress: '',
    vendorTel: '',
    factoryName: '',
    factoryCity: '',
    factoryProvince: '',
    factoryCountry: '',
    factoryPostalCode: '',
    factoryAddress: '',
    factoryTel: '',

    // Additional Information
    coordination: '',
    auditors: '',
    reportReview: '',

    // Auditor and Reviewer selections
    auditor: '',
    reviewer: '',
    
    // Error states
    jobTypeError: false,
    reportNoError: false,
    requestTypeError: false,
    auditorError: false,
    reviewerError: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [formProgress, setFormProgress] = useState(0);
  const [validationMessage, setValidationMessage] = useState(null);

  useEffect(() => {
    if(job != null) {setFormData(job);}
  }, [job]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
      
      // Clear validation errors when fields are filled
      if (name === 'jobType' && value) {
        updatedData.jobTypeError = false;
      }
      if (name === 'reportNo' && value) {
        updatedData.reportNoError = false;
      }
      if (name === 'requestType' && value) {
        updatedData.requestTypeError = false;
      }
      if (name === 'auditor' && value) {
        updatedData.auditorError = false;
      }
      if (name === 'reviewer' && value) {
        updatedData.reviewerError = false;
      }
      
      return updatedData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if we're on the last tab before submitting
    if (activeTab !== tabs[tabs.length - 1].id) {
      // If not on the last tab, move to the tab with the Basic Information section
      setActiveTab('basic');
      return;
    }
    
    let hasErrors = false;
    const newFormData = {...formData};
    
    // Check if required fields are filled in Basic Information section
    if (!formData.jobType || !formData.reportNo || !formData.requestType) {
      // Switch to basic tab if required fields are empty
      setActiveTab('basic');
      
      // Add validation feedback
      if (!formData.jobType) {
        newFormData.jobTypeError = true;
        hasErrors = true;
      }
      if (!formData.reportNo) {
        newFormData.reportNoError = true;
        hasErrors = true;
      }
      if (!formData.requestType) {
        newFormData.requestTypeError = true;
        hasErrors = true;
      }
    }
    
    // Check if required fields are filled in Auditor & Reviewer section
    if (!formData.auditor || !formData.reviewer) {
      // If basic info is valid but auditor/reviewer is not, switch to auditor tab
      if (!hasErrors) {
        setActiveTab('auditor');
      }
      
      // Add validation feedback
      if (!formData.auditor) {
        newFormData.auditorError = true;
        hasErrors = true;
      }
      if (!formData.reviewer) {
        newFormData.reviewerError = true;
        hasErrors = true;
      }
    }
    
    // If there are errors, update form data and show message
    if (hasErrors) {
      setFormData(newFormData);
      
      // Show validation message
      setValidationMessage("Please fill in all required fields before submitting");
      
      // Hide message after 5 seconds
      setTimeout(() => {
        setValidationMessage(null);
      }, 5000);
      
      // Prevent form submission
      return;
    }
    
    // Clear any previous validation messages
    setValidationMessage(null);
    
    setIsSubmitting(true);
    console.log('Form data submitted:', formData);
    
    if(create == 1){
      // Post data to the Laravel API endpoint using Inertia
      Inertia.post('/submit-audit-job', formData, {
        onSuccess: (response) => {
          console.log('Data successfully submitted:', response);
          setIsSubmitting(false);
          // Handle successful submission (e.g., show a success message)
        },
        onError: (errors) => {
          console.error('Error during submission:', errors);
          setIsSubmitting(false);
          // Handle form validation errors (if any)
        },
      });
    }else{
      Inertia.post('/submit-audit-job-edit', formData, {
        onSuccess: (response) => {
          console.log('Data successfully submitted:', response);
          setIsSubmitting(false);
          // Handle successful submission (e.g., show a success message)
        },
        onError: (errors) => {
          console.error('Error during submission:', errors);
          setIsSubmitting(false);
          // Handle form validation errors (if any)
        },
      });
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Information', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'staff', label: 'Staff Role', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { id: 'contacts', label: 'Contacts', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'additional', label: 'Additional Info', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
    { id: 'auditor', label: 'Auditor & Reviewer', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  ];

  // Calculate progress based on active tab
  useEffect(() => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    const progressPercentage = (currentIndex / (tabs.length - 1)) * 100;
    setFormProgress(progressPercentage);
  }, [activeTab]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
          {/* Header with improved gradient */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white relative">
            {/* Abstract shapes for visual interest */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
            
            <h1 className="text-3xl font-bold relative z-10">{create == 1 ? 'Create New Job' : 'Update Job'}</h1>
            <p className="mt-2 text-indigo-100 relative z-10 max-w-2xl">Fill out the form below to {create == 1 ? 'create a new job' : 'update the job'}. Navigate through different sections using the tabs below.</p>
            
            {/* Progress bar */}
            <div className="mt-6 bg-white bg-opacity-20 h-2 rounded-full relative z-10 overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${formProgress}%` }}
              ></div>
            </div>
            
            {/* Validation message */}
            {validationMessage && (
              <div className="mt-4 p-3 bg-red-600 bg-opacity-80 rounded-lg text-white text-sm relative z-10">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  {validationMessage}
                </div>
              </div>
            )}
          </div>

          {/* Tab Navigation - Redesigned */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto gap-1 px-4">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-6 font-medium text-sm whitespace-nowrap transition-all duration-200 rounded-t-lg mt-2 ${
                    activeTab === tab.id
                      ? 'bg-white border-t border-l border-r border-gray-200 text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-indigo-500 hover:bg-white hover:bg-opacity-50'
                  }`}
                >
                  <div className={`flex items-center justify-center mr-3 h-7 w-7 rounded-full ${
                    activeTab === tab.id 
                      ? 'bg-indigo-100 text-indigo-600' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex items-center">
                    <svg 
                      className={`mr-2 h-5 w-5 ${activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400'}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon}></path>
                    </svg>
                    {tab.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8" noValidate>
            <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
              <BasicInformationSection formData={formData} handleChange={handleChange} />
            </div>

            <div className={activeTab === 'staff' ? 'block' : 'hidden'}>
              <StaffRoleSection formData={formData} handleChange={handleChange} />
            </div>

            <div className={activeTab === 'contacts' ? 'block' : 'hidden'}>
              <ContactsSection formData={formData} handleChange={handleChange} />
            </div>

            <div className={activeTab === 'additional' ? 'block' : 'hidden'}>
              <AdditionalInformationSection formData={formData} handleChange={handleChange} />
            </div>

            <div className={activeTab === 'auditor' ? 'block' : 'hidden'}>
              <AddAuditorReviewer formData={formData} handleChange={handleChange} />
            </div>

            <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between">
              <div>
                {activeTab !== 'basic' && (
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                      setActiveTab(tabs[currentIndex - 1].id);
                    }}
                    className="inline-flex items-center px-5 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Previous
                  </button>
                )}
              </div>
              
              <div>
                {activeTab !== tabs[tabs.length - 1].id ? (
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                      setActiveTab(tabs[currentIndex + 1].id);
                    }}
                    className="inline-flex items-center px-5 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Next
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Submit Job
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
