import React from 'react'
import MainLayout from '../Layouts/MainLayout/MainLayout'
import AuditDocsComponent from '../Components/AuditDocsComponent'

export default function AuditDocs() {
  const sideBarData = {
      children:[
      {
        id: 1,
        name: 'Folder 1',
        type: 'folder',
        children: [
          { id: 2, name: 'Document 1', type: 'document' },
          { id: 3, name: 'Folder 1.1', type: 'folder', children: [
            { id: 4, name: 'Document 2', type: 'document' },
          ] },
        ],
      },
      { id: 5, name: 'Document 3', type: 'document' },
    ]
  };
  return (
    <MainLayout sideBarData={sideBarData}>
        <AuditDocsComponent />
    </MainLayout>
  )
}
