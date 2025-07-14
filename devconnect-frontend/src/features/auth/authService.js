import { createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI, setStore } from '../../services/api'
import { 
  setLoading, 
  setError, 
  loginSuccess, 
  registerSuccess, 
  logout as logoutAction 
} from './authSlice'

// Function to set the store reference for API interceptors
export const initializeApiStore = (store) => {
  setStore(store)
}

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true))
      const response = await authAPI.login(credentials)
      
      dispatch(loginSuccess({
        user: response.user,
        token: response.token
      }))
      
      return response
    } catch (error) {
      const errorMessage = error.message || 'Login failed'
      dispatch(setError(errorMessage))
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for register
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true))
      const response = await authAPI.register(userData)
      
      dispatch(registerSuccess({
        user: response.user,
        token: response.token
      }))
      
      return response
    } catch (error) {
      const errorMessage = error.message || 'Registration failed'
      dispatch(setError(errorMessage))
      return rejectWithValue(errorMessage)
    }
  }
)

// Thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    dispatch(logoutAction())
    // Optional: Call backend logout endpoint if you have one
    // await authAPI.logout()
  }
)

// Function to initialize auth state from localStorage
export const initializeAuth = () => (dispatch) => {
  const token = localStorage.getItem('token')
  const userString = localStorage.getItem('user')
  
  if (token && userString) {
    try {
      const user = JSON.parse(userString)
      dispatch({
        type: 'auth/setUserFromStorage',
        payload: { user, token }
      })
    } catch (error) {
      console.error('Error parsing user from localStorage:', error)
      // Clear corrupted data
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
}

export default {
  loginUser,
  registerUser,
  logoutUser,
  initializeAuth
}
