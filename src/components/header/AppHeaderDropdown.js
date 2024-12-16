import React, { useEffect } from 'react'
import {
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormLabel,
} from '@coreui/react'
import { cilAccountLogout, cilSettings, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useToaster } from 'src/services/ToasterService'
import axiosInstance from 'src/utils/axiosInstance'
import { useSelector } from 'react-redux'

const AppHeaderDropdown = () => {
  const { user } = useSelector((state) => state.user)
  const { addToast, handleError } = useToaster()
  // const [username, setUsername] = React.useState('')
  const username = localStorage.getItem('username').trim()

  const getUser = async () => {
    try {
      const response = await axiosInstance.get(`/auth/user/${user}`)
      if (response) {
        setUsername(response.data.username)
      }
    } catch (error) {
      throw new error()
    }
  }

  // useEffect(() => {
  //   getUser()
  // }, [user])

  const logout = async () => {
    try {
      const response = await axiosInstance.get(`/auth/logout`)
      if (response.status === 200) {
        addToast('Logout', `Logout Successfully`, 'information')
      }
    } catch (error) {
      handleError(error)
    } finally {
      LocalStorageService.clearTokens()
      window.location.href = '/login'
    }
  }
  return (
    <CDropdown variant="nav-item">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: 'red',
          gap: '10px',
          height: '100%',
        }}
      >
        <CDropdownToggle
          placement="bottom-end"
          className="py-0 pe-2"
          caret={false}
        >
          {/*<CAvatar src={avatar8} size="md" />*/}
          <CIcon icon={cilUser} />
          <CFormLabel>{username}</CFormLabel>
        </CDropdownToggle>
      </div>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        {/*<CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>*/}
        {/*<CDropdownItem href="#">*/}
        {/*  <CIcon icon={cilBell} className="me-2" />*/}
        {/*  Updates*/}
        {/*  <CBadge color="info" className="ms-2">*/}
        {/*    42*/}
        {/*  </CBadge>*/}
        {/*</CDropdownItem>*/}
        {/*<CDropdownItem href="#">*/}
        {/*  <CIcon icon={cilEnvelopeOpen} className="me-2" />*/}
        {/*  Messages*/}
        {/*  <CBadge color="success" className="ms-2">*/}
        {/*    42*/}
        {/*  </CBadge>*/}
        {/*</CDropdownItem>*/}
        {/*<CDropdownItem href="#">*/}
        {/*  <CIcon icon={cilTask} className="me-2" />*/}
        {/*  Tasks*/}
        {/*  <CBadge color="danger" className="ms-2">*/}
        {/*    42*/}
        {/*  </CBadge>*/}
        {/*</CDropdownItem>*/}
        {/*<CDropdownItem href="#">*/}
        {/*  <CIcon icon={cilCommentSquare} className="me-2" />*/}
        {/*  Comments*/}
        {/*  <CBadge color="warning" className="ms-2">*/}
        {/*    42*/}
        {/*  </CBadge>*/}
        {/*</CDropdownItem>*/}
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={logout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
