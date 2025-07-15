import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { selectIsAuthenticated, selectUser } from '../features/auth/authSlice'
import { initializeAuth } from '../features/auth/authService'

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)
  const location = useLocation()

  useEffect(() => {
    // If not authenticated but we might have data in localStorage, try to initialize
    if (!isAuthenticated) {
      const token = localStorage.getItem('token')
      const userString = localStorage.getItem('user')
      
      if (token && userString) {
        console.log('ProtectedRoute: Re-initializing auth from localStorage')
        dispatch(initializeAuth())
      }
    }
  }, [isAuthenticated, dispatch])

  console.log('ProtectedRoute:', { 
    isAuthenticated, 
    hasUser: !!user, 
    pathname: location.pathname,
    hasTokenInStorage: !!localStorage.getItem('token')
  })

  // If not authenticated and no token in storage, redirect to login
  if (!isAuthenticated || !user) {
    const hasTokenInStorage = localStorage.getItem('token')
    
    if (!hasTokenInStorage) {
      console.log('No authentication found, redirecting to login')
      return <Navigate to="/login" state={{ from: location }} replace />
    }
    
    // If we have token but auth state isn't ready yet, show loading
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  // If authenticated, render the protected component
  return children
}

export default ProtectedRoute
