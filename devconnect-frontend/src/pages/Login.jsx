import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Code2, Github, Mail, Eye, EyeOff, ArrowLeft, LogIn, User } from "lucide-react"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt:", formData)
  }

  return (
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
                      className="input input-bordered border-slate-300 focus:border-indigo-500 bg-white w-full pl-10"
                      required
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
                      className="input input-bordered border-slate-300 focus:border-indigo-500 pr-10 w-full bg-white"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
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
                  className="btn btn-lg w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
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
  )
}

export default Login
