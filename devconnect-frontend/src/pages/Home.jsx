import React, { useState, useEffect} from "react"
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
import { projectsAPI } from "../services/api"
import toast, { Toaster } from 'react-hot-toast'

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectAuth)
  const loading = useSelector(selectAuthLoading)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [projects, setProjects] = useState([])
  const [feedLoading, setFeedLoading] = useState(true)

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setFeedLoading(true)
        const response = await projectsAPI.getAllProjects({ 
          limit: 50, // Increase limit to show more projects
          page: 1 
        })
        console.log('Fetched projects response:', response)
        console.log('Projects data:', response.data)
        setProjects(response.data || [])
      } catch (error) {
        console.error('Error fetching projects:', error)
        toast.error('Failed to load projects')
      } finally {
        setFeedLoading(false)
      }
    }

    // Fetch projects regardless of user authentication status for public projects
    fetchProjects()
  }, [user.user])

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

  // Transform projects into feed format
  const transformProjectsToFeed = (projectsData) => {
    console.log('Transforming projects:', projectsData)
    console.log('Number of projects:', projectsData.length)
    
    const transformed = projectsData.map(project => {
      console.log('Processing project:', project)
      return {
        id: project._id,
        type: "project",
        user: {
          name: project.user ? `${project.user.firstName || ''} ${project.user.lastName || ''}`.trim() : 'Unknown User',
          username: project.user?.username || 'unknown',
          avatar: project.user?.avatar || "/placeholder.svg",
          title: project.user?.title || "Developer",
        },
        content: {
          title: project.title,
          description: project.description,
          image: project.coverImage,
          technologies: project.techStack || [],
          stats: { 
            stars: project.likes?.length || 0, 
            forks: 0, // Could be calculated from collaborators if needed
            views: project.views || 0 
          },
        },
        timestamp: project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Recently',
        interactions: { 
          likes: project.likes?.length || 0, 
          comments: 0, // Would need to implement comments
          shares: 0 
        },
      }
    })
    
    console.log('Transformed projects:', transformed)
    return transformed
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
  feed: transformProjectsToFeed(projects),
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
  trendingProjects: projects
    .filter(p => p.likes?.length > 0)
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 5)
    .map(project => ({
      id: project._id,
      name: project.title,
      author: project.user ? `${project.user.firstName || ''} ${project.user.lastName || ''}`.trim() : 'Unknown',
      description: project.description,
      stars: project.likes?.length || 0,
      language: project.techStack?.[0] || 'JavaScript',
      trending: `+${Math.floor(Math.random() * 50)} stars today`,
    })),
  }

  console.log('Dashboard data feed:', dashboardData.feed)
  console.log('Feed length:', dashboardData.feed.length)

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
          <Link to="/" className="btn btn-ghost text-xl text-slate-900 hover:bg-slate-100">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            DevConnect Pro
          </Link>
        </div>
        
        <div className="navbar-center hidden lg:flex flex-1 max-w-lg">
          <div className="form-control w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
              <input 
                type="text" 
                placeholder="Search developers, projects, skills..." 
                className="input input-bordered w-full pl-10 pr-4 border-slate-300 focus:border-indigo-500 focus:outline-none bg-white text-slate-900 relative z-20"
                value={searchQuery}
                onChange={(e) => {
                  console.log('Search input changed:', e.target.value)
                  setSearchQuery(e.target.value)
                }}
                onFocus={() => console.log('Search input focused')}
                onBlur={() => console.log('Search input blurred')}
                style={{ position: 'relative' }}
              />
            </div>
          </div>
        </div>

        <div className="navbar-end">
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle indicator text-slate-600 hover:bg-slate-100 hover:text-slate-700">
                <Bell className="h-5 w-5" />
                {dashboardData.user.notifications > 0 && (
                  <span className="badge badge-sm bg-red-500 text-white indicator-item">
                    {dashboardData.user.notifications}
                  </span>
                )}
              </div>
            </div>

            {/* Messages */}
            <button className="btn btn-ghost btn-circle text-slate-600 hover:bg-slate-100 hover:text-slate-700">
              <MessageSquare className="h-5 w-5" />
            </button>

            {/* User Menu */}
            <div className="dropdown dropdown-end">
              <div 
                tabIndex={0} 
                role="button" 
                className="btn btn-ghost btn-circle avatar hover:bg-slate-100"
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
              {feedLoading ? (
                <div className="text-center py-12">
                  <span className="loading loading-spinner loading-lg text-indigo-600"></span>
                  <p className="mt-4 text-slate-700">Loading projects...</p>
                </div>
              ) : dashboardData.feed.length > 0 ? (
                <>
                  <div className="text-sm text-slate-600 mb-4">
                    Showing {dashboardData.feed.length} project{dashboardData.feed.length !== 1 ? 's' : ''}
                  </div>
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

                        {/* ... rest of item types ... */}

                        {/* Interactions */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                          <div className="flex items-center gap-6">
                            <button className="btn btn-ghost btn-sm text-slate-500 hover:text-red-500 hover:bg-red-50">
                              <Heart className="h-4 w-4 mr-1" />
                              {item.interactions.likes}
                            </button>
                            <button className="btn btn-ghost btn-sm text-slate-500 hover:text-indigo-600 hover:bg-indigo-50">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              {item.interactions.comments}
                            </button>
                            <button className="btn btn-ghost btn-sm text-slate-500 hover:text-indigo-600 hover:bg-indigo-50">
                              <Share className="h-4 w-4 mr-1" />
                              {item.interactions.shares || 0}
                            </button>
                          </div>
                          <button className="btn btn-ghost btn-sm text-slate-500 hover:text-amber-600 hover:bg-amber-50">
                            <Bookmark className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Projects Yet</h3>
                  <p className="text-slate-600 mb-2">
                    {projects.length === 0 
                      ? "No projects have been created yet." 
                      : `Found ${projects.length} projects but none are visible in the feed.`
                    }
                  </p>
                  <p className="text-slate-600 mb-4">Be the first to share a project with the community!</p>
                  <Link to="/project/new" className="btn bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Project
                  </Link>
                  {/* Debug info */}
                  <div className="mt-4 text-xs text-slate-400">
                    <p>Debug: Raw projects: {projects.length}, Feed items: {dashboardData.feed.length}</p>
                  </div>
                </div>
              )}
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
                  {dashboardData.trendingProjects.length > 0 ? (
                    dashboardData.trendingProjects.map((project) => (
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
                  ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-slate-600">No trending projects yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card bg-white shadow-sm border border-slate-200">
              <div className="card-body">
                <h2 className="card-title text-lg text-slate-900">Quick Actions</h2>
                <div className="space-y-3">
                  <Link to="/project/new" className="btn btn-outline w-full justify-start border-slate-300 text-slate-700 hover:border-indigo-300 hover:text-indigo-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Project
                  </Link>
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
