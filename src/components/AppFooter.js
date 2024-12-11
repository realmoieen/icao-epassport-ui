import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://idenfo.com" target="_blank" rel="noopener noreferrer">
          Idenfo
        </a>
        <span className="ms-1">&copy; 2024</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://idenfo.com" target="_blank" rel="noopener noreferrer">
          Idenfo Direct
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
