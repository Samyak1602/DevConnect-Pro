import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { selectUser } from '../features/auth/authSlice'
import { logoutUser } from '../features/auth/authService'
import { User, LogOut, Code2, Users, FolderOpen, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      toast.success('Logged out successfully!', {
        duration: 2000,
        position: 'top-center',
      })
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Error logging out. Please try again.', {
        duration: 3000,
        position: 'top-center',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">DevConnect Pro</h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Welcome, {user.username}!
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-ghost btn-sm text-slate-600 hover:text-red-600"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Stats Card */}
          <div className="card bg-white shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-lg text-slate-900">Your Profile</h2>
              <div className="space-y-2">
                <p className="text-sm text-slate-600">
                  <strong>Username:</strong> {user.username}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Role:</strong> {user.role || 'Developer'}
                </p>
              </div>
              <div className="card-actions justify-end mt-4">
                <Link to="/profile" className="btn btn-primary btn-sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Projects Card */}
          <div className="card bg-white shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-lg text-slate-900">
                <FolderOpen className="h-5 w-5 mr-2" />
                Projects
              </h2>
              <p className="text-slate-600">Manage your coding projects and collaborate with others.</p>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary btn-sm">
                  View Projects
                </button>
              </div>
            </div>
          </div>

          {/* Community Card */}
          <div className="card bg-white shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-lg text-slate-900">
                <Users className="h-5 w-5 mr-2" />
                Community
              </h2>
              <p className="text-slate-600">Connect with fellow developers and grow your network.</p>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary btn-sm">
                  Explore Community
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-8 text-center">
          <div className="card bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold justify-center">
                🎉 Welcome to DevConnect Pro, {user.username}!
              </h2>
              <p className="text-indigo-100 mt-2">
                You're now part of a growing community of developers. Start building, sharing, and collaborating on amazing projects!
              </p>
              <div className="card-actions justify-center mt-6">
                <button className="btn btn-white text-indigo-600 hover:bg-indigo-50">
                  Get Started
                </button>
                <button className="btn btn-outline btn-white text-white border-white hover:bg-white hover:text-indigo-600">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
