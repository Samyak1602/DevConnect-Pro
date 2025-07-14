import React from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/auth/authSlice'
import { User, Mail, Calendar, Shield, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const Profile = () => {
  const user = useSelector(selectUser)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Home */}
        <div className="mb-8">
          <Link
            to="/home"
            className="inline-flex items-center text-sm text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Profile Header */}
        <div className="card bg-white shadow-xl mb-8">
          <div className="card-body">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{user?.username}</h1>
                <p className="text-slate-600">{user?.role || 'Developer'}</p>
                <div className="flex items-center mt-2 text-sm text-slate-500">
                  <Mail className="h-4 w-4 mr-1" />
                  {user?.email}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="card bg-white shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl text-slate-900 mb-4">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Username</label>
                  <p className="text-slate-900">{user?.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <p className="text-slate-900">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Role</label>
                  <p className="text-slate-900">{user?.role || 'Developer'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Member Since</label>
                  <p className="text-slate-900">January 2025</p>
                </div>
              </div>
              <div className="card-actions justify-end mt-6">
                <button className="btn btn-primary">Edit Profile</button>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="card bg-white shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl text-slate-900 mb-4">
                <Shield className="h-5 w-5 mr-2" />
                Account Settings
              </h2>
              <div className="space-y-4">
                <button className="btn btn-outline w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Change Password
                </button>
                <button className="btn btn-outline w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Preferences
                </button>
                <button className="btn btn-outline w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Privacy Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
