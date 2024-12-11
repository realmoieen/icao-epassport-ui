// src/utils/axiosInstance.js
import axios from 'axios'
import store from '../store'
import LocalStorageService from 'src/services/localStorageService'
import { refreshToken } from 'src/services/authService'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_IDENFO_SERVER_BASE_URL, // Get the baseURL from the environment variable
})
//
// axiosInstance.intercept.request.use(
//   (config) => {
//     const { accessToken } = store.getState()
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error),
// )
axiosInstance.interceptors.request.use(
  (request) => {
    const accessToken = LocalStorageService.getItem('accessToken')
    if (accessToken) {
      request.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return request
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const newAccessToken = await refreshToken()
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
        return axiosInstance(originalRequest)
      } catch (err) {
        console.log(err)
        LocalStorageService.clearTokens()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
