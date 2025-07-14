import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Code2, Github, Mail, Eye, EyeOff, ArrowLeft, LogIn, User, AlertCircle } from "lucide-react"
import { loginUser } from "../features/auth/authService"
import { selectAuthLoading, selectAuthError, clearError } from "../features/auth/authSlice"
import toast, { Toaster } from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const loading = useSelector(selectAuthLoading)
  const authError = useSelector(selectAuthError)
  
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear errors when user starts typing
    if (error) setError("")
    if (authError) dispatch(clearError())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please provide both email and password")
      return
    }

    // Clear any previous errors
    setError("")
    dispatch(clearError())

    try {
      await dispatch(loginUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })).unwrap()

      // Show success toast
      toast.success('Login successful! Welcome back!', {
        duration: 2000,
        position: 'top-center',
      })

      // Navigate to home page
      navigate('/home', { replace: true })
      
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error || "Login failed. Please try again.", {
        duration: 4000,
        position: 'top-center',
      })
      setError(error || "Login failed. Please try again.")
    }
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to DevConnect Pro
          </Link>
        </div>

        <div className="card bg-white border border-slate-200 shadow-xl">
          <div className="card-body">
            {/* Header */}
            <div className="text-center pb-6">
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <Code2 className="h-7 w-7 text-white" />
                </div>
              </div>
              <h2 className="card-title text-2xl font-bold text-slate-900 justify-center">Welcome Back</h2>
              <p className="text-slate-600 mt-2">
                Sign in to your DevConnect Pro account
              </p>
            </div>

            <div className="space-y-6">
              {/* Social Login */}
              <div className="space-y-3">
                <button
                  className="btn btn-outline w-full border-slate-300 hover:border-indigo-300 hover:bg-indigo-50 bg-white text-slate-700 hover:text-indigo-700"
                  type="button"
                >
                  <Github className="h-5 w-5 mr-2" />
                  Sign in with GitHub
                </button>
                <button
                  className="btn btn-outline w-full border-slate-300 hover:border-indigo-300 hover:bg-indigo-50 bg-white text-slate-700 hover:text-indigo-700"
                  type="button"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Sign in with Google
                </button>
              </div>

              <div className="divider text-xs uppercase text-slate-500">Or sign in with email</div>

              {/* Error Alert */}
              {(error || authError) && (
                <div className="alert alert-error">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error || authError}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm font-medium text-slate-700">Email address</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="input input-bordered border-slate-300 focus:border-indigo-500 bg-white w-full text-slate-900 placeholder-slate-400 disabled:bg-white disabled:text-slate-900 disabled:border-slate-300 disabled:opacity-70"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm font-medium text-slate-700">Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="input input-bordered border-slate-300 focus:border-indigo-500 pr-10 w-full bg-white text-slate-900 placeholder-slate-400 disabled:bg-white disabled:text-slate-900 disabled:border-slate-300 disabled:opacity-70"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me and Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary mr-3"
                        checked={formData.rememberMe}
                        onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                      />
                      <span className="label-text text-sm text-slate-600">Remember me</span>
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className={`btn btn-lg w-full border-none ${
                    !loading 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="text-center">
                <span className="text-sm text-slate-600">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
                    Sign up
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>Secure login to DevConnect Pro</p>
        </div>
      </div>
      </div>
    </>
  )
}

export default Login
