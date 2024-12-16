// src/reducers/themeReducer.js

const initialState = {
    sidebarShow: true,  // Default value for sidebar visibility
    theme: 'light',     // Default theme
  }
  
  const themeReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'TOGGLE_SIDEBAR':
        return {
          ...state,
          sidebarShow: !state.sidebarShow, // Toggle sidebar visibility
        }
      case 'SET_THEME':
        return {
          ...state,
          theme: action.payload, // Set the theme to light/dark based on action payload
        }
      default:
        return state
    }
  }
  
  export default themeReducer