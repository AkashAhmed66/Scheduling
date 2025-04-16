import React, { use } from 'react'
import BasicLayout from '../Layouts/BasicLayout/BasicLayout'
import JobsComponent from '../Components/JobsComponent'
import JobsComponentEdit from '../Components/JobsComponentEdit'
import { usePage } from '@inertiajs/react';

export default function Jobs() {
  const { jobs, user } = usePage().props;
  console.log('akash', jobs)
  if(user.role == '0' || user.role == '1') {
    return (
      <BasicLayout>
        <JobsComponentEdit />
      </BasicLayout>
    )
  }else{
    return (
      <BasicLayout>
        <JobsComponent />
      </BasicLayout>
    )
  }
}
