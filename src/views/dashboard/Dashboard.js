import React, { useEffect, useState } from 'react'

import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cil3d, cilLaptop, cilStorage, cilUser, cibCodesandbox } from '@coreui/icons'
import axiosInstance from '../../utils/axiosInstance'
import { CiUser } from 'react-icons/ci'

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [visible, setVisible] = useState(false)

  const getDashboardData = async () => {
    try {
      const responce = await axiosInstance.get('/api/dashboard')
      setData(responce.data)
    } catch (error) {
      setError(error)
      setVisible(true)
    }
  }

  useEffect(() => {
    getDashboardData()
  }, [])

  const getIcon = (section) => {
    switch (section) {
      case 'systemInformation':
        return cilLaptop
      case 'databaseInformation':
        return cibCodesandbox
      case 'loggedInUser':
        return cilUser
      default:
        return cil3d
    }
  }

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Overview</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol>
                  <CRow>
                    {data &&
                      Object.entries(data)
                        .slice(0, 2)
                        .map(([section, details]) => (
                          <CCol
                            key={section}
                            className="border-start border-start-4 border-start-primary py-1 px-3"
                          >
                            <div
                              className="center-align"
                              style={{
                                width: '500px',
                                height: '300px',
                              }}
                            >
                              <div>
                                <CIcon icon={getIcon(section)} size="xxl" />
                                <div className="fs-5 fw-semibold">
                                  {section
                                    .replace(/([A-Z])/g, ' $1')
                                    .replace(/^\w/, (c) => c.toUpperCase())}
                                </div>
                              </div>
                              {Object.entries(details).map(([key, value]) => (
                                <div className="dashboard-block" key={key}>
                                  <div className="fs-6 fw-semibold dashboard-child-block">
                                    {key.replace(/([A-Z])/g, ' $1')}: {/* Format camelCase keys */}
                                  </div>
                                  <div className="text-body-secondary text-truncate bold dashboard-child-block">
                                    {value || 'N/A'} {/* Handle undefined or null values */}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CCol>
                        ))}
                  </CRow>
                  <hr />
                  <CRow className="mt-3">
                    {data &&
                      Object.entries(data)
                        .slice(2, 4)
                        .map(([section, details]) => (
                          <CCol
                            key={section}
                            className="border-start border-start-4 border-start-primary py-1 px-3"
                          >
                            <div
                              className="center-align"
                              style={{
                                width: '500px',
                                height: '300px',
                              }}
                            >
                              <div>
                                <CIcon icon={getIcon(section)} size="xxl" />
                                <div className="fs-5 fw-semibold">
                                  {section
                                    .replace(/([A-Z])/g, ' $1')
                                    .replace(/^\w/, (c) => c.toUpperCase())}
                                </div>
                              </div>
                              {Object.entries(details).map(([key, value]) => (
                                <div className="dashboard-block" key={key}>
                                  <div className="fs-6 fw-semibold dashboard-child-block">
                                    {key.replace(/([A-Z])/g, ' $1')}: {/* Format camelCase keys */}
                                  </div>
                                  <div className="text-body-secondary text-truncate bold dashboard-child-block">
                                    {value || 'N/A'} {/* Handle undefined or null values */}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CCol>
                        ))}
                  </CRow>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
