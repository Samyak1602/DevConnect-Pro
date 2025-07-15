import React, { useState} from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  Code2,
  Search,
  Bell,
  MessageSquare,
  TrendingUp,
  Users,
  Star,
  GitFork,
  Plus,
  Calendar,
  Award,
  Eye,
  Heart,
  Share,
  Bookmark,
  LogOut,
  Settings,
  User,
} from "lucide-react"
import { selectAuth, selectAuthLoading } from "../features/auth/authSlice"
import { logoutUser } from "../features/auth/authService"
import toast, { Toaster } from 'react-hot-toast'

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectAuth)
  const loading = useSelector(selectAuthLoading)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      toast.success('Logged out successfully!')
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
      toast.error('Error logging out')
    }
  }

  const dashboardData = {
    user: {
      name: user.user ? `${user.user.firstName} ${user.user.lastName}` : "John Doe",
      avatar: user.user?.avatar || "/placeholder.svg",
      notifications: 5,
    },
  stats: {
    profileViews: 234,
    projectViews: 1456,
    newFollowers: 12,
    endorsements: 8,
  },
  feed: [
    {
      id: 1,
      type: "project",
      user: {
        name: "Sarah Chen",
        username: "sarahchen",
        avatar: "/placeholder.svg?height=40&width=40",
        title: "Frontend Developer",
      },
      content: {
        title: "React Dashboard Template",
        description: "A modern, responsive dashboard built with React and Tailwind CSS",
        image: "/placeholder.svg?height=200&width=300",
        technologies: ["React", "TypeScript", "Tailwind CSS"],
        stats: { stars: 89, forks: 23, views: 456 },
      },
      timestamp: "2 hours ago",
      interactions: { likes: 24, comments: 8, shares: 3 },
    },
    {
      id: 2,
      type: "endorsement",
      user: {
        name: "Mike Johnson",
        username: "mikej",
        avatar: "/placeholder.svg?height=40&width=40",
        title: "Senior Backend Developer",
      },
      content: {
        endorsedUser: "Alex Rodriguez",
        skill: "Node.js",
        message: "Alex has exceptional Node.js skills and delivered outstanding backend solutions.",
      },
      timestamp: "4 hours ago",
      interactions: { likes: 15, comments: 2 },
    },
    {
      id: 3,
      type: "achievement",
      user: {
        name: "Emma Wilson",
        username: "emmaw",
        avatar: "/placeholder.svg?height=40&width=40",
        title: "Full-Stack Developer",
      },
      content: {
        achievement: "Completed 100 GitHub contributions this month",
        badge: "Contributor",
      },
      timestamp: "6 hours ago",
      interactions: { likes: 42, comments: 12 },
    },
  ],
  suggestions: [
    {
      id: 1,
      name: "David Kim",
      username: "davidkim",
      title: "React Developer",
      company: "TechStart",
      avatar: "/placeholder.svg?height=50&width=50",
      mutualConnections: 5,
      skills: ["React", "JavaScript", "Node.js"],
    },
    {
      id: 2,
      name: "Lisa Zhang",
      username: "lisaz",
      title: "UI/UX Designer",
      company: "DesignCorp",
      avatar: "/placeholder.svg?height=50&width=50",
      mutualConnections: 3,
      skills: ["Figma", "Design Systems", "Prototyping"],
    },
  ],
  trendingProjects: [
    {
      id: 1,
      name: "AI Chat Interface",
      author: "Alex Chen",
      description: "Modern chat interface with AI integration",
      stars: 234,
      language: "TypeScript",
      trending: "+45 stars today",
    },
    {
      id: 2,
      name: "E-commerce Starter",
      author: "Maria Garcia",
      description: "Full-stack e-commerce template",
      stars: 189,
      language: "JavaScript",
      trending: "+32 stars today",
    },
  ],  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-indigo-600"></span>
          <p className="mt-4 text-slate-700">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <div className="navbar bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost text-xl text-slate-900">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            DevConnect Pro
          </Link>
        </div>
        
        <div className="navbar-center hidden lg:flex flex-1 max-w-lg">
          <div className="form-control w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search developers, projects, skills..." 
                className="input input-bordered w-full pl-10 border-slate-300 focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="navbar-end">
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle indicator text-slate-600">
                <Bell className="h-5 w-5" />
                {dashboardData.user.notifications > 0 && (
                  <span className="badge badge-sm bg-red-500 text-white indicator-item">
                    {dashboardData.user.notifications}
                  </span>
                )}
              </div>
            </div>

            {/* Messages */}
            <button className="btn btn-ghost btn-circle text-slate-600">
              <MessageSquare className="h-5 w-5" />
            </button>

            {/* User Menu */}
            <div className="dropdown dropdown-end">
              <div 
                tabIndex={0} 
                role="button" 
                className="btn btn-ghost btn-circle avatar"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-8 rounded-full">
                  <img alt={user.user ? `${user.user.firstName} ${user.user.lastName}` : "User"} src={user.user?.avatar || "/placeholder.svg"} />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow border border-slate-200">
                <li>
                  <Link to={`/profile/${user.user?.username}`} className="justify-between text-slate-700 hover:text-indigo-600">
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </span>
                  </Link>
                </li>
                <li>
                  <a className="flex items-center gap-2 text-slate-700 hover:text-indigo-600">
                    <Settings className="h-4 w-4" />
                    Settings
                  </a>
                </li>
                <li>
                  <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="card bg-white shadow-sm border border-slate-200">
              <div className="card-body">
                <h2 className="card-title text-lg text-slate-900">Your Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600">Profile views</span>
                    </div>
                    <span className="font-semibold text-slate-900">{dashboardData.stats.profileViews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600">Project views</span>
                    </div>
                    <span className="font-semibold text-slate-900">{dashboardData.stats.projectViews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600">New followers</span>
                    </div>
                    <span className="font-semibold text-slate-900">+{dashboardData.stats.newFollowers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600">Endorsements</span>
                    </div>
                    <span className="font-semibold text-slate-900">+{dashboardData.stats.endorsements}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* People You May Know */}
            <div className="card bg-white shadow-sm border border-slate-200">
              <div className="card-body">
                <h2 className="card-title text-lg text-slate-900">People You May Know</h2>
                <div className="space-y-4">
                  {dashboardData.suggestions.map((person) => (
                    <div key={person.id} className="flex items-start gap-3">
                      <div className="avatar">
                        <div className="w-12 rounded-full">
                          <img src={person.avatar || "/placeholder.svg"} alt={person.name} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-slate-900">{person.name}</p>
                        <p className="text-sm text-slate-600 truncate">{person.title}</p>
                        <p className="text-xs text-slate-500">{person.mutualConnections} mutual connections</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {person.skills.slice(0, 2).map((skill) => (
                            <div key={skill} className="badge badge-outline badge-xs border-slate-300 text-slate-600">
                              {skill}
                            </div>
                          ))}
                        </div>
                        <button className="btn btn-outline btn-sm mt-2 w-full border-indigo-300 text-indigo-600 hover:bg-indigo-50">
                          Connect
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <div className="card bg-white shadow-sm border border-slate-200">
              <div className="card-body p-4">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img src={user.user?.avatar || "/placeholder.svg"} alt={user.user ? `${user.user.firstName} ${user.user.lastName}` : "User"} />
                    </div>
                  </div>
                  <button className="btn btn-outline flex-1 justify-start text-slate-500 border-slate-300 hover:border-indigo-300">
                    Share your latest project or achievement...
                  </button>
                  <button className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none btn-circle">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Feed */}
            <div className="space-y-6">
              {dashboardData.feed.map((item) => (
                <div key={item.id} className="card bg-white shadow-sm border border-slate-200">
                  <div className="card-body">
                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img src={item.user.avatar || "/placeholder.svg"} alt={item.user.name} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/profile/${item.user.username}`}
                            className="font-medium text-slate-900 hover:text-indigo-600"
                          >
                            {item.user.name}
                          </Link>
                          <span className="text-slate-400">•</span>
                          <span className="text-sm text-slate-500">{item.timestamp}</span>
                        </div>
                        <p className="text-sm text-slate-600">{item.user.title}</p>
                      </div>
                    </div>

                    {/* Content */}
                    {item.type === "project" && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-slate-900">{item.content.title}</h3>
                        <p className="text-slate-700 mb-4">{item.content.description}</p>
                        {item.content.image && (
                          <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden mb-4">
                            <img
                              src={item.content.image || "/placeholder.svg"}
                              alt={item.content.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.content.technologies.map((tech) => (
                            <div key={tech} className="badge badge-outline border-slate-300 text-slate-600">
                              {tech}
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {item.content.stats.stars}
                          </div>
                          <div className="flex items-center gap-1">
                            <GitFork className="h-4 w-4" />
                            {item.content.stats.forks}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {item.content.stats.views}
                          </div>
                        </div>
                      </div>
                    )}

                    {item.type === "endorsement" && (
                      <div>
                        <p className="text-slate-700 mb-2">
                          Endorsed <span className="font-medium text-slate-900">{item.content.endorsedUser}</span> for{" "}
                          <span className="badge badge-outline border-indigo-300 text-indigo-600">{item.content.skill}</span>
                        </p>
                        <blockquote className="border-l-4 border-indigo-200 pl-4 italic text-slate-600">
                          "{item.content.message}"
                        </blockquote>
                      </div>
                    )}

                    {item.type === "achievement" && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-5 w-5 text-yellow-500" />
                          <span className="font-medium text-slate-900">Achievement Unlocked!</span>
                        </div>
                        <p className="text-slate-700">{item.content.achievement}</p>
                        <div className="badge bg-yellow-100 text-yellow-800 border-yellow-200 mt-2">{item.content.badge}</div>
                      </div>
                    )}

                    {/* Interactions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-6">
                        <button className="btn btn-ghost btn-sm text-slate-500 hover:text-red-500">
                          <Heart className="h-4 w-4 mr-1" />
                          {item.interactions.likes}
                        </button>
                        <button className="btn btn-ghost btn-sm text-slate-500 hover:text-indigo-600">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {item.interactions.comments}
                        </button>
                        <button className="btn btn-ghost btn-sm text-slate-500 hover:text-indigo-600">
                          <Share className="h-4 w-4 mr-1" />
                          {item.interactions.shares || 0}
                        </button>
                      </div>
                      <button className="btn btn-ghost btn-sm text-slate-500 hover:text-indigo-600">
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Trending Projects */}
            <div className="card bg-white shadow-sm border border-slate-200">
              <div className="card-body">
                <h2 className="card-title flex items-center text-lg text-slate-900">
                  <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
                  Trending Projects
                </h2>
                <div className="space-y-4">
                  {dashboardData.trendingProjects.map((project) => (
                    <div key={project.id} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link to="#" className="font-medium text-slate-900 hover:text-indigo-600">
                            {project.name}
                          </Link>
                          <p className="text-sm text-slate-600">by {project.author}</p>
                          <p className="text-xs text-slate-500 mt-1">{project.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <Star className="h-3 w-3" />
                          <span>{project.stars}</span>
                          <span>•</span>
                          <span>{project.language}</span>
                        </div>
                        <div className="badge badge-outline badge-xs border-slate-300 text-slate-600">
                          {project.trending}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card bg-white shadow-sm border border-slate-200">
              <div className="card-body">
                <h2 className="card-title text-lg text-slate-900">Quick Actions</h2>
                <div className="space-y-3">
                  <button className="btn btn-outline w-full justify-start border-slate-300 text-slate-700 hover:border-indigo-300 hover:text-indigo-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Project
                  </button>
                  <button className="btn btn-outline w-full justify-start border-slate-300 text-slate-700 hover:border-indigo-300 hover:text-indigo-600">
                    <Users className="h-4 w-4 mr-2" />
                    Find Developers
                  </button>
                  <button className="btn btn-outline w-full justify-start border-slate-300 text-slate-700 hover:border-indigo-300 hover:text-indigo-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </button>
                  <button className="btn btn-outline w-full justify-start border-slate-300 text-slate-700 hover:border-indigo-300 hover:text-indigo-600">
                    <Award className="h-4 w-4 mr-2" />
                    Give Endorsement
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}

export default Home
