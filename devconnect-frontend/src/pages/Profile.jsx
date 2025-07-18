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
  Plus,
  Eye,
} from "lucide-react"
import { selectUser } from "../features/auth/authSlice"
import { logoutUser } from "../features/auth/authService"
import { profileAPI } from "../services/api"
import toast, { Toaster } from 'react-hot-toast'

const Profile = () => {
  const { username } = useParams() // Get username from URL
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector(selectUser)
  
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [profileUser, setProfileUser] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [userProjects, setUserProjects] = useState([])
  const [userStats, setUserStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if viewing own profile
  const isOwnProfile = currentUser?.username === username
  
  // Debug logging
  useEffect(() => {
    console.log('Profile Debug:', {
      currentUser: currentUser?.username,
      username,
      isOwnProfile,
      userProjects: userProjects.length,
      userProjectsIds: userProjects.map(p => p._id)
    })
  }, [currentUser, username, isOwnProfile, userProjects])

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

  // Handle follow/unfollow user
  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error('Please login to follow users')
      navigate('/login')
      return
    }

    try {
      if (isFollowing) {
        await profileAPI.unfollowUser(username)
        setIsFollowing(false)
        toast.success('User unfollowed successfully')
      } else {
        await profileAPI.followUser(username)
        setIsFollowing(true)
        toast.success('User followed successfully')
      }
      
      // Refresh user stats to update follower count
      const statsData = await profileAPI.getUserStats(username)
      setUserStats(statsData.stats)
      
    } catch (err) {
      console.error('Follow/unfollow error:', err)
      toast.error(err.message || 'Failed to update follow status')
    }
  }

  // Fetch user profile, projects, and stats from backend
  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        // Fetch user profile
        const profileData = await profileAPI.getUserProfile(username)
        setProfileUser(profileData.user)
        
        // Fetch user projects (shows public projects for others, all projects for own profile)
        const projectsData = await profileAPI.getUserProjects(username)
        setUserProjects(projectsData.data || [])
        
        // Fetch user stats
        const statsData = await profileAPI.getUserStats(username)
        setUserStats(statsData.stats)
        
        // Check if current user is following this user
        if (!isOwnProfile && profileData.user) {
          setIsFollowing(profileData.user.isFollowedByCurrentUser || false)
        }
        
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError(err.message || 'Failed to load user profile')
        toast.error('Failed to load user profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [username, currentUser, isOwnProfile])

  // Skills data (this could also come from backend in future)
  const skills = [
    { name: "JavaScript", level: 95, endorsements: 23 },
    { name: "React", level: 92, endorsements: 19 },
    { name: "Node.js", level: 88, endorsements: 16 },
    { name: "TypeScript", level: 85, endorsements: 14 },
    { name: "Python", level: 78, endorsements: 12 },
    { name: "AWS", level: 75, endorsements: 10 },
  ]

  // Use default stats if userStats is not available
  const stats = userStats || {
    followers: 0,
    following: 0,
    projects: userProjects.length,
    contributions: 0,
    endorsements: 0,
    profileViews: 0,
  }

  // Projects now come from API via userProjects state
  // Only show projects on user's own profile
  /*
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
  */

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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error mb-4">Profile Not Found</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Go Home
          </button>
        </div>
      </div>
    )
  }

  // Check if profile needs updates (for showing prompts)
  const isProfileIncomplete = !profileUser?.bio || !profileUser?.title || !profileUser?.company

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Bar */}
      <div className="navbar bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200">
        <div className="navbar-start">
          <Link to="/home" className="btn btn-ghost text-xl text-slate-900 hover:text-indigo-600 hover:bg-slate-50">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            DevConnect Pro
          </Link>
        </div>
        
        {/* Search removed as requested */}

        <div className="navbar-end">
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-circle text-slate-600 hover:text-slate-700 hover:bg-slate-100">
              <Bell className="h-5 w-5" />
            </button>
            <button className="btn btn-ghost btn-circle text-slate-600 hover:text-slate-700 hover:bg-slate-100">
              <MessageSquare className="h-5 w-5" />
            </button>
            <button className="btn btn-ghost btn-circle text-slate-600 hover:text-slate-700 hover:bg-slate-100">
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
                  <Link to={`/profile/${currentUser?.username}`} className="justify-between text-slate-700 hover:text-indigo-600 hover:bg-slate-50">
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      My Profile
                    </span>
                  </Link>
                </li>
                <li>
                  <a className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-50">
                    <Settings className="h-4 w-4" />
                    Settings
                  </a>
                </li>
                <li>
                  <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
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
        {/* Profile Completion Banner - Only show on own profile if incomplete */}
        {isOwnProfile && isProfileIncomplete && (
          <div className="card bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 mb-6">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Complete your profile</h3>
                    <p className="text-sm text-slate-600">
                      Add more details to help others discover and connect with you
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/profile/edit')}
                  className="btn bg-indigo-600 hover:bg-indigo-700 text-white btn-sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Update Profile
                </button>
              </div>
              {/* Progress indicators */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className={`flex items-center gap-2 ${profileUser?.bio ? 'text-green-600' : 'text-slate-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${profileUser?.bio ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  Add bio {profileUser?.bio && '✓'}
                </div>
                <div className={`flex items-center gap-2 ${profileUser?.title ? 'text-green-600' : 'text-slate-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${profileUser?.title ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  Add job title {profileUser?.title && '✓'}
                </div>
                <div className={`flex items-center gap-2 ${profileUser?.company ? 'text-green-600' : 'text-slate-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${profileUser?.company ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  Add company {profileUser?.company && '✓'}
                </div>
              </div>
            </div>
          </div>
        )}

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
                    {user.title ? (
                      <p className="text-xl text-slate-600 mt-1">{user.title}</p>
                    ) : isOwnProfile ? (
                      <p className="text-xl text-slate-400 mt-1 italic">Add your job title</p>
                    ) : (
                      <p className="text-xl text-slate-400 mt-1 italic">No title added</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      {user.company ? (
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {user.company}
                        </div>
                      ) : isOwnProfile ? (
                        <div className="flex items-center gap-1 text-slate-400">
                          <Briefcase className="h-4 w-4" />
                          <span className="italic">Add company</span>
                        </div>
                      ) : null}
                      {user.location ? (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {typeof user.location === 'object' && user.location ? 
                            `${user.location.city || ''} ${user.location.state || ''} ${user.location.country || ''}`.trim() || 'Location not specified' :
                            user.location || 'Location not specified'
                          }
                        </div>
                      ) : isOwnProfile ? (
                        <div className="flex items-center gap-1 text-slate-400">
                          <MapPin className="h-4 w-4" />
                          <span className="italic">Add location</span>
                        </div>
                      ) : null}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Joined {user.joinDate || 'recently'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 sm:mt-0">
                    {isOwnProfile ? (
                      <button 
                        onClick={() => navigate('/profile/edit')}
                        className="btn bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </button>
                    ) : (
                      <>
                        <button
                          className={`btn ${isFollowing ? 'btn-outline border-slate-300' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                          onClick={handleFollowToggle}
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
                {user.bio ? (
                  <p className="text-slate-700 mt-4 leading-relaxed">{user.bio}</p>
                ) : isOwnProfile ? (
                  <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-slate-400 italic text-sm mb-2">Tell others about yourself</p>
                    <button 
                      onClick={() => navigate('/profile/edit')}
                      className="text-indigo-600 text-sm hover:text-indigo-700 font-medium"
                    >
                      Add bio
                    </button>
                  </div>
                ) : (
                  <p className="text-slate-400 mt-4 italic text-sm">No bio added yet</p>
                )}

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
                  
                  {/* Show prompt to add social links if none exist and it's own profile */}
                  {isOwnProfile && !user.website && !user.github && !user.linkedin && !user.twitter && (
                    <button 
                      onClick={() => navigate('/profile/edit')}
                      className="flex items-center text-slate-400 hover:text-indigo-600 transition-colors text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add social links
                    </button>
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
              <div className="bg-gray-100 rounded-lg p-1 mb-6 flex">
                <button 
                  className={`flex-1 text-center py-2 px-4 rounded-md font-medium transition-all ${
                    activeTab === 'overview' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button 
                  className={`flex-1 text-center py-2 px-4 rounded-md font-medium transition-all ${
                    activeTab === 'projects' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveTab('projects')}
                >
                  Projects
                </button>
                <button 
                  className={`flex-1 text-center py-2 px-4 rounded-md font-medium transition-all ${
                    activeTab === 'experience' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
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
                      {isOwnProfile ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {userProjects
                            .filter((p) => p.featured)
                            .map((project) => (
                              <div key={project._id} className="card bg-white border border-slate-200">
                                <div className="aspect-video bg-slate-100 rounded-t-lg overflow-hidden">
                                  <img
                                    src={project.coverImage || "/placeholder.svg"}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="card-body p-4">
                                  <h3 className="font-semibold text-slate-900 mb-2">{project.title}</h3>
                                  <p className="text-sm text-slate-600 mb-3">{project.description}</p>
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {project.techStack?.map((tech) => (
                                      <div key={tech} className="badge badge-outline border-slate-300 text-slate-600 text-xs">
                                        {tech}
                                      </div>
                                    )) || []}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                      <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4" />
                                        {project.likes?.length || 0}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        {project.views || 0}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {project.liveUrl && (
                                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm hover:bg-slate-100">
                                          <ExternalLink className="h-4 w-4" />
                                        </a>
                                      )}
                                      {project.githubUrl && (
                                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm hover:bg-slate-100">
                                          <Github className="h-4 w-4" />
                                        </a>
                                      )}
                                      {isOwnProfile && (
                                        <button 
                                          onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            console.log('Edit button clicked for project:', project._id)
                                            console.log('isOwnProfile:', isOwnProfile)
                                            console.log('Navigate function:', typeof navigate)
                                            navigate(`/project/edit/${project._id}`)
                                          }}
                                          className="btn btn-primary btn-sm text-white"
                                          title="Edit Project"
                                          type="button"
                                        >
                                          <Edit className="h-4 w-4" />
                                          Edit
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-slate-600">No featured projects yet</p>
                        </div>
                      )}
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
                  {userProjects.length > 0 ? (
                    userProjects.map((project) => (
                      <div key={project._id} className="card bg-white shadow-sm border border-slate-200">
                        <div className="card-body p-6">
                          <div className="flex flex-col md:flex-row md:gap-6">
                            <div className="md:w-1/3 mb-4 md:mb-0">
                              <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                                <img
                                  src={project.coverImage || "/placeholder.svg"}
                                  alt={project.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <div className="md:w-2/3">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-xl font-semibold text-slate-900">{project.title}</h3>
                                {project.featured && (
                                  <div className="badge bg-indigo-100 text-indigo-800 border-indigo-200">Featured</div>
                                )}
                              </div>
                              <p className="text-slate-600 mb-4">{project.description}</p>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {project.techStack?.map((tech) => (
                                  <div key={tech} className="badge badge-outline border-slate-300 text-slate-600">
                                    {tech}
                                  </div>
                                )) || []}
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6 text-sm text-slate-500">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4" />
                                    {project.likes?.length || 0} likes
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    {project.views || 0} views
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {project.liveUrl && (
                                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm border-slate-300 hover:bg-slate-50 hover:border-slate-400">
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      Live Demo
                                    </a>
                                  )}
                                  {project.githubUrl && (
                                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm border-slate-300 hover:bg-slate-50 hover:border-slate-400">
                                      <Github className="h-4 w-4 mr-2" />
                                      Code
                                    </a>
                                  )}
                                  {isOwnProfile && (
                                    <button 
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        console.log('Edit button clicked for project:', project._id)
                                        console.log('isOwnProfile:', isOwnProfile)
                                        console.log('Navigate function:', typeof navigate)
                                        navigate(`/project/edit/${project._id}`)
                                      }}
                                      className="btn btn-primary btn-sm text-white"
                                      title="Edit Project"
                                      type="button"
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No Projects Found</h3>
                      <p className="text-slate-600">No projects have been created yet.</p>
                    </div>
                  )}
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
                              <span>
                                {typeof exp.location === 'object' && exp.location ? 
                                  `${exp.location.city || ''} ${exp.location.state || ''} ${exp.location.country || ''}`.trim() || 'Location not specified' :
                                  exp.location || 'Location not specified'
                                }
                              </span>
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
