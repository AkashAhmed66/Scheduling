import React from 'react'
import AssesmentComponent from '../Components/AssesmentComponent'
import BasicLayout from '../Layouts/BasicLayout/BasicLayout'
import AssessmentsList from '@/Components/AssessmentsList'

export default function Assesment() {
  return (
    <BasicLayout>
      {/* <AssesmentComponent /> */}
      <AssessmentsList />
    </BasicLayout>
  )
}
