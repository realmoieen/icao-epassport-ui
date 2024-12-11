// src/services/localStorageService.js
// src/services/LocalStorageService.js
export const ACCESS_TOKEN_KEY = 'accessToken'
export const REFRESH_TOKEN_KEY = 'refreshToken'

const LocalStorageService = {
  // Store a key-value pair in local storage
  setItem(key, value) {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
    } catch (err) {
      console.error('Error saving to local storage:', err)
    }
  },

  // Retrieve a value by key from local storage
  getItem(key) {
    try {
      const serializedValue = localStorage.getItem(key)
      return serializedValue ? JSON.parse(serializedValue) : null
    } catch (err) {
      console.error('Error reading from local storage:', err)
      return null
    }
  },

  // Remove a key from local storage
  removeItem(key) {
    try {
      localStorage.removeItem(key)
    } catch (err) {
      console.error('Error removing from local storage:', err)
    }
  },

  // Clear all items from local storage
  clear() {
    try {
      localStorage.clear()
    } catch (err) {
      console.error('Error clearing local storage:', err)
    }
  },
  getAccessToken() {
    return this.getItem(ACCESS_TOKEN_KEY)
  },
  getRefreshToken() {
    return this.getItem(REFRESH_TOKEN_KEY)
  },
  clearTokens() {
    this.removeItem(ACCESS_TOKEN_KEY)
    this.removeItem(REFRESH_TOKEN_KEY)
  },
}
// Get tokens

export default LocalStorageService
