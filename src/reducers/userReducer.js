const initialState = {
  user: null, // This will store the user data
}

const userReducer = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'SET_USER':
      return {
        ...state,
        user: rest.payload, // Store user data in the state
      }
    case 'CLEAR_USER':
      return {
        ...state,
        user: null, // Clear user data from the state (e.g., on logout)
      }
    default:
      return state
  }
}

export default userReducer
