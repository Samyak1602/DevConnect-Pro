import {
  Code2,
  Upload,
  X,
  Plus,
  Save,
  Eye,
  Github,
  ExternalLink,
  ImageIcon,
  Video,
  FileText,
  Tag,
  Globe,
  Trash2,
  Camera,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { selectUser, selectIsAuthenticated } from "../features/auth/authSlice"
import { projectsAPI, uploadAPI } from "../services/api"
import toast from 'react-hot-toast'

const projectCategories = [
  "Web Application",
  "Mobile App",
  "Desktop Application",
  "API/Backend",
  "Library/Framework",
  "Tool/Utility",
  "Game",
  "AI/ML Project",
  "Data Science",
  "DevOps/Infrastructure",
  "Design System",
  "Other",
]

const projectStatus = ["In Development", "Completed", "Maintenance", "Archived", "Planning"]

const techStack = [
  // Frontend
  "React",
  "Vue.js",
  "Angular",
  "Svelte",
  "Next.js",
  "Nuxt.js",
  "TypeScript",
  "JavaScript",
  // Backend
  "Node.js",
  "Python",
  "Java",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  // Databases
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "SQLite",
  "Firebase",
  // Cloud/DevOps
  "AWS",
  "Google Cloud",
  "Azure",
  "Docker",
  "Kubernetes",
  "Vercel",
  "Netlify",
  // Mobile
  "React Native",
  "Flutter",
  "Swift",
  "Kotlin",
  "Ionic",
  // Other
  "GraphQL",
  "REST API",
  "Socket.io",
  "Tailwind CSS",
  "Bootstrap",
  "Material-UI",
]

const initialProjectData = {
  basic: {
    title: "",
    description: "",
    category: "",
    status: "In Development",
    tags: [],
    featured: false,
  },
  details: {
    longDescription: "",
    features: [],
    challenges: "",
    learnings: "",
    futureEnhancements: "",
  },
  technical: {
    technologies: [],
    architecture: "",
    deployment: "",
    database: "",
    apiDocumentation: "",
  },
  links: {
    liveUrl: "",
    githubUrl: "",
    documentationUrl: "",
    additionalLinks: [],
  },
  media: {
    screenshots: [],
    videos: [],
    logo: "",
    coverImage: "",
    coverImageFile: null,
  },
  collaboration: {
    isOpenSource: true,
    acceptingContributions: false,
    collaborators: [],
    license: "MIT",
  },
  visibility: {
    isPublic: true,
    showInPortfolio: true,
    allowComments: true,
  },
}

export default function ProjectEdit() {
  const navigate = useNavigate()
  const currentUser = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const [projectData, setProjectData] = useState(initialProjectData)
  const [activeTab, setActiveTab] = useState("basic")
  const [newTag, setNewTag] = useState("")
  const [newTech, setNewTech] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [newLink, setNewLink] = useState({ title: "", url: "" })
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [coverImagePreview, setCoverImagePreview] = useState("")

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to create a project')
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  // Cleanup effect for object URLs
  useEffect(() => {
    return () => {
      if (coverImagePreview) {
        URL.revokeObjectURL(coverImagePreview)
      }
    }
  }, [coverImagePreview])

  const updateBasicInfo = (field, value) => {
    setProjectData((prev) => ({
      ...prev,
      basic: { ...prev.basic, [field]: value },
    }))
    setHasUnsavedChanges(true)
  }

  const updateDetails = (field, value) => {
    setProjectData((prev) => ({
      ...prev,
      details: { ...prev.details, [field]: value },
    }))
    setHasUnsavedChanges(true)
  }

  const updateTechnical = (field, value) => {
    setProjectData((prev) => ({
      ...prev,
      technical: { ...prev.technical, [field]: value },
    }))
    setHasUnsavedChanges(true)
  }

  const updateLinks = (field, value) => {
    setProjectData((prev) => ({
      ...prev,
      links: { ...prev.links, [field]: value },
    }))
    setHasUnsavedChanges(true)
  }

  const updateCollaboration = (field, value) => {
    setProjectData((prev) => ({
      ...prev,
      collaboration: { ...prev.collaboration, [field]: value },
    }))
    setHasUnsavedChanges(true)
  }

  const updateVisibility = (field, value) => {
    setProjectData((prev) => ({
      ...prev,
      visibility: { ...prev.visibility, [field]: value },
    }))
    setHasUnsavedChanges(true)
  }

  const addTag = () => {
    if (newTag.trim() && !projectData.basic.tags.includes(newTag.trim())) {
      updateBasicInfo("tags", [...projectData.basic.tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove) => {
    updateBasicInfo(
      "tags",
      projectData.basic.tags.filter((tag) => tag !== tagToRemove),
    )
  }

  const addTechnology = () => {
    if (newTech.trim() && !projectData.technical.technologies.includes(newTech.trim())) {
      updateTechnical("technologies", [...projectData.technical.technologies, newTech.trim()])
      setNewTech("")
    }
  }

  const removeTechnology = (techToRemove) => {
    updateTechnical(
      "technologies",
      projectData.technical.technologies.filter((tech) => tech !== techToRemove),
    )
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      updateDetails("features", [...projectData.details.features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (index) => {
    updateDetails(
      "features",
      projectData.details.features.filter((_, i) => i !== index),
    )
  }

  const addAdditionalLink = () => {
    if (newLink.title.trim() && newLink.url.trim()) {
      updateLinks("additionalLinks", [...projectData.links.additionalLinks, { ...newLink }])
      setNewLink({ title: "", url: "" })
    }
  }

  const removeAdditionalLink = (index) => {
    updateLinks(
      "additionalLinks",
      projectData.links.additionalLinks.filter((_, i) => i !== index),
    )
  }

  const handleCoverImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, WebP)')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    try {
      setUploadingCover(true)
      
      // Create preview
      const previewUrl = URL.createObjectURL(file)
      setCoverImagePreview(previewUrl)
      
      // For now, just store the file in projectData
      // We'll upload it when the project is saved/published
      setProjectData(prev => ({
        ...prev,
        media: { ...prev.media, coverImage: previewUrl, coverImageFile: file }
      }))
      
      setHasUnsavedChanges(true)
      toast.success('Cover image selected successfully!')
      
    } catch (error) {
      console.error('Error handling cover image:', error)
      toast.error('Failed to process cover image')
    } finally {
      setUploadingCover(false)
    }
  }

  const removeCoverImage = () => {
    if (coverImagePreview) {
      URL.revokeObjectURL(coverImagePreview)
    }
    setCoverImagePreview("")
    setProjectData(prev => ({
      ...prev,
      media: { ...prev.media, coverImage: "", coverImageFile: null }
    }))
    setHasUnsavedChanges(true)
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      
      // First create the project
      const transformedData = {
        // Basic information
        title: projectData.basic.title,
        description: projectData.basic.description,
        category: projectData.basic.category,
        status: projectData.basic.status,
        tags: projectData.basic.tags,
        featured: projectData.basic.featured,
        
        // Details
        longDescription: projectData.details.longDescription,
        features: projectData.details.features,
        challenges: projectData.details.challenges,
        learnings: projectData.details.learnings,
        futureEnhancements: projectData.details.futureEnhancements,
        
        // Technical
        techStack: projectData.technical.technologies,
        architecture: projectData.technical.architecture,
        deployment: projectData.technical.deployment,
        database: projectData.technical.database,
        apiDocumentation: projectData.technical.apiDocumentation,
        
        // Links
        githubUrl: projectData.links.githubUrl,
        liveUrl: projectData.links.liveUrl,
        documentationUrl: projectData.links.documentationUrl,
        additionalLinks: projectData.links.additionalLinks,
        
        // Media (without file, we'll upload that separately)
        coverImage: "", // Will be updated after upload
        screenshots: projectData.media.screenshots,
        videos: projectData.media.videos,
        logo: projectData.media.logo,
        
        // Collaboration
        isOpenSource: projectData.collaboration.isOpenSource,
        acceptingContributions: projectData.collaboration.acceptingContributions,
        collaborators: projectData.collaboration.collaborators,
        license: projectData.collaboration.license,
        
        // Visibility - save as private for draft
        isPublic: false,
        showInPortfolio: projectData.visibility.showInPortfolio,
        allowComments: projectData.visibility.allowComments,
      }

      const response = await projectsAPI.createProject(transformedData)
      
      if (response.success) {
        const projectId = response.data._id
        
        // Upload cover image if one was selected
        if (projectData.media.coverImageFile) {
          try {
            const uploadResponse = await uploadAPI.uploadProjectCover(projectId, projectData.media.coverImageFile)
            if (uploadResponse.success) {
              toast.success('Project saved with cover image successfully!')
            }
          } catch (uploadError) {
            console.error('Error uploading cover image:', uploadError)
            toast.success('Project saved, but cover image upload failed')
          }
        } else {
          toast.success('Project saved as draft successfully!')
        }
        
        setHasUnsavedChanges(false)
        navigate('/home')
      }
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error(error.message || 'Failed to save project')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublish = async () => {
    try {
      // Validate required fields before publishing
      if (!projectData.basic.title.trim()) {
        toast.error('Project title is required')
        return
      }
      if (!projectData.basic.description.trim()) {
        toast.error('Project description is required')
        return
      }
      if (projectData.technical.technologies.length === 0) {
        toast.error('At least one technology is required')
        return
      }

      setIsLoading(true)

      // First create the project
      const transformedData = {
        // Basic information
        title: projectData.basic.title,
        description: projectData.basic.description,
        category: projectData.basic.category,
        status: projectData.basic.status,
        tags: projectData.basic.tags,
        featured: projectData.basic.featured,
        
        // Details
        longDescription: projectData.details.longDescription,
        features: projectData.details.features,
        challenges: projectData.details.challenges,
        learnings: projectData.details.learnings,
        futureEnhancements: projectData.details.futureEnhancements,
        
        // Technical
        techStack: projectData.technical.technologies,
        architecture: projectData.technical.architecture,
        deployment: projectData.technical.deployment,
        database: projectData.technical.database,
        apiDocumentation: projectData.technical.apiDocumentation,
        
        // Links
        githubUrl: projectData.links.githubUrl,
        liveUrl: projectData.links.liveUrl,
        documentationUrl: projectData.links.documentationUrl,
        additionalLinks: projectData.links.additionalLinks,
        
        // Media (without file, we'll upload that separately)
        coverImage: "", // Will be updated after upload
        screenshots: projectData.media.screenshots,
        videos: projectData.media.videos,
        logo: projectData.media.logo,
        
        // Collaboration
        isOpenSource: projectData.collaboration.isOpenSource,
        acceptingContributions: projectData.collaboration.acceptingContributions,
        collaborators: projectData.collaboration.collaborators,
        license: projectData.collaboration.license,
        
        // Visibility - publish as public
        isPublic: projectData.visibility.isPublic,
        showInPortfolio: projectData.visibility.showInPortfolio,
        allowComments: projectData.visibility.allowComments,
      }

      const response = await projectsAPI.createProject(transformedData)
      
      if (response.success) {
        const projectId = response.data._id
        
        // Upload cover image if one was selected
        if (projectData.media.coverImageFile) {
          try {
            const uploadResponse = await uploadAPI.uploadProjectCover(projectId, projectData.media.coverImageFile)
            if (uploadResponse.success) {
              toast.success('Project published with cover image successfully!')
            }
          } catch (uploadError) {
            console.error('Error uploading cover image:', uploadError)
            toast.success('Project published, but cover image upload failed')
          }
        } else {
          toast.success('Project published successfully!')
        }
        
        setHasUnsavedChanges(false)
        navigate('/home')
      }
    } catch (error) {
      console.error('Error publishing project:', error)
      toast.error(error.message || 'Failed to publish project')
    } finally {
      setIsLoading(false)
    }
  }

  // Check authentication
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to create a project</p>
          <button 
            onClick={() => navigate('/login')} 
            className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 border-indigo-600"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="navbar bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="navbar-start">
          <Link to="/home" className="btn btn-ghost normal-case text-xl text-gray-800">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            DevConnect Pro
          </Link>
        </div>
        
        <div className="navbar-end space-x-2">
          <button 
            className="btn btn-outline btn-sm text-gray-600 border-gray-300 hover:bg-gray-50" 
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreviewMode ? "Edit Mode" : "Preview"}
          </button>

          <button 
            onClick={handleSave} 
            disabled={isLoading}
            className="btn btn-outline btn-sm text-gray-600 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Draft'}
          </button>

          <button 
            onClick={handlePublish} 
            disabled={isLoading}
            className="btn btn-primary btn-sm bg-indigo-600 hover:bg-indigo-700 border-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Globe className="h-4 w-4 mr-2" />
            {isLoading ? 'Publishing...' : 'Publish Project'}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Project</h1>
          <p className="text-gray-600 mt-2">Showcase your work and share it with the developer community</p>
          {hasUnsavedChanges && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-3" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-yellow-800">You have unsaved changes. Don't forget to save your progress!</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button 
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "basic" 
                  ? "border-indigo-500 text-indigo-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("basic")}
            >
              Basic Info
            </button>
            <button 
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "details" 
                  ? "border-indigo-500 text-indigo-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
            <button 
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "technical" 
                  ? "border-indigo-500 text-indigo-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("technical")}
            >
              Technical
            </button>
            <button 
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "media" 
                  ? "border-indigo-500 text-indigo-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("media")}
            >
              Media
            </button>
            <button 
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "links" 
                  ? "border-indigo-500 text-indigo-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("links")}
            >
              Links
            </button>
            <button 
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "settings" 
                  ? "border-indigo-500 text-indigo-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Basic Info Tab */}
        {activeTab === "basic" && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Information</h2>
              <p className="text-gray-600 mb-6">Basic details about your project</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 bg-white"
                    value={projectData.basic.title}
                    onChange={(e) => updateBasicInfo("title", e.target.value)}
                    placeholder="My Awesome Project"
                    maxLength={100}
                  />
                  <p className="text-sm text-gray-500 mt-1">{projectData.basic.title.length}/100 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors h-20 resize-y text-gray-900 bg-white"
                    value={projectData.basic.description}
                    onChange={(e) => updateBasicInfo("description", e.target.value)}
                    placeholder="A brief description of what your project does and why it's useful..."
                    maxLength={300}
                  />
                  <p className="text-sm text-gray-500 mt-1">{projectData.basic.description.length}/300 characters</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 bg-white"
                      value={projectData.basic.category}
                      onChange={(e) => updateBasicInfo("category", e.target.value)}
                    >
                      <option value="">Select a category</option>
                      {projectCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Status
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 bg-white"
                      value={projectData.basic.status}
                      onChange={(e) => updateBasicInfo("status", e.target.value)}
                    >
                      {projectStatus.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {projectData.basic.tags.map((tag) => (
                      <div key={tag} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        <Tag className="h-3 w-3" />
                        {tag}
                        <button onClick={() => removeTag(tag)} className="text-indigo-600 hover:text-red-600 transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 bg-white"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag (e.g., responsive, real-time)"
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                    />
                    <button 
                      onClick={addTag} 
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Tags help others discover your project</p>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="featured"
                    className="checkbox checkbox-primary"
                    checked={projectData.basic.featured}
                    onChange={(e) => updateBasicInfo("featured", e.target.checked)}
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Feature this project on my profile
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === "details" && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Details</h2>
              <p className="text-gray-600 mb-6">Detailed information about your project</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors h-32 resize-y text-gray-900 bg-white"
                    value={projectData.details.longDescription}
                    onChange={(e) => updateDetails("longDescription", e.target.value)}
                    placeholder="Provide a comprehensive description of your project, including its purpose, target audience, and key benefits..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Features</label>
                  <div className="space-y-2">
                    {projectData.details.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input 
                          type="text"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 bg-white"
                          value={feature} 
                          readOnly 
                        />
                        <button
                          onClick={() => removeFeature(index)}
                          className="p-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 bg-white"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Add a key feature"
                        onKeyPress={(e) => e.key === "Enter" && addFeature()}
                      />
                      <button 
                        onClick={addFeature} 
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Challenges & Solutions
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors h-24 resize-y text-gray-900 bg-white"
                    value={projectData.details.challenges}
                    onChange={(e) => updateDetails("challenges", e.target.value)}
                    placeholder="Describe the main challenges you faced and how you solved them..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What You Learned
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors h-24 resize-y text-gray-900 bg-white"
                    value={projectData.details.learnings}
                    onChange={(e) => updateDetails("learnings", e.target.value)}
                    placeholder="Share what you learned while building this project..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Future Enhancements
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors h-20 resize-y text-gray-900 bg-white"
                    value={projectData.details.futureEnhancements}
                    onChange={(e) => updateDetails("futureEnhancements", e.target.value)}
                    placeholder="What features or improvements do you plan to add in the future?"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Technical Tab */}
        {activeTab === "technical" && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Technical Information</h2>
              <p className="text-gray-600 mb-6">Technical details and architecture</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used *</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {projectData.technical.technologies.map((tech) => (
                      <div key={tech} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        <Code2 className="h-3 w-3" />
                        {tech}
                        <button onClick={() => removeTechnology(tech)} className="text-indigo-600 hover:text-red-600 transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <select 
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 bg-white"
                      value={newTech} 
                      onChange={(e) => setNewTech(e.target.value)}
                    >
                      <option value="">Select a technology</option>
                      {techStack.map((tech) => (
                        <option key={tech} value={tech}>
                          {tech}
                        </option>
                      ))}
                    </select>
                    <button 
                      onClick={addTechnology} 
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 bg-white"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      placeholder="Or type a custom technology"
                      onKeyPress={(e) => e.key === "Enter" && addTechnology()}
                    />
                    <button 
                      onClick={addTechnology} 
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Add Custom
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Architecture & Design Patterns
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors h-24 resize-y text-gray-900 bg-white"
                    value={projectData.technical.architecture}
                    onChange={(e) => updateTechnical("architecture", e.target.value)}
                    placeholder="Describe the architecture, design patterns, and technical decisions..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deployment & Hosting
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 bg-white"
                      value={projectData.technical.deployment}
                      onChange={(e) => updateTechnical("deployment", e.target.value)}
                      placeholder="e.g., Vercel, AWS, Docker"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Database
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 bg-white"
                      value={projectData.technical.database}
                      onChange={(e) => updateTechnical("database", e.target.value)}
                      placeholder="e.g., PostgreSQL, MongoDB"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Documentation
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 bg-white"
                    value={projectData.technical.apiDocumentation}
                    onChange={(e) => updateTechnical("apiDocumentation", e.target.value)}
                    placeholder="https://api-docs.example.com"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === "media" && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Media</h2>
              <p className="text-gray-600 mb-6">Upload images, videos, and other media</p>
              
              <div className="space-y-6">
                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                  {(projectData.media.coverImage || coverImagePreview) ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <img 
                          src={coverImagePreview || projectData.media.coverImage} 
                          alt="Cover preview" 
                          className="w-full h-48 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          onClick={removeCoverImage}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImageUpload}
                            className="hidden"
                            disabled={uploadingCover}
                          />
                          <span className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadingCover ? 'Uploading...' : 'Change Image'}
                          </span>
                        </label>
                        <button
                          onClick={removeCoverImage}
                          className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                      <div className="flex flex-col items-center space-y-2">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                        <div>
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleCoverImageUpload}
                              className="hidden"
                              disabled={uploadingCover}
                            />
                            <span className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                              <Upload className="h-4 w-4 mr-2" />
                              {uploadingCover ? 'Uploading...' : 'Upload Cover Image'}
                            </span>
                          </label>
                        </div>
                        <p className="text-sm text-gray-500">PNG, JPG up to 5MB. Recommended: 1200x630px</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Screenshots */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Screenshots</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                      <div className="flex flex-col items-center space-y-2">
                        <Camera className="h-8 w-8 text-gray-400" />
                        <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Screenshot
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Add up to 10 screenshots to showcase your project</p>
                </div>

                {/* Videos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Demo Videos</label>
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                      <div className="flex flex-col items-center space-y-2">
                        <Video className="h-8 w-8 text-gray-400" />
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Demo Video
                        </button>
                        <p className="text-sm text-gray-500">MP4, WebM up to 50MB</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Or add YouTube/Vimeo URL</label>
                      <input 
                        type="url" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 bg-white"
                        placeholder="https://youtube.com/watch?v=..." 
                      />
                    </div>
                  </div>
                </div>

                {/* Project Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Logo (Optional)</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </button>
                      <p className="text-sm text-gray-500 mt-1">Square image, 256x256px recommended</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Links Tab */}
        {activeTab === "links" && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Links</h2>
              <p className="text-gray-600 mb-6">Add links to your project and related resources</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 bg-white"
                    value={projectData.links.liveUrl}
                    onChange={(e) => updateLinks("liveUrl", e.target.value)}
                    placeholder="https://myproject.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub Repository
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 bg-white"
                    value={projectData.links.githubUrl}
                    onChange={(e) => updateLinks("githubUrl", e.target.value)}
                    placeholder="https://github.com/username/project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Documentation
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 bg-white"
                    value={projectData.links.documentationUrl}
                    onChange={(e) => updateLinks("documentationUrl", e.target.value)}
                    placeholder="https://docs.myproject.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Links</label>
                  <div className="space-y-2">
                    {projectData.links.additionalLinks.map((link, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input 
                          type="text"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 bg-white"
                          value={link.title} 
                          readOnly 
                          placeholder="Link Title" 
                        />
                        <input 
                          type="text"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 bg-white"
                          value={link.url} 
                          readOnly 
                          placeholder="URL" 
                        />
                        <button
                          onClick={() => removeAdditionalLink(index)}
                          className="p-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 bg-white"
                        value={newLink.title}
                        onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                        placeholder="Link title (e.g., Blog Post)"
                      />
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 bg-white"
                        value={newLink.url}
                        onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                        placeholder="URL"
                      />
                      <button 
                        onClick={addAdditionalLink} 
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Collaboration Settings */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Collaboration Settings</h2>
                <p className="text-gray-600 mb-6">Configure how others can interact with your project</p>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Open Source Project</label>
                      <p className="text-sm text-gray-500">Allow others to view and contribute to your code</p>
                    </div>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={projectData.collaboration.isOpenSource}
                      onChange={(e) => updateCollaboration("isOpenSource", e.target.checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Accepting Contributions</label>
                      <p className="text-sm text-gray-500">Welcome pull requests and contributions</p>
                    </div>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={projectData.collaboration.acceptingContributions}
                      onChange={(e) => updateCollaboration("acceptingContributions", e.target.checked)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">License</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 bg-white"
                      value={projectData.collaboration.license}
                      onChange={(e) => updateCollaboration("license", e.target.value)}
                    >
                      <option value="MIT">MIT License</option>
                      <option value="Apache-2.0">Apache License 2.0</option>
                      <option value="GPL-3.0">GNU GPL v3.0</option>
                      <option value="BSD-3-Clause">BSD 3-Clause</option>
                      <option value="Proprietary">Proprietary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Visibility Settings */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Visibility Settings</h2>
                <p className="text-gray-600 mb-6">Control who can see and interact with your project</p>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Public Project</label>
                      <p className="text-sm text-gray-500">Anyone can view this project</p>
                    </div>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={projectData.visibility.isPublic}
                      onChange={(e) => updateVisibility("isPublic", e.target.checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Show in Portfolio</label>
                      <p className="text-sm text-gray-500">Display this project on your profile</p>
                    </div>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={projectData.visibility.showInPortfolio}
                      onChange={(e) => updateVisibility("showInPortfolio", e.target.checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Allow Comments</label>
                      <p className="text-sm text-gray-500">Let others comment on your project</p>
                    </div>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={projectData.visibility.allowComments}
                      onChange={(e) => updateVisibility("allowComments", e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8">
          <Link to="/home" className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </Link>

          <div className="flex items-center space-x-4">
            <button 
              onClick={handleSave} 
              disabled={isLoading}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save as Draft'}
            </button>
            <button 
              onClick={handlePublish} 
              disabled={isLoading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Globe className="h-4 w-4 mr-2" />
              {isLoading ? 'Publishing...' : 'Publish Project'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
