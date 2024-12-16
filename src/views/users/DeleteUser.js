import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CSpinner,
} from '@coreui/react'
import axiosInstance from 'src/utils/axiosInstance'
import { useToaster } from 'src/services/ToasterService'
import PropTypes from 'prop-types'
import { useNavigate, useParams } from 'react-router-dom'
import Mode from 'src/utils/Mode'

const DeleteUser = ({ mode }) => {
  const { userId } = useParams()
  // const userId = searchParams.get('userId')
  const [status, setStatus] = useState('ACTIVE')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { addToast } = useToaster()
  const isViewMode = mode === Mode.VIEW
  const isEditMode = mode === Mode.EDIT
  const isInsertMode = mode === Mode.INSERT
  const navigate = useNavigate()

  // Fetch user data for View or Edit mode
  useEffect(() => {
    if (mode == null) {
      addToast('Error', 'Invalid access to resource.', 'error')
      handleCancel()
    }
    if (userId == null && (Mode.VIEW === mode || Mode.EDIT === mode)) {
      addToast('Error', 'User Id not found to ' + mode, 'error')
      handleCancel()
    }
    if ((isViewMode || isEditMode) && userId) {
      fetchUser()
    }
  }, [userId])

  const fetchUser = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`/api/users/${userId}`)
      if (response.status !== 200) {
        addToast('Error', `Unexpected response status: ${response.status}`, 'error')
        return
      }
      const data = response.data
      setUsername(data.userId)
      setStatus(data.status)
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!username.trim()) newErrors.username = 'Username is required'
    if (isInsertMode) {
      if (!password) newErrors.password = 'Password is required'
      if (password.length < 8) newErrors.password = 'Password must be at least 8 characters'
      if (!confirmPassword) newErrors.confirmPassword = 'Confirm Password is required'
      if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const deletUser = async (e) => {
    e.preventDefault()
    try {
      const response = await axiosInstance.delete(`/api/users/${userId}`)
      if (response.status !== 204) {
        addToast('Error', `Unexpected response status: ${response.status}`, 'error')
        return
      }
      addToast('Success', 'User deleted successfully', 'success')
      navigate('/system/users')
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const payload = {
        userId: username,
        status,
        ...(isInsertMode && { password }),
      }

      const url = isInsertMode ? '/api/users' : `/api/users/${userId}`
      const method = isInsertMode ? 'POST' : 'PUT'

      const response = await axiosInstance({
        method,
        url,
        data: payload,
      })

      if (isInsertMode && response.status !== 201) {
        addToast('Error', `Unexpected response status: ${response.status}`, 'error')
        return
      }

      if (isEditMode && response.status !== 204) {
        addToast('Error', `Unexpected response status: ${response.status}`, 'error')
        return
      }

      addToast('Success', 'User saved successfully', 'success')
      handleCancel()
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleError = (error) => {
    if (error.response) {
      const { errorCode, errorMessage } = error.response.data
      addToast(errorCode, errorMessage, 'error')
    } else {
      addToast('Error', 'An unexpected error occurred. Reason: ' + error, 'error')
    }
  }

  const handleCancel = () => {
    navigate('/system/users')
  }

  const editCurrentUser = () => {
    navigate(`/system/users/edit/${userId}`)
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>
          {mode.label} {!isInsertMode && ` > ${userId}`}{' '}
        </strong>
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          {loading && <CSpinner color="primary" className="mb-3" />}

          <CRow className="mb-3">
            <CFormLabel className="col-sm-2 col-form-label">Status</CFormLabel>
            <CCol sm={10}>
              <CFormSelect
                disabled={true}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel className="col-sm-2 col-form-label">Username</CFormLabel>
            <CCol sm={10}>
              <CFormInput type="text" disabled={true} value={userId} />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol sm={{ span: 10, offset: 2 }}>
              <CButton onClick={deletUser} type="submit" color="primary" disabled={loading}>
                Delete User
              </CButton>
              <CButton color="secondary" className="ms-2" onClick={handleCancel} disabled={loading}>
                Cancel
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

DeleteUser.propTypes = {
  mode: PropTypes.instanceOf(Mode),
  // userId: string,
}

export default DeleteUser
