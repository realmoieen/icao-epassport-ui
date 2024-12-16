export const setUser = (userData) => {
    return {
      type: 'SET_USER',
      payload: userData,  // The user data to store in the state
    }
  }