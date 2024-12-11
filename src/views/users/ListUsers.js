import React from 'react'
import SmartTable from 'src/components/SmartTable'
import { useNavigate } from 'react-router-dom'
import { CButton, CCol, CContainer, CRow } from '@coreui/react'

const ListUsers = () => {
  const navigate = useNavigate()
  const handleCancel = () => {
    navigate('/system/users')
  }
  const userColumns = [
    { key: 'userId', label: 'User ID' },
    { key: 'status', label: 'Status' },
    { key: 'roleName', label: 'Role Name' },
    { key: 'createdBy', label: 'Created By' },
    { key: 'createAt', label: 'Created At' },
    // { key: 'lastModifiedBy', label: 'Last Modified By' },
    // { key: 'lastModifiedAt', label: 'Last Modified At' },
    {
      key: 'actions',
      label: 'Actions',
      actions: [
        { label: 'View', link: (row) => `/system/users/view/${row.userId}` },
        { label: 'Edit', link: (row) => `/system/users/edit/${row.userId}` },
      ],
    },
  ]
  // Handler for creating a new user
  const handleCreateNew = () => {
    navigate('/system/users/create')
  }

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol className="d-flex justify-content-end">
          <CButton color="primary" onClick={handleCreateNew}>
            Create New User
          </CButton>
        </CCol>
      </CRow>
      <SmartTable
        url="/api/users"
        columns={userColumns}
        // actions={actions}
        defaultPageSize={10}
        searchParam="search"
      />
    </CContainer>
  )
}

export default ListUsers
