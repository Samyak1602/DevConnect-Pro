import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { selectIsAuthenticated, selectUser } from '../features/auth/authSlice'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)
  const location = useLocation()

  // If not authenticated, redirect to login with the current location
  if (!isAuthenticated || !user) {
    // Pass the current location so user can be redirected back after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If authenticated, render the protected component
  return children
}

export default ProtectedRoute
