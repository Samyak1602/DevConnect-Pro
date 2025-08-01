import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  Code2,
  Users,
  MessageSquare,
  BarChart3,
  Github,
  Star,
  Zap,
  Menu,
  X,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react"

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: <Code2 className="h-8 w-8 text-indigo-600" />,
      title: "Portfolio Showcase",
      description:
        "Seamlessly integrate your GitHub repositories, display your best projects, and let your code speak for itself with automated project insights.",
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "Skill Endorsements",
      description:
        "Get validated by your peers with skill endorsements and testimonials. Build credibility in your tech stack and showcase your expertise.",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-indigo-600" />,
      title: "Real-time Collaboration",
      description:
        "Connect instantly with developers worldwide. Share ideas, get code reviews, and collaborate on projects with built-in messaging tools.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-indigo-600" />,
      title: "Analytics Dashboard",
      description:
        "Track your profile views, project engagement, and network growth with detailed analytics tailored for developers and recruiters.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="navbar sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">DevConnect Pro</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#" className="text-slate-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">Home</a>
                <a href="#features" className="text-slate-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">Features</a>
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">Login</Link>
                <Link to="/register" className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 text-white border-none">Register</Link>
              </div>
            </div>
            <div className="md:hidden">
              <button className="btn btn-ghost btn-square" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-200">
                <a href="#" className="text-slate-900 hover:text-indigo-600 block px-3 py-2 text-base font-medium">Home</a>
                <a href="#features" className="text-slate-600 hover:text-indigo-600 block px-3 py-2 text-base font-medium">Features</a>
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 block px-3 py-2 text-base font-medium">Login</Link>
                <div className="px-3 py-2">
                  <Link to="/register" className="btn btn-primary w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none">Register</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero relative overflow-hidden bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <div className="max-w-none">
            <div className="badge badge-lg mb-6 bg-indigo-100 text-indigo-800 border-indigo-200">
              <Zap className="h-3 w-3 mr-1" />
              Now in Beta - Join 10,000+ Developers
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6">
              Your Developer Identity. <span className="text-indigo-600">Supercharged.</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Build your portfolio. Get skill endorsements. Connect with developers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register" className="btn btn-primary btn-lg bg-indigo-600 hover:bg-indigo-700 text-white border-none px-8">
                Get Started
                <Code2 className="ml-2 h-5 w-5" />
              </Link>
              <button className="btn btn-outline btn-lg px-8 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white hover:border-slate-800 bg-white shadow-md">
                <Github className="mr-2 h-5 w-5" />
                Connect GitHub
              </button>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span>4.9/5 Developer Rating</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-300"></div>
              <div>Free to start, always</div>
              <div className="hidden sm:block w-px h-4 bg-slate-300"></div>
              <div>No credit card required</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to showcase your developer journey
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From portfolio management to peer networking, DevConnect Pro provides the tools modern developers need to grow their careers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card bg-white border border-slate-200 hover:border-indigo-300 transition-colors duration-300 hover:shadow-lg">
                <div className="card-body">
                  <div className="mb-4">{feature.icon}</div>
                  <h2 className="card-title text-xl font-semibold text-slate-900">{feature.title}</h2>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <button className="btn btn-outline btn-lg border-indigo-300 text-indigo-600 hover:bg-indigo-50">
              View All Features
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 sm:py-32 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Start building your DevConnect profile today
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already showcasing their skills, building their network, and advancing
            their careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" className="btn btn-primary btn-lg bg-indigo-600 hover:bg-indigo-700 text-white border-none px-8">
              Sign Up Free
            </Link>
            <button className="btn btn-outline btn-lg border-slate-600 text-slate-300 hover:bg-slate-800 px-8">
              Schedule Demo
            </button>
          </div>
          <p className="text-sm text-slate-400 mt-6">30-day free trial • No setup fees • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-white border-t border-slate-200 p-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Code2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">DevConnect Pro</span>
              </div>
              <p className="text-slate-600 mb-6 max-w-md">
                The professional network built by developers, for developers. Showcase your work, connect with peers,
                and grow your career.
              </p>
              <div className="flex space-x-4">
                <button className="btn btn-ghost btn-square text-slate-400 hover:text-indigo-600">
                  <Twitter className="h-5 w-5" />
                </button>
                <button className="btn btn-ghost btn-square text-slate-400 hover:text-indigo-600">
                  <Linkedin className="h-5 w-5" />
                </button>
                <button className="btn btn-ghost btn-square text-slate-400 hover:text-indigo-600">
                  <Github className="h-5 w-5" />
                </button>
                <button className="btn btn-ghost btn-square text-slate-400 hover:text-indigo-600">
                  <Instagram className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Platform</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">
                    API Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm">© 2025 DevConnect Pro. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
