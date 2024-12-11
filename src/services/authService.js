// src/services/authService.js
import axios from 'axios'
import LocalStorageService, {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from 'src/services/localStorageService'
import axiosInstance from 'src/utils/axiosInstance'

// Refresh token function
export const refreshToken = async () => {
  try {
    const refresh_token = LocalStorageService.getRefreshToken()
    if (!refresh_token) {
      throw new Error('No refresh token available')
    }

    const response = await axiosInstance().post(`/auth/refresh?refreshToken=${refresh_token}`)

    // Store the new tokens
    const { accessToken, refreshToken: newRefreshToken } = response.data
    LocalStorageService.setItem(ACCESS_TOKEN_KEY, accessToken)
    LocalStorageService.setItem(REFRESH_TOKEN_KEY, newRefreshToken)

    return accessToken
  } catch (error) {
    console.error('Error refreshing token:', error)
    LocalStorageService.clearTokens()
    window.location.href = '/login'
    throw error
  }
}
