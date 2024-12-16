import React, { useState, useEffect } from 'react'
import SmartPagination from './SmartPagination'
import {
  CAlert,
  CCard,
  CCardBody,
  CCardHeader,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import axiosInstance from 'src/utils/axiosInstance'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { cilOptions } from '@coreui/icons'
import { AxiosError } from 'axios'
import { useToaster } from 'src/services/ToasterService'

const SmartTable = ({
  url,
  columns,
  actions,
  defaultPageSize = 10,
  searchParam = 'search',
  heading,
  dataType,  // Added dataType prop to distinguish between 'user' and 'ta'
}) => {
  const { addToast } = useToaster()
  const [data, setData] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [sortField, setSortField] = useState('userId')
  const [sortDirection, setSortDirection] = useState('asc')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.get(url, {
        params: {
          page: currentPage - 1,
          size: pageSize,
          sort: `${sortField}`,
          direction: `${sortDirection}`,
          [searchParam]: searchTerm, // Include search parameter
        },
      })
      setData(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (err) {
      if (err instanceof AxiosError) {
        addToast('Error fetching data', 'Reason: ' + err, 'error')
      }
      setError('Error fetching data. Reason: ' + err)
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize, sortField, sortDirection, searchTerm])

  const handleSort = (field) => {
    setSortField(field)
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value))
    setCurrentPage(1) // Reset to first page when page size changes
  }

  const handleActionClick = (link) => {
    window.location.href = link
  }

  // Dynamically determine which field to filter based on dataType ('user' or 'ta')
  const filterField = dataType === 'user' ? 'userId' : 'id'

  const filterData = data.filter((item) => {
    return String(item[filterField]).toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Conditionally define columns for 'user' vs 'ta'
  const filteredColumns = columns.map((col) => {
    if (dataType === 'ta' && col.key === 'roleName') {
      col.key = 'subjectdn' // Replace 'roleName' with 'subjectdn' for 'ta' data
    }
    return col
  })

  return (
    <CCard>
      <CCardHeader>
        <strong>{heading}</strong>
      </CCardHeader>
      <CCardBody>
        <CFormInput
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />

        <CTable className="table" hover>
          <CTableHead>
            <CTableRow color={'light'}>
              {filteredColumns.map((col) => (
                <CTableHeaderCell key={col.key} onClick={() => handleSort(col.key)}>
                  {col.label} {sortField === col.key ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                </CTableHeaderCell>
              ))}
              <CTableHeaderCell aria-setsize={12}></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {data.length > 0 ? (
              filterData.map((item, index) => (
                <CTableRow key={index}>
                  {filteredColumns.map((col) =>
                    col.key !== 'actions' ? (
                      <CTableDataCell key={col.key}>{item[col.key]}</CTableDataCell>
                    ) : (
                      <CTableDataCell key={col.key}>
                        <CDropdown>
                          <CDropdownToggle color="primary">
                            <CIcon icon={cilOptions}></CIcon>
                          </CDropdownToggle>
                          <CDropdownMenu>
                            {col.actions?.map((action, index) => (
                              <CDropdownItem
                                key={index}
                                href={action.link}
                                onClick={() => handleActionClick(action.link(item))}
                              >
                                {action.label}
                              </CDropdownItem>
                            ))}
                          </CDropdownMenu>
                        </CDropdown>
                      </CTableDataCell>
                    )
                  )}
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={filteredColumns.length}>
                  <div className="d-flex justify-content-center">
                    <CSpinner color={'primary'} hidden={!loading} />
                  </div>
                  {!loading ? 'No data available' : ''}
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        <div>
          <CFormSelect
            label={'Items per page:'}
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            width={'fit'}
            className="item-per-page-size"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </CFormSelect>
          <SmartPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </CCardBody>
    </CCard>
  )
}

SmartTable.propTypes = {
  columns: PropTypes.array.isRequired,
  actions: PropTypes.array,
  defaultPageSize: PropTypes.number,
  searchParam: PropTypes.string,
  url: PropTypes.string,
  dataType: PropTypes.oneOf(['user', 'ta']), // dataType is passed as a prop to distinguish user and ta data
}

export default SmartTable