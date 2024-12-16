import { combineReducers, legacy_createStore as createStore } from 'redux'
import authReducer from './reducers/authReducer'
import userReducer from './reducers/userReducer'
import themeReducer from './reducers/themeReducer'

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  theme: themeReducer,
})

const initialState = {
  sidebarShow: true,
  theme: 'light',
}

export const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(rootReducer)
export default store
