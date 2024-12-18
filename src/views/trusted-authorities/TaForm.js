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
  CFormTextarea,
  CFormSelect,
  CRow,
  CSpinner,
} from '@coreui/react'
import axiosInstance from 'src/utils/axiosInstance'
import { useToaster } from 'src/services/ToasterService'
import PropTypes from 'prop-types'
import { useNavigate, useParams } from 'react-router-dom'
import Mode from 'src/utils/Mode'

const CreateTa = ({ mode }) => {
  const { taId } = useParams()
  // const userId = searchParams.get('userId')
  const [status, setStatus] = useState('ACTIVE')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [base64Certificate, setBase64Certificate] = useState('')
  const [friendlyName, setFriendlyName] = useState('')
  const [distinguishedName, setDistinguishedName] = useState('')
  const { addToast } = useToaster()
  const { handleError } = useToaster()
  const isViewMode = mode === Mode.VIEW
  const isEditMode = mode === Mode.EDIT
  const isInsertMode = mode === Mode.INSERT
  const navigate = useNavigate()

  // Fetch user data for View or Edit mode

  const generateRandomId = () => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000) // Generates a random number between 1000 and 9999
    return `TA${randomNumber}`
  }

  const createTa = async (base64Certificate) => {
    const id = generateRandomId()
    try {
      const response = await axiosInstance.post('/api/ta/', {
        status: status,
        base64Certificate,
        id,
      })

      if (response.status === 400) {
        // Handle the case where the server responds with a 400 status code
        addToast('Error', `Another trusted authority with same certificate already exists`, 'error')
        console.log('already exists')
        return // return early to prevent the following code from running
      }

      if (response.status === 201) {
        // Successfully created the trusted authority
        addToast('Success', `Trusted authority created successfully`, 'success')
        navigate('/system/trusted-authorities')
        return
      }

      // This will catch any other response status code
      addToast('Error', `Trusted authority creation failed`, 'error')
    } catch (error) {
      // Handle axios error (this is where 400 and other error codes are caught)
      if (error.response) {
        // If error is an axios error and we have a response from the server
        console.log('Error Response:', error.response)
        addToast('Error', `${error.response.data.errorMessage}`, 'error')
      } else {
        // For network errors or other issues that do not return a response
        console.log('Error', error.message)
        addToast('Error', `Error: ${error.message}`, 'error')
      }
    }
  }

  const uploadFile = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axiosInstance.post('/api/ta/new/upload', formData)

      if (response) {
        setBase64Certificate(response.data.base64Certificate)
        setDistinguishedName(response.data.subjectDn)
        setFriendlyName(response.data.caid)
      }

      // Check if the file upload response was successful
      if (response.status !== 200) {
        addToast('Error', `Unexpected response status: ${response.status}`, 'error')
        return
      }

      // await setFileResponse(response.data)
      // addToast('Success', 'File uploaded successfully', 'success')
      // console.log(fileResponse)

      // Ensure the backend returns the base64Certificate data
    } catch (error) {
      // handleError(error)
      console.log(error)
    }
  }

  // useEffect(() => {
  //   if (mode == null) {
  //     addToast('Error', 'Invalid access to resource.', 'error')
  //     handleCancel()
  //   }
  //   if (userId == null && (Mode.VIEW === mode || Mode.EDIT === mode)) {
  //     addToast('Error', 'User Id not found to ' + mode, 'error')
  //     handleCancel()
  //   }
  //   if ((isViewMode || isEditMode) && userId) {
  //     fetchUser()
  //   }
  // }, [userId])

  const fetchTa = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`/api/ta/${taId}`)
      setDistinguishedName(response.data.subjectDN)
      setStatus(response.data.status)
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

  const updateTa = async () => {
    try {
      const response = await axiosInstance.put(`/api/ta/${taId}`, {
        status,
        base64Certificate,
      })

      if (response) {
        navigate('/system/trusted-authorities')
      }

      if (response.status == 204) {
        addToast('Success', `Trusted authority updated successfully`, 'success')
        return
      } else {
        addToast('Error', `Trusted authority update failed`, 'error')
      }
      // handleCancel()
    } catch (error) {
      // handleError(error)
      console.log(error)
      addToast('Error', `${error.response.data.errorMessage}`, 'error')
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

  const handleCancel = () => {
    navigate('/system/trusted-authorities')
  }

  const editCurrentUser = () => {
    updateTa()
    navigate(`/system/trusted-authorities/edit/${userId}`)
  }

  useEffect(() => {
    if (taId) {
      fetchTa()
    }
  }, [])

  return (
    <CCard>
      <CCardHeader>
        <strong>
          {mode.label} Trusted Authority {!isInsertMode && ` > ${taId}`}{' '}
        </strong>
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          {loading && <CSpinner color="primary" className="mb-3" />}

          <CRow className="mb-3">
            <CFormLabel className="col-sm-2 col-form-label">Status</CFormLabel>
            <CCol sm={10}>
              <CFormSelect
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                disabled={mode.label == 'View'}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </CFormSelect>
            </CCol>
          </CRow>

          {(mode.label === 'Edit' || mode.label === 'Create') && (
            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">Ta Certificate</CFormLabel>
              <CCol sm={3}>
                <CFormInput
                  type="file"
                  disabled={!mode.label === 'Create' || !mode.label === 'Edit'}
                  // value={username}
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      setUsername(file.name)
                      uploadFile(file)
                    }
                  }}
                  required
                />
              </CCol>
            </CRow>
          )}

          {true && (
            <>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-2 col-form-label">Ta Distinguished Name</CFormLabel>
                <CCol sm={10}>
                  <CFormTextarea
                    type="textarea"
                    value={distinguishedName}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={true}
                  />
                </CCol>
              </CRow>

              {mode.label === 'Create' && (
                <CRow className="mb-3">
                  <CFormLabel className="col-sm-2 col-form-label">Ta Friendly name</CFormLabel>
                  <CCol sm={10}>
                    <CFormInput
                      type="text"
                      value={friendlyName}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={true}
                    />
                  </CCol>
                </CRow>
              )}
            </>
          )}

          <CRow className="mb-3">
            <CCol sm={{ span: 10, offset: 2 }}>
              {mode.label == 'Create' && (
                <CButton
                  type="submit"
                  onClick={() => {
                    isInsertMode && createTa(base64Certificate)
                  }}
                  color="primary"
                  disabled={loading}
                >
                  Save
                </CButton>
              )}
              {mode.label == 'Edit' && (
                <CButton onClick={editCurrentUser} color="primary" disabled={loading}>
                  Update
                </CButton>
              )}
              <CButton color="secondary" className="ms-2" onClick={handleCancel} disabled={loading}>
                Back
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

CreateTa.propTypes = {
  mode: PropTypes.instanceOf(Mode),
  // userId: string,
}

export default CreateTa
