// src/actions/themeActions.js

// Action to toggle the sidebar
export const toggleSidebar = () => {
    return {
      type: 'TOGGLE_SIDEBAR',
    }
  }
  
  // Action to set the theme (light or dark)
  export const setTheme = (theme) => {
    return {
      type: 'SET_THEME',
      payload: theme, // 'light' or 'dark'
    }
  }