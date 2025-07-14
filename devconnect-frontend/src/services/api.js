import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Store reference for Redux store (will be set by authService)
let store = null

export const setStore = (reduxStore) => {
  store = reduxStore
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // If we have Redux store, dispatch logout action
      if (store) {
        try {
          const { logoutUser } = await import('../features/auth/authService')
          store.dispatch(logoutUser())
        } catch (importError) {
          console.error('Error importing auth service:', importError)
          // Fallback to manual cleanup
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      } else {
        // Fallback to manual cleanup
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API functions
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      // Handle specific MongoDB duplicate key errors
      if (error.response?.data) {
        const errorData = error.response.data
        
        // Check for duplicate email
        if (errorData.message && errorData.message.includes('E11000') && errorData.message.includes('email')) {
          throw { message: 'This email address is already registered. Please use a different email or try logging in.' }
        }
        
        // Check for duplicate username
        if (errorData.message && errorData.message.includes('E11000') && errorData.message.includes('username')) {
          throw { message: 'This username is already taken. Please choose a different username.' }
        }
        
        // Check for other duplicate errors
        if (errorData.message && errorData.message.includes('E11000')) {
          throw { message: 'An account with this information already exists. Please check your email and username.' }
        }
        
        // Return the actual error message from backend
        throw { message: errorData.message || 'Registration failed' }
      }
      
      throw { message: 'Registration failed. Please try again.' }
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' }
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token')
    return !!token
  }
}

export default api