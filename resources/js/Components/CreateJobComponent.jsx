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

    //auditors and reviewers
    auditor: '',
    reviewer: ''
  });

  useEffect(() => {
    if(job != null) {setFormData(job);}
  }, [job]);
  


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    
    if(create == 1){
      // Post data to the Laravel API endpoint using Inertia
      Inertia.post('/submit-audit-job', formData, {
        onSuccess: (response) => {
          console.log('Data successfully submitted:', response);
          // Handle successful submission (e.g., show a success message)
        },
        onError: (errors) => {
          console.error('Error during submission:', errors);
          // Handle form validation errors (if any)
        },
      });
    }else{
      Inertia.post('/submit-audit-job-edit', formData, {
        onSuccess: (response) => {
          console.log('Data successfully submitted:', response);
          // Handle successful submission (e.g., show a success message)
        },
        onError: (errors) => {
          console.error('Error during submission:', errors);
          // Handle form validation errors (if any)
        },
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create/Update Job</h1>

      <form onSubmit={handleSubmit}>
        {/* Basic Information Section */}
        <BasicInformationSection formData={formData} handleChange={handleChange} />

        {/* Staff Role Section */}
        <StaffRoleSection formData={formData} handleChange={handleChange} />

        {/* Contacts Section */}
        <ContactsSection formData={formData} handleChange={handleChange} />

        {/* Additional Information Section */}
        <AdditionalInformationSection formData={formData} handleChange={handleChange} />

        {/* Auditor and reviewer Section */}
        <AddAuditorReviewer formData={formData} handleChange={handleChange} />

        {/* Assessment Document Section */}
        {/* <div className="mt-6">
          <FilesForJob />
        </div> */}

        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
