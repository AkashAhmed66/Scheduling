import FilesForJob from '@/Components/FilesForJob'
import BasicLayout from '@/Layouts/BasicLayout/BasicLayout'
import React from 'react'
import { usePage } from '@inertiajs/react'; 
import TempFolders from '@/Components/TempFolders';
export default function FileStructure() {

  return (
    <BasicLayout> 
        {/* <FilesForJob /> */}
        <TempFolders />
    </BasicLayout> 
  )
}
