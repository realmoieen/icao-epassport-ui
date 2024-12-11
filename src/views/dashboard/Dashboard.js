import React, { useState } from 'react'

import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cil3d, cilLaptop } from '@coreui/icons'

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
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
                    <CCol className="border-start border-start-4 border-start-primary py-1 px-3">
                      <div className="center-align">
                        <div>
                          <CIcon icon={cil3d} size="xxl" />
                          <div className="fs-5 fw-semibold">Product</div>
                        </div>
                        <div className="dashboard-block">
                          <div className="fs-6 fw-semibold dashboard-child-block">Name</div>
                          <div className="text-body-secondary text-truncate bold dashboard-child-block">
                            Idenfo ICAO Epassport
                          </div>
                        </div>
                        <div className="dashboard-block">
                          <div className="fs-6 fw-semibold dashboard-child-block">Version</div>
                          <div className="text-body-secondary text-truncate bold dashboard-child-block">
                            1.0
                          </div>
                        </div>
                      </div>
                    </CCol>
                    <CCol className="border-start border-start-4 border-start-primary py-1 px-3">
                      <div className="center-align">
                        <div>
                          <CIcon icon={cilLaptop} size="xxl" />
                          <div className="fs-5 fw-semibold">System Information</div>
                        </div>
                        <div className="dashboard-block">
                          <div className="fs-6 fw-semibold dashboard-child-block">OS Name</div>
                          <div className="text-body-secondary text-truncate bold dashboard-child-block">
                            1.0
                          </div>
                        </div>
                      </div>
                    </CCol>
                  </CRow>
                  <hr />
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
