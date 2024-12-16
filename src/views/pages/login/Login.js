import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axiosInstance from 'src/utils/axiosInstance'
import LocalStorageService, {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from 'src/services/localStorageService'
import IdenfoPurpleYellow from 'src/assets/images/idenfo_purple_yellow.png'
import { useDispatch } from 'react-redux'
import { setUser } from '../../../actions/userActions'

const Login = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const errorCode = queryParams.get('error_code')
  const errorMessage = queryParams.get('error_message')
  // Check if user is already logged in and redirect to dashboard
  useEffect(() => {
    const accessToken = LocalStorageService.getItem(ACCESS_TOKEN_KEY)
    if (accessToken) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const response = await axiosInstance.post('/auth/login', { username, password })
      if (response.data.status === 'SUCCESS') {
        const { accessToken, refreshToken } = response.data

        // Store tokens in local storage
        LocalStorageService.setItem(ACCESS_TOKEN_KEY, accessToken)
        LocalStorageService.setItem(REFRESH_TOKEN_KEY, refreshToken)
        localStorage.setItem('username', username.trim())
        // dispatch(setUser(username))

        // Redirect to dashboard
        navigate('/dashboard')
      } else {
        setError(response.data.message || 'Login failed')
      }
    } catch (error) {
      console.log(error)
      setVisible(true)
      setError(error.response?.data?.errorMessage || 'An error occurred')
      // alert('Login failed. Please check your credentials.')
    }
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <div className="center-align">
                      <CImage
                        className="cil-image"
                        alt={'Idenfo'}
                        src={IdenfoPurpleYellow}
                        height={90}
                      />
                    </div>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required={true}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={true}
                      />
                    </CInputGroup>
                    <CAlert
                      color="danger"
                      dismissible
                      visible={visible}
                      onClose={() => setVisible(false)}
                    >
                      {error}
                    </CAlert>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type={'submit'}>
                          Login
                        </CButton>
                      </CCol>
                      {/*<CCol xs={6} className="text-right">*/}
                      {/*  <CButton color="link" className="px-0">*/}
                      {/*    Forgot password?*/}
                      {/*  </CButton>*/}
                      {/*</CCol>*/}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              {/*<CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>*/}
              {/*  <CCardBody className="text-center">*/}
              {/*    <div>*/}
              {/*      <h2>Sign up</h2>*/}
              {/*      <p>Sign UP Text</p>*/}
              {/*      <Link to="/register">*/}
              {/*        <CButton color="primary" className="mt-3" active tabIndex={-1}>*/}
              {/*          Register Now!*/}
              {/*        </CButton>*/}
              {/*      </Link>*/}
              {/*    </div>*/}
              {/*  </CCardBody>*/}
              {/*</CCard>*/}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
