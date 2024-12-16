import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  CCloseButton,
  CImage,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

import IdenfoPurpleYellow from 'src/assets/images/idenfo_purple_yellow.png'
// import IdenfoPurpleWhite from 'src/assets/images/idenfo_purple_white.png'
// import IdenfoCircleBlack from 'src/assets/images/idenfo_circle_black.png'
import IdenfoCircleWhite from 'src/assets/images/idenfo_circle_white.png'
// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.theme.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CImage
            className="sidebar-brand-full"
            alt={'Idenfo'}
            src={IdenfoPurpleYellow}
            height={45}
          />
          <CImage
            className="sidebar-brand-narrow"
            alt={'Idenfo Circle'}
            src={IdenfoCircleWhite}
            height={32}
          />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
