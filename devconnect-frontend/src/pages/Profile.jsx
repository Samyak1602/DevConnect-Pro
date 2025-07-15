import React, { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  Code2,
  Github,
  Linkedin,
  Twitter,
  Globe,
  MapPin,
  Calendar,
  Star,
  GitFork,
  MessageSquare,
  Award,
  Briefcase,
  ExternalLink,
  Edit,
  Share,
  MoreHorizontal,
  Zap,
  TrendingUp,
  ArrowLeft,
  Bell,
  Search,
  Settings,
  User,
  LogOut,
} from "lucide-react"
import { selectUser, selectAuthLoading } from "../features/auth/authSlice"
import { logoutUser } from "../features/auth/authService"
import toast, { Toaster } from 'react-hot-toast'

const Profile = () => {
  const { username } = useParams() // Get username from URL
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector(selectUser)
  const loading = useSelector(selectAuthLoading)
  
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [profileUser, setProfileUser] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Check if viewing own profile
  const isOwnProfile = currentUser?.username === username

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

  // Mock function to fetch user profile data
  // In real app, this would be an API call
  useEffect(() => {
    const fetchUserProfile = async () => {
      // Simulate API call
      const mockUserData = {
        id: username,
        firstName: username === currentUser?.username ? currentUser.username : "John",
        lastName: username === currentUser?.username ? "" : "Doe", 
        username: username,
        title: "Senior Full-Stack Developer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        joinDate: "March 2023",
        avatar: currentUser?.avatar || "/placeholder.svg",
        coverImage: "/placeholder.svg?height=200&width=800",
        bio: "Passionate full-stack developer with 5+ years of experience building scalable web applications. I love working with React, Node.js, and cloud technologies.",
        email: `${username}@example.com`,
        website: `https://${username}.dev`,
        github: username,
        linkedin: username,
        twitter: username,
      }
      setProfileUser(mockUserData)
    }

    if (username) {
      fetchUserProfile()
    }
  }, [username, currentUser])

  // Mock data that would normally come from API
  const stats = {
    followers: 1247,
    following: 892,
    projects: 24,
    contributions: 1456,
    endorsements: 89,
    profileViews: 3421,
  }

  const skills = [
    { name: "JavaScript", level: 95, endorsements: 23 },
    { name: "React", level: 92, endorsements: 19 },
    { name: "Node.js", level: 88, endorsements: 16 },
    { name: "TypeScript", level: 85, endorsements: 14 },
    { name: "Python", level: 78, endorsements: 12 },
    { name: "AWS", level: 75, endorsements: 10 },
  ]

  const projects = [
    {
      id: 1,
      name: "E-commerce Platform",
      description: "A full-stack e-commerce solution built with React, Node.js, and PostgreSQL",
      image: "/placeholder.svg?height=200&width=300",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      stars: 234,
      forks: 45,
      liveUrl: "https://demo.example.com",
      githubUrl: "https://github.com/johndoe/ecommerce",
      featured: true,
    },
    {
      id: 2,
      name: "Task Management App",
      description: "A collaborative task management application with real-time updates",
      image: "/placeholder.svg?height=200&width=300",
      technologies: ["Vue.js", "Express", "Socket.io", "MongoDB"],
      stars: 156,
      forks: 28,
      liveUrl: "https://tasks.example.com",
      githubUrl: "https://github.com/johndoe/task-app",
      featured: true,
    },
  ]

  const experience = [
    {
      id: 1,
      title: "Senior Full-Stack Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      startDate: "Jan 2022",
      endDate: "Present",
      description: "Lead development of microservices architecture, mentor junior developers, and collaborate with product teams.",
      technologies: ["React", "Node.js", "AWS", "Docker"],
    },
  ]

  const endorsements = [
    {
      id: 1,
      endorser: {
        name: "Sarah Johnson",
        title: "Product Manager",
        company: "TechCorp Inc.",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      skill: "React",
      message: "John is an exceptional React developer with deep understanding of modern patterns and best practices.",
      date: "2 days ago",
    },
  ]

  // Use profileUser data or fallback to mock data
  const user = profileUser || {
    firstName: "Loading",
    lastName: "...",
    username: username,
    title: "Developer",
    company: "Loading...",
    location: "Loading...",
    joinDate: "Loading...",
    avatar: "/placeholder.svg",
    bio: "Loading profile...",
    website: "",
    github: "",
    linkedin: "",
    twitter: "",
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-indigo-600"></span>
          <p className="mt-4 text-slate-700">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Bar */}
      <div className="navbar bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200">
        <div className="navbar-start">
          <Link to="/home" className="btn btn-ghost text-xl text-slate-900">
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
              />
            </div>
          </div>
        </div>

        <div className="navbar-end">
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-circle text-slate-600">
              <Bell className="h-5 w-5" />
            </button>
            <button className="btn btn-ghost btn-circle text-slate-600">
              <MessageSquare className="h-5 w-5" />
            </button>
            <button className="btn btn-ghost btn-circle text-slate-600">
              <Share className="h-5 w-5" />
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
                  <img alt={currentUser?.username || "User"} src={currentUser?.avatar || "/placeholder.svg"} />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow border border-slate-200">
                <li>
                  <Link to="/profile" className="justify-between text-slate-700 hover:text-indigo-600">
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      My Profile
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
        {/* Profile Header */}
        <div className="card bg-white shadow-sm border border-slate-200 mb-8 overflow-hidden">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            <img
              src={user.coverImage || "/placeholder.svg"}
              alt="Cover"
              className="w-full h-full object-cover opacity-20"
            />
          </div>

          <div className="card-body relative px-6 pb-6">
            {/* Avatar */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6 -mt-16 relative z-10">
              <div className="avatar">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg">
                  <img src={user.avatar || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
                </div>
              </div>

              <div className="flex-1 mt-4 sm:mt-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-xl text-slate-600 mt-1">{user.title}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {user.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {user.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Joined {user.joinDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 sm:mt-0">
                    {isOwnProfile ? (
                      <button className="btn bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </button>
                    ) : (
                      <>
                        <button
                          className={`btn ${isFollowing ? 'btn-outline border-slate-300' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                          onClick={() => setIsFollowing(!isFollowing)}
                        >
                          {isFollowing ? "Following" : "Follow"}
                        </button>
                        <button className="btn btn-outline border-slate-300 text-slate-700">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <p className="text-slate-700 mt-4 leading-relaxed">{user.bio}</p>

                {/* Social Links */}
                <div className="flex items-center gap-4 mt-4">
                  {user.website && (
                    <Link
                      to={user.website}
                      className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      Website
                    </Link>
                  )}
                  {user.github && (
                    <Link
                      to={`https://github.com/${user.github}`}
                      className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                      <Github className="h-4 w-4 mr-1" />
                      GitHub
                    </Link>
                  )}
                  {user.linkedin && (
                    <Link
                      to={`https://linkedin.com/in/${user.linkedin}`}
                      className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                      <Linkedin className="h-4 w-4 mr-1" />
                      LinkedIn
                    </Link>
                  )}
                  {user.twitter && (
                    <Link
                      to={`https://twitter.com/${user.twitter}`}
                      className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                      <Twitter className="h-4 w-4 mr-1" />
                      Twitter
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="card bg-white shadow-sm border border-slate-200 text-center">
            <div className="card-body p-4">
              <div className="text-2xl font-bold text-slate-900">{stats.followers.toLocaleString()}</div>
              <div className="text-sm text-slate-600">Followers</div>
            </div>
          </div>
          <div className="card bg-white shadow-sm border border-slate-200 text-center">
            <div className="card-body p-4">
              <div className="text-2xl font-bold text-slate-900">{stats.following.toLocaleString()}</div>
              <div className="text-sm text-slate-600">Following</div>
            </div>
          </div>
          <div className="card bg-white shadow-sm border border-slate-200 text-center">
            <div className="card-body p-4">
              <div className="text-2xl font-bold text-slate-900">{stats.projects}</div>
              <div className="text-sm text-slate-600">Projects</div>
            </div>
          </div>
          <div className="card bg-white shadow-sm border border-slate-200 text-center">
            <div className="card-body p-4">
              <div className="text-2xl font-bold text-slate-900">{stats.contributions.toLocaleString()}</div>
              <div className="text-sm text-slate-600">Contributions</div>
            </div>
          </div>
          <div className="card bg-white shadow-sm border border-slate-200 text-center">
            <div className="card-body p-4">
              <div className="text-2xl font-bold text-slate-900">{stats.endorsements}</div>
              <div className="text-sm text-slate-600">Endorsements</div>
            </div>
          </div>
          <div className="card bg-white shadow-sm border border-slate-200 text-center">
            <div className="card-body p-4">
              <div className="text-2xl font-bold text-slate-900">{stats.profileViews.toLocaleString()}</div>
              <div className="text-sm text-slate-600">Profile Views</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Skills & Endorsements */}
          <div className="space-y-6">
            {/* Skills */}
            <div className="card bg-white shadow-sm border border-slate-200">
              <div className="card-body">
                <h2 className="card-title flex items-center text-slate-900">
                  <Zap className="h-5 w-5 mr-2 text-indigo-600" />
                  Skills & Expertise
                </h2>
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-slate-900">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="badge badge-outline border-slate-300 text-slate-600 text-xs">
                            {skill.endorsements} endorsements
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Endorsements */}
            <div className="card bg-white shadow-sm border border-slate-200">
              <div className="card-body">
                <h2 className="card-title flex items-center text-slate-900">
                  <Award className="h-5 w-5 mr-2 text-indigo-600" />
                  Recent Endorsements
                </h2>
                <div className="space-y-4">
                  {endorsements.map((endorsement) => (
                    <div key={endorsement.id} className="border-b border-slate-100 last:border-b-0 pb-4 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className="avatar">
                          <div className="w-10 rounded-full">
                            <img
                              src={endorsement.endorser.avatar || "/placeholder.svg"}
                              alt={endorsement.endorser.name}
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-slate-900">{endorsement.endorser.name}</span>
                            <div className="badge badge-outline border-slate-300 text-slate-600 text-xs">
                              {endorsement.skill}
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 mb-1">
                            {endorsement.endorser.title} at {endorsement.endorser.company}
                          </p>
                          <p className="text-sm text-slate-700 italic">"{endorsement.message}"</p>
                          <p className="text-xs text-slate-500 mt-2">{endorsement.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Projects & Experience */}
          <div className="lg:col-span-2">
            <div className="w-full">
              {/* Tabs */}
              <div className="tabs tabs-boxed bg-white border border-slate-200 mb-6">
                <button 
                  className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button 
                  className={`tab ${activeTab === 'projects' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('projects')}
                >
                  Projects
                </button>
                <button 
                  className={`tab ${activeTab === 'experience' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('experience')}
                >
                  Experience
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Featured Projects */}
                  <div className="card bg-white shadow-sm border border-slate-200">
                    <div className="card-body">
                      <h2 className="card-title flex items-center text-slate-900">
                        <Star className="h-5 w-5 mr-2 text-indigo-600" />
                        Featured Projects
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects
                          .filter((p) => p.featured)
                          .map((project) => (
                            <div key={project.id} className="card bg-white border border-slate-200">
                              <div className="aspect-video bg-slate-100 rounded-t-lg overflow-hidden">
                                <img
                                  src={project.image || "/placeholder.svg"}
                                  alt={project.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="card-body p-4">
                                <h3 className="font-semibold text-slate-900 mb-2">{project.name}</h3>
                                <p className="text-sm text-slate-600 mb-3">{project.description}</p>
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {project.technologies.map((tech) => (
                                    <div key={tech} className="badge badge-outline border-slate-300 text-slate-600 text-xs">
                                      {tech}
                                    </div>
                                  ))}
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4" />
                                      {project.stars}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <GitFork className="h-4 w-4" />
                                      {project.forks}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Link to={project.liveUrl} className="btn btn-ghost btn-sm">
                                      <ExternalLink className="h-4 w-4" />
                                    </Link>
                                    <Link to={project.githubUrl} className="btn btn-ghost btn-sm">
                                      <Github className="h-4 w-4" />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="card bg-white shadow-sm border border-slate-200">
                    <div className="card-body">
                      <h2 className="card-title flex items-center text-slate-900">
                        <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
                        Recent Activity
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-slate-600">Pushed 3 commits to</span>
                          <Link to="#" className="text-indigo-600 hover:underline">
                            E-commerce Platform
                          </Link>
                          <span className="text-slate-500">2 hours ago</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-slate-600">Received endorsement for React from</span>
                          <Link to="#" className="text-indigo-600 hover:underline">
                            Sarah Johnson
                          </Link>
                          <span className="text-slate-500">1 day ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-6">
                  {projects.map((project) => (
                    <div key={project.id} className="card bg-white shadow-sm border border-slate-200">
                      <div className="card-body p-6">
                        <div className="flex flex-col md:flex-row md:gap-6">
                          <div className="md:w-1/3 mb-4 md:mb-0">
                            <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                              <img
                                src={project.image || "/placeholder.svg"}
                                alt={project.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="md:w-2/3">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-xl font-semibold text-slate-900">{project.name}</h3>
                              {project.featured && (
                                <div className="badge bg-indigo-100 text-indigo-800 border-indigo-200">Featured</div>
                              )}
                            </div>
                            <p className="text-slate-600 mb-4">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.technologies.map((tech) => (
                                <div key={tech} className="badge badge-outline border-slate-300 text-slate-600">
                                  {tech}
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-6 text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4" />
                                  {project.stars} stars
                                </div>
                                <div className="flex items-center gap-1">
                                  <GitFork className="h-4 w-4" />
                                  {project.forks} forks
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Link to={project.liveUrl} className="btn btn-outline btn-sm border-slate-300">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Live Demo
                                </Link>
                                <Link to={project.githubUrl} className="btn btn-outline btn-sm border-slate-300">
                                  <Github className="h-4 w-4 mr-2" />
                                  Code
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="space-y-6">
                  {experience.map((exp) => (
                    <div key={exp.id} className="card bg-white shadow-sm border border-slate-200">
                      <div className="card-body p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Briefcase className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-slate-900">{exp.title}</h3>
                            <p className="text-indigo-600 font-medium">{exp.company}</p>
                            <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                              <span>{exp.location}</span>
                              <span>•</span>
                              <span>
                                {exp.startDate} - {exp.endDate}
                              </span>
                            </div>
                            <p className="text-slate-700 mt-3 leading-relaxed">{exp.description}</p>
                            <div className="flex flex-wrap gap-2 mt-4">
                              {exp.technologies.map((tech) => (
                                <div key={tech} className="badge badge-outline border-slate-300 text-slate-600">
                                  {tech}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}

export default Profile
