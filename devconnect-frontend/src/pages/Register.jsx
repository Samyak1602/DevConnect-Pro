import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Code2, Github, Mail, Eye, EyeOff, ArrowLeft, Check, User } from "lucide-react"

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle registration logic here
    console.log("Registration attempt:", formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
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
              <h2 className="card-title text-2xl font-bold text-slate-900 justify-center">Join DevConnect Pro</h2>
              <p className="text-slate-600 mt-2">
                Create your developer profile and start connecting
              </p>
              <div className="badge badge-lg mt-2 bg-indigo-100 text-indigo-800 border-indigo-200">
                Free forever • No credit card required
              </div>
            </div>

            <div className="space-y-6">
              {/* Social Registration */}
              <div className="space-y-3">
                <button
                  className="btn btn-outline w-full border-slate-300 hover:border-indigo-300 hover:bg-indigo-50 bg-white text-slate-700 hover:text-indigo-700"
                  type="button"
                >
                  <Github className="h-5 w-5 mr-2" />
                  Sign up with GitHub
                </button>
                <button
                  className="btn btn-outline w-full border-slate-300 hover:border-indigo-300 hover:bg-indigo-50 bg-white text-slate-700 hover:text-indigo-700"
                  type="button"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Sign up with Google
                </button>
              </div>

              <div className="divider text-xs uppercase text-slate-500">Or create account manually</div>

              {/* Registration Form */}
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
                    className="input input-bordered border-slate-300 focus:border-indigo-500 bg-white w-full"
                    required
                  />
                </div>

                {/* Username */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm font-medium text-slate-700">Username</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className="input input-bordered border-slate-300 focus:border-indigo-500 pl-10 w-full bg-white"
                      required
                    />
                  </div>
                  <label className="label">
                    <span className="label-text-alt text-slate-500">This will be your DevConnect Pro profile URL</span>
                  </label>
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
                      className="input input-bordered border-slate-300 focus:border-indigo-500 pr-10 w-full bg-white"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                  </div>
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
                    formData.agreeToTerms 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!formData.agreeToTerms}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Create Account
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
  )
}

export default Register
