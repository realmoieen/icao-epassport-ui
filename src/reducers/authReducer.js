// src/reducers/authReducer.js
const initialState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
}

const authReducer = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        accessToken: rest.payload.accessToken,
        refreshToken: rest.payload.refreshToken,
        expireIn: rest.payload.expireIn,
        isAuthenticated: true,
      }
    case 'LOGOUT':
      return {
        ...state,
        accessToken: null,
        refreshToken: null,
        expireIn: null,
        isAuthenticated: false,
      }
    default:
      return state
  }
}

export default authReducer
