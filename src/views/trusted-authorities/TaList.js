import React, { useEffect } from 'react'
import SmartTable from 'src/components/SmartTable'
import { useNavigate } from 'react-router-dom'
import { CButton, CCol, CContainer, CRow } from '@coreui/react'
import axiosInstance from '../../utils/axiosInstance'

const TaList = () => {
  const navigate = useNavigate()
  const handleCancel = () => {
    navigate('/system/users')
  }
  const userColumns = [
    { key: 'id', label: 'ID' },
    { key: 'status', label: 'Status' },
    { key: 'subjectDN', label: 'Subject DN' },
    { key: 'createdBy', label: 'Created By' },
    { key: 'createAt', label: 'Created At' },
    // { key: 'lastModifiedBy', label: 'Last Modified By' },
    // { key: 'lastModifiedAt', label: 'Last Modified At' },
    {
      key: 'actions',
      label: 'Actions',
      actions: [
        { label: 'View', link: (row) => `/system/trusted-authorities/view/${row.id}` },
        { label: 'Edit', link: (row) => `/system/trusted-authorities/edit/${row.id}` },
      ],
    },
  ]
  // Handler for creating a new user
  const handleCreateNew = () => {
    navigate('/system/trusted-authorities/create')
  }

  const getData = async () => {
    const response = await axiosInstance.get('/api/ta/')
    const data = response.data
    console.log(data)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol className="d-flex justify-content-end">
          <CButton color="primary" onClick={handleCreateNew}>
            Create New TA
          </CButton>
        </CCol>
      </CRow>
      <SmartTable
        heading="List of Trusted Authorities"
        url="/api/ta/"
        columns={userColumns}
        // actions={actions}
        defaultPageSize={10}
        searchParam="search"
        dataType="ta"
      />
    </CContainer>
  )
}

export default TaList
