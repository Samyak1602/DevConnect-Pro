import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload
      state.error = null
    },
    
    // Set error
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null
    },
    
    // Login success
    loginSuccess: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      state.loading = false
      state.error = null
      
      // Persist to localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },
    
    // Register success (same as login)
    registerSuccess: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      state.loading = false
      state.error = null
      
      // Persist to localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },
    
    // Set user from localStorage (on app start)
    setUserFromStorage: (state, action) => {
      const { user, token } = action.payload
      if (user && token) {
        console.log('Setting user from storage:', { userId: user.id, username: user.username })
        state.user = user
        state.token = token
        state.isAuthenticated = true
        state.loading = false
        state.error = null
      } else {
        console.warn('Invalid user or token provided to setUserFromStorage')
      }
    },
    
    // Logout
    logout: (state) => {
      console.log('Logging out user')
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      
      // Clear localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    
    // Update user profile
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem('user', JSON.stringify(state.user))
    }
  }
})

export const {
  setLoading,
  setError,
  clearError,
  loginSuccess,
  registerSuccess,
  setUserFromStorage,
  logout,
  updateUser
} = authSlice.actions

export default authSlice.reducer

// Selectors
export const selectAuth = (state) => state.auth
export const selectUser = (state) => state.auth.user
export const selectToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error
