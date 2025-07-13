import React from 'react'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Landing/>} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
