import React, { useEffect } from 'react'
import { useDispatch, useStore, useSelector } from 'react-redux'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import ProfileEdit from './pages/ProfileEdit'
import ProjectEdit from './pages/ProjectEdit'
import ProtectedRoute from './components/ProtectedRoute'
import { Route, Routes } from 'react-router-dom'
import { initializeAuth, initializeApiStore } from './features/auth/authService'
import { selectIsAuthenticated } from './features/auth/authSlice'

const App = () => {
  const dispatch = useDispatch()
  const store = useStore()
  const isAuthenticated = useSelector(selectIsAuthenticated)

  useEffect(() => {
    console.log('App: Initializing authentication...')
    // Initialize auth state from localStorage on app start
    dispatch(initializeAuth())
    
    // Set store reference for API interceptors
    initializeApiStore(store)
  }, [dispatch, store])

  useEffect(() => {
    console.log('App: Auth state changed:', { isAuthenticated })
  }, [isAuthenticated])

  return (
    <div>
      <Routes>
        <Route path='/' element={<Landing/>} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/profile/:username" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/profile/edit" element={
          <ProtectedRoute>
            <ProfileEdit />
          </ProtectedRoute>
        } />
        <Route path="/project/new" element={
          <ProtectedRoute>
            <ProjectEdit />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App
