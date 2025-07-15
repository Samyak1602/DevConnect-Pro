import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Code2, Github, Mail, Eye, EyeOff, ArrowLeft, Check, AlertCircle } from "lucide-react"
import { registerUser } from "../features/auth/authService"
import { selectAuthLoading, selectAuthError, clearError } from "../features/auth/authSlice"
import toast, { Toaster } from 'react-hot-toast'

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const loading = useSelector(selectAuthLoading)
  const authError = useSelector(selectAuthError)
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [passwordsMatch, setPasswordsMatch] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  })

  const handleInputChange = (field, value) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    
    // Check password matching in real-time
    if (field === 'password' || field === 'confirmPassword') {
      const password = field === 'password' ? value : formData.password
      const confirmPassword = field === 'confirmPassword' ? value : formData.confirmPassword
      
      // Only check matching if both passwords have content
      if (password.length > 0 && confirmPassword.length > 0) {
        setPasswordsMatch(password === confirmPassword)
      } else {
        // If confirmPassword is empty, don't block the form
        setPasswordsMatch(confirmPassword.length === 0)
      }
    }
    
    // Clear error when user starts typing
    if (error) setError("")
  }

  const validateForm = () => {
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.password) {
      setError("All fields are required")
      return false
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }

    if (formData.confirmPassword.length === 0) {
      setError("Please confirm your password")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the Terms of Service")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    // Clear any previous errors
    setError("")
    dispatch(clearError())

    try {
      // Prepare data for backend (only required fields)
      const registrationData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      }

      // Call registration API using Redux
      await dispatch(registerUser(registrationData)).unwrap()

      // Show success toast
      toast.success('Account created successfully! Welcome to DevConnect Pro!', {
        duration: 3000,
        position: 'top-center',
      })

      // Navigate to home page after a short delay
      setTimeout(() => {
        navigate('/home', { replace: true })
      }, 1500)
      
    } catch (error) {
      console.error('Registration error:', error)
      
      // Handle specific error cases with toasts
      if (error && error.toLowerCase().includes('email')) {
        if (error.toLowerCase().includes('already exists') || 
            error.toLowerCase().includes('already taken') ||
            error.toLowerCase().includes('duplicate')) {
          toast.error('This email address is already registered. Please use a different email or try logging in.', {
            duration: 5000,
            position: 'top-center',
          })
        } else {
          toast.error('Invalid email address. Please check and try again.', {
            duration: 4000,
            position: 'top-center',
          })
        }
      } else if (error && error.toLowerCase().includes('username')) {
        // Username errors are now auto-generated, so this shouldn't happen
        toast.error('System error generating username. Please try again.', {
          duration: 4000,
          position: 'top-center',
        })
      } else if (error && error.toLowerCase().includes('duplicate')) {
        // Generic duplicate error
        toast.error('An account with this information already exists. Please check your email and username.', {
          duration: 5000,
          position: 'top-center',
        })
      } else {
        // Generic error
        toast.error(error || "Registration failed. Please try again.", {
          duration: 4000,
          position: 'top-center',
        })
        setError(error || "Registration failed. Please try again.")
      }
    }
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Back button */}
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
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <Code2 className="h-7 w-7 text-white" />
                </div>
              </div>
              <h2 className="card-title text-2xl font-bold text-slate-900 justify-center">Join DevConnect Pro</h2>
              <p className="text-slate-600 mt-2">
                Create your developer profile and start connecting
              </p>
              <div className="badge badge-lg mt-2 bg-indigo-100 text-indigo-800 border-indigo-200">
                Free forever • No credit card required
              </div>
            </div>

            <div className="space-y-6">
              {/* Error Alert */}
              {(error || authError) && (
                <div className="alert alert-error">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error || authError}</span>
                </div>
              )}

              {/* Social registration */}
              <div className="space-y-3">
                <button
                  className="btn btn-outline w-full border-slate-300 hover:border-indigo-300 hover:bg-indigo-50 bg-white text-slate-700 hover:text-indigo-700"
                  type="button"
                  disabled={loading}
                >
                  <Github className="h-5 w-5 mr-2" />
                  Sign up with GitHub
                </button>
                <button
                  className="btn btn-outline w-full border-slate-300 hover:border-indigo-300 hover:bg-indigo-50 bg-white text-slate-700 hover:text-indigo-700"
                  type="button"
                  disabled={loading}
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Sign up with Google
                </button>
              </div>

              <div className="divider text-xs uppercase text-slate-500">Or create account manually</div>

              {/* Registration form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm font-medium text-slate-700">Email address</span>
                  </label>
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

                {/* First Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm font-medium text-slate-700">First Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="input input-bordered border-slate-300 focus:border-indigo-500 bg-white w-full text-slate-900 placeholder-slate-400 disabled:bg-white disabled:text-slate-900 disabled:border-slate-300 disabled:opacity-70"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Last Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm font-medium text-slate-700">Last Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="input input-bordered border-slate-300 focus:border-indigo-500 bg-white w-full text-slate-900 placeholder-slate-400 disabled:bg-white disabled:text-slate-900 disabled:border-slate-300 disabled:opacity-70"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm font-medium text-slate-700">Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="input input-bordered border-slate-300 focus:border-indigo-500 pr-10 w-full bg-white text-slate-900 placeholder-slate-400 disabled:bg-white disabled:text-slate-900 disabled:border-slate-300 disabled:opacity-70"
                      required
                      disabled={loading}
                      minLength={6}
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

                {/* Confirm Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm font-medium text-slate-700">Confirm Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={`input input-bordered focus:border-indigo-500 pr-20 w-full bg-white text-slate-900 placeholder-slate-400 disabled:bg-white disabled:text-slate-900 disabled:opacity-70 ${
                        formData.confirmPassword.length > 0
                          ? passwordsMatch 
                            ? 'border-green-500 disabled:border-green-500' 
                            : 'border-red-500 disabled:border-red-500'
                          : 'border-slate-300 disabled:border-slate-300'
                      }`}
                      required
                      disabled={loading}
                    />
                    
                    {/* Password match indicator */}
                    {formData.confirmPassword.length > 0 && (
                      <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                        {passwordsMatch ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                    
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                  {/* Password match status text */}
                  {formData.confirmPassword.length > 0 && (
                    <label className="label">
                      <span className={`label-text-alt ${
                        passwordsMatch ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {passwordsMatch ? 'Passwords match!' : 'Passwords do not match'}
                      </span>
                    </label>
                  )}
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary mr-3"
                        checked={formData.agreeToTerms}
                        onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                        disabled={loading}
                      />
                      <span className="label-text text-sm text-slate-600">
                        I agree to the{" "}
                        <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary mr-3"
                        checked={formData.subscribeNewsletter}
                        onChange={(e) => handleInputChange("subscribeNewsletter", e.target.checked)}
                        disabled={loading}
                      />
                      <span className="label-text text-sm text-slate-600">
                        Send me developer tips, feature updates, and community highlights
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`btn btn-lg w-full border-none ${
                    formData.agreeToTerms && 
                    formData.email && 
                    formData.firstName && 
                    formData.lastName && 
                    formData.password.length >= 6 && 
                    (formData.confirmPassword.length === 0 || passwordsMatch) && 
                    !loading
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={
                    !formData.agreeToTerms || 
                    !formData.email || 
                    !formData.firstName || 
                    !formData.lastName || 
                    formData.password.length < 6 || 
                    (formData.confirmPassword.length > 0 && !passwordsMatch) ||
                    loading
                  }
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Create Account
                    </>
                  )}
                </button>
              </form>

              <div className="text-center">
                <span className="text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
                    Sign in
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>Join 10,000+ developers already building their careers on DevConnect Pro</p>
        </div>
      </div>
      </div>
    </>
  )
}

export default Register