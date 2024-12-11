// src/services/ToasterService.js
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { CProgress, CToast, CToastBody, CToaster, CToastHeader } from '@coreui/react'
import { any, array, func } from 'prop-types'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

const ToasterContext = createContext()

export const ToasterProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  // Function to add a new toast
  const addToast = (header, message, type = 'info') => {
    const duration = 5000
    setToasts((prevToasts) => [
      ...prevToasts,
      { id: Date.now(), header, message, type, duration, createdAt: Date.now() },
    ])
  }

  const handleError = (error) => {
    if (error.response) {
      const { errorCode, errorMessage } = error.response.data
      addToast(errorCode, errorMessage, 'error')
    } else {
      addToast('Error', 'An unexpected error occurred. Reason: ' + error, 'error')
    }
  }

  // Function to remove a toast by ID
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return (
    <ToasterContext.Provider value={{ addToast }}>
      {children}
      <CToaster className="position-fixed bottom-0 end-0 p-3">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </CToaster>
    </ToasterContext.Provider>
  )
}

ToasterProvider.propTypes = {
  children: any,
}

// Custom hook to use the Toaster service
export const useToaster = () => {
  return useContext(ToasterContext)
}

// Toast Item Component with Progress Bar and Elapsed Time
const ToastItem = ({ toast, onClose }) => {
  const { header, message, type, duration, createdAt } = toast
  const [elapsedTime, setElapsedTime] = useState(0)
  const [progress, setProgress] = useState(100)
  const intervalRef = useRef()

  useEffect(() => {
    // Update elapsed time every second
    const timeInterval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - createdAt) / 1000))
    }, 1000)

    // Update progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.max(prev - 100 / (duration / 100), 0))
    }, 100)

    // Auto-hide toast after the duration
    const hideTimeout = setTimeout(() => {
      onClose()
    }, duration)

    return () => {
      clearInterval(timeInterval)
      clearInterval(progressInterval)
      clearTimeout(hideTimeout)
    }
  }, [duration, onClose, createdAt])

  return (
    <CToast autohide={false} visible={true} color={type === 'error' ? 'danger' : 'success'}>
      <CToastHeader closeButton>
        {type === 'error' ? (
          <FaTimesCircle className="text-danger me-2" size={20} />
        ) : (
          <FaCheckCircle className="text-success me-2" size={20} />
        )}
        <div className="fw-bold me-auto">{header}</div>
        <small>{elapsedTime} sec ago</small>
      </CToastHeader>
      <CToastBody>{message}</CToastBody>
      <CProgress
        height={5}
        color={type === 'error' ? 'danger' : 'success'}
        value={progress}
        className="mb-2"
        animated
      />
    </CToast>
  )
}

ToastItem.propTypes = {
  toast: array,
  onClose: func,
}
