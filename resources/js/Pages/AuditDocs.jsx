import React from 'react'
import MainLayout from '../Layouts/MainLayout/MainLayout'
import { Head } from '@inertiajs/react'
import AuditDocsIndex from './AuditDocs'

export default function AuditDocs({ rootFolders, canManage }) {
  // Use actual root folders data from the backend
  const sideBarData = {
    children: Array.isArray(rootFolders) 
      ? rootFolders.map(folder => ({
          ...folder,
          type: 'folder'
        }))
      : []
  };
  
  return (
    <MainLayout sideBarData={sideBarData}>
      <Head title="Audit Documents" />
      <AuditDocsIndex rootFolders={rootFolders} canManage={canManage} />
    </MainLayout>
  )
}
