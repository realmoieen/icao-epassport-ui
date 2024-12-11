import React from 'react'
import 'src/scss/components/Pagination.css'
import { CPagination, CPaginationItem } from '@coreui/react'
import PropTypes from 'prop-types'

const SmartPagination = ({ currentPage, totalPages, onPageChange }) => {
  // Handle navigation to the first page
  const handleFirst = () => onPageChange(1)

  // Handle navigation to the previous page
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1)
  }

  // Handle navigation to the next page
  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1)
  }

  // Handle navigation to the last page
  const handleLast = () => onPageChange(totalPages)

  // Calculate the range of page numbers to display (max 3 pages around the current page)
  const getPageNumbers = () => {
    const pages = []
    let startPage = Math.max(currentPage - 1, 1)
    let endPage = Math.min(currentPage + 1, totalPages)

    if (currentPage === 1) {
      endPage = Math.min(3, totalPages)
    } else if (currentPage === totalPages) {
      startPage = Math.max(totalPages - 2, 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  return (
    <CPagination align={'start'}>
      <CPaginationItem onClick={handleFirst} disabled={currentPage === 1}>
        &laquo;
      </CPaginationItem>
      <CPaginationItem onClick={handlePrevious} disabled={currentPage === 1}>
        &lt;
      </CPaginationItem>

      {getPageNumbers().map((page) => (
        <CPaginationItem
          key={page}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? 'active' : ''}
        >
          {page}
        </CPaginationItem>
      ))}

      <CPaginationItem onClick={handleNext} disabled={currentPage === totalPages}>
        &gt;
      </CPaginationItem>
      <CPaginationItem onClick={handleLast} disabled={currentPage === totalPages}>
        &raquo;
      </CPaginationItem>
    </CPagination>
  )
}

SmartPagination.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,
}

export default SmartPagination
