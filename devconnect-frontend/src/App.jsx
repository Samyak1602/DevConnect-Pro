import React, { useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import { Route, Routes } from 'react-router-dom'
import { initializeAuth, initializeApiStore } from './features/auth/authService'

const App = () => {
  const dispatch = useDispatch()
  const store = useStore()

  useEffect(() => {
    // Initialize auth state from localStorage on app start
    dispatch(initializeAuth())
    
    // Set store reference for API interceptors
    initializeApiStore(store)
  }, [dispatch, store])

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
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App
