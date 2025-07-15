import {
  Code2,
  Upload,
  X,
  Plus,
  Save,
  Eye,
  Github,
  Linkedin,
  Twitter,
  Globe,
  MapPin,
  Briefcase,
  Trash2,
  Edit,
  Camera,
} from "lucide-react"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { selectUser, selectIsAuthenticated } from "../features/auth/authSlice"

// Mock current user data
const initialProfileData = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    bio: "Passionate full-stack developer with 5+ years of experience building scalable web applications. I love working with React, Node.js, and cloud technologies. Always eager to learn new technologies and contribute to open source projects.",
    avatar: "/placeholder.svg?height=120&width=120",
    coverImage: "/placeholder.svg?height=200&width=800",
  },
  professionalInfo: {
    title: "Senior Full-Stack Developer",
    company: "TechCorp Inc.",
    experienceLevel: "Senior Developer (5+ years)",
    primarySkill: "Full-stack Development",
    hourlyRate: "$85",
    availability: "Available for freelance",
    workType: "Remote",
  },
  socialLinks: {
    github: "johndoe",
    linkedin: "johndoe",
    twitter: "johndoe",
    portfolio: "https://johndoe.dev",
    blog: "https://blog.johndoe.dev",
  },
  skills: [
    { name: "JavaScript", level: 95, category: "Frontend" },
    { name: "React", level: 92, category: "Frontend" },
    { name: "Node.js", level: 88, category: "Backend" },
    { name: "TypeScript", level: 85, category: "Frontend" },
    { name: "Python", level: 78, category: "Backend" },
    { name: "AWS", level: 75, category: "DevOps" },
    { name: "Docker", level: 72, category: "DevOps" },
    { name: "GraphQL", level: 68, category: "Backend" },
  ],
  experience: [
    {
      id: 1,
      title: "Senior Full-Stack Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      startDate: "2022-01",
      endDate: "",
      current: true,
      description:
        "Lead development of microservices architecture, mentor junior developers, and collaborate with product teams to deliver high-quality features.",
      technologies: ["React", "Node.js", "AWS", "Docker"],
    },
    {
      id: 2,
      title: "Full-Stack Developer",
      company: "StartupXYZ",
      location: "Remote",
      startDate: "2020-06",
      endDate: "2021-12",
      current: false,
      description:
        "Built and maintained web applications, implemented CI/CD pipelines, and contributed to product strategy discussions.",
      technologies: ["Vue.js", "Python", "PostgreSQL", "GCP"],
    },
  ],
  education: [
    {
      id: 1,
      degree: "Bachelor of Science in Computer Science",
      school: "University of California, Berkeley",
      location: "Berkeley, CA",
      startDate: "2016-09",
      endDate: "2020-05",
      gpa: "3.8",
      description:
        "Focused on software engineering, algorithms, and data structures. Active member of the Computer Science Student Association.",
    },
  ],
}

const skillCategories = ["Frontend", "Backend", "Mobile", "DevOps", "Database", "Design", "Other"]
const experienceLevels = [
  "Student / Learning to code",
  "Junior Developer (0-2 years)",
  "Mid-level Developer (2-5 years)",
  "Senior Developer (5+ years)",
  "Tech Lead / Architect",
  "Engineering Manager",
]

const primarySkills = [
  "Frontend Development",
  "Backend Development",
  "Full-stack Development",
  "Mobile Development",
  "DevOps / Cloud",
  "Data Science / ML",
  "UI/UX Design",
  "Product Management",
]

export default function ProfileEdit() {
  const currentUser = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const [profileData, setProfileData] = useState(initialProfileData)
  const [activeTab, setActiveTab] = useState("personal")
  const [newSkill, setNewSkill] = useState({ name: "", level: 50, category: "Frontend" })
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Initialize form with current user data if available
  useEffect(() => {
    if (currentUser && isAuthenticated) {
      console.log('ProfileEdit: Initializing with user data:', currentUser.username)
      // You can merge currentUser data with initialProfileData here
      // For now, keeping the mock data but you could do:
      // setProfileData(prev => ({
      //   ...prev,
      //   personalInfo: {
      //     ...prev.personalInfo,
      //     firstName: currentUser.firstName || prev.personalInfo.firstName,
      //     lastName: currentUser.lastName || prev.personalInfo.lastName,
      //     email: currentUser.email || prev.personalInfo.email,
      //     username: currentUser.username || prev.personalInfo.username,
      //   }
      // }))
    }
  }, [currentUser, isAuthenticated])

  const updatePersonalInfo = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }))
    setHasUnsavedChanges(true)
  }

  const updateProfessionalInfo = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      professionalInfo: { ...prev.professionalInfo, [field]: value },
    }))
    setHasUnsavedChanges(true)
  }

  const updateSocialLinks = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [field]: value },
    }))
    setHasUnsavedChanges(true)
  }

  const addSkill = () => {
    if (newSkill.name.trim()) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, { ...newSkill, name: newSkill.name.trim() }],
      }))
      setNewSkill({ name: "", level: 50, category: "Frontend" })
      setHasUnsavedChanges(true)
    }
  }

  const removeSkill = (index) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
    setHasUnsavedChanges(true)
  }

  const updateSkill = (index, field, value) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, i) => (i === index ? { ...skill, [field]: value } : skill)),
    }))
    setHasUnsavedChanges(true)
  }

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      technologies: [],
    }
    setProfileData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }))
    setHasUnsavedChanges(true)
  }

  const updateExperience = (id, field, value) => {
    setProfileData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
    setHasUnsavedChanges(true)
  }

  const removeExperience = (id) => {
    setProfileData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }))
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving profile data:", profileData)
    setHasUnsavedChanges(false)
    // Show success message
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

          {hasUnsavedChanges && (
            <button onClick={handleSave} className="btn btn-primary btn-sm bg-indigo-600 hover:bg-indigo-700 border-indigo-600">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          )}

          <Link to="/profile/johndoe" className="btn btn-ghost btn-sm text-gray-600 hover:bg-gray-50">
            View Profile
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Update Profile</h1>
          <p className="text-gray-600 mt-2">Keep your professional profile up to date</p>
          {hasUnsavedChanges && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-3" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-yellow-800">You have unsaved changes. Don't forget to save!</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button 
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "personal" 
                  ? "border-indigo-500 text-indigo-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("personal")}
            >
              Personal Info
            </button>
            <button 
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "professional" 
                  ? "border-indigo-500 text-indigo-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("professional")}
            >
              Professional
            </button>
            <button 
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "skills" 
                  ? "border-indigo-500 text-indigo-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("skills")}
            >
              Skills
            </button>
            <button 
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "experience" 
                  ? "border-indigo-500 text-indigo-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("experience")}
            >
              Experience
            </button>
            <button 
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "social" 
                  ? "border-indigo-500 text-indigo-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("social")}
            >
              Social Links
            </button>
          </nav>
        </div>

        {/* Personal Info Tab */}
        {activeTab === "personal" && (
          <div className="space-y-6">
            {/* Profile Pictures Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Pictures</h2>
                <p className="text-gray-600 mb-6">Upload your profile picture and cover image</p>
                
                {/* Cover Image */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image
                  </label>
                  <div className="relative">
                    <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg overflow-hidden">
                      <img
                        src={profileData.personalInfo.coverImage || "https://via.placeholder.com/800x200"}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-20"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                          <Camera className="h-4 w-4 mr-2" />
                          Change Cover
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Picture */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <img 
                          src={profileData.personalInfo.avatar || "https://via.placeholder.com/120x120"} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New Picture
                      </button>
                      <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max size 5MB.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Basic Information</h2>
                <p className="text-gray-600 mb-6">Your personal details and contact information</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                      value={profileData.personalInfo.firstName}
                      onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                      value={profileData.personalInfo.lastName}
                      onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                    value={profileData.personalInfo.username}
                    onChange={(e) => updatePersonalInfo("username", e.target.value)}
                    placeholder="johndoe"
                  />
                  <p className="text-sm text-gray-500 mt-1">Your profile URL: devconnect.pro/{profileData.personalInfo.username}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                      value={profileData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo("email", e.target.value)}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                      value={profileData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                        value={profileData.personalInfo.location}
                        onChange={(e) => updatePersonalInfo("location", e.target.value)}
                        placeholder="San Francisco, CA"
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Personal Website
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                        value={profileData.personalInfo.website}
                        onChange={(e) => updatePersonalInfo("website", e.target.value)}
                        placeholder="https://johndoe.dev"
                      />
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors h-24 resize-y"
                    value={profileData.personalInfo.bio}
                    onChange={(e) => updatePersonalInfo("bio", e.target.value)}
                    placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                    maxLength={500}
                  />
                  <p className="text-sm text-gray-500 mt-1">{profileData.personalInfo.bio.length}/500 characters</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Professional Info Tab */}
        {activeTab === "professional" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Professional Information</h2>
              <p className="text-gray-600 mt-1">Your current role and professional details</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Title *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={profileData.professionalInfo.title}
                    onChange={(e) => updateProfessionalInfo("title", e.target.value)}
                    placeholder="Senior Full-Stack Developer"
                  />
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Company
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={profileData.professionalInfo.company}
                    onChange={(e) => updateProfessionalInfo("company", e.target.value)}
                    placeholder="TechCorp Inc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Type
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={profileData.professionalInfo.workType}
                    onChange={(e) => updateProfessionalInfo("workType", e.target.value)}
                  >
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Experience Level</span>
                  </label>
                  <select 
                    className="select select-bordered"
                    value={profileData.professionalInfo.experienceLevel}
                    onChange={(e) => updateProfessionalInfo("experienceLevel", e.target.value)}
                  >
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Focus Area
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                    value={profileData.professionalInfo.primarySkill}
                    onChange={(e) => updateProfessionalInfo("primarySkill", e.target.value)}
                  >
                    {primarySkills.map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                    value={profileData.professionalInfo.hourlyRate}
                    onChange={(e) => updateProfessionalInfo("hourlyRate", e.target.value)}
                    placeholder="$85"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                    value={profileData.professionalInfo.availability}
                    onChange={(e) => updateProfessionalInfo("availability", e.target.value)}
                  >
                    <option value="Available for freelance">Available for freelance</option>
                    <option value="Open to opportunities">Open to opportunities</option>
                    <option value="Not looking">Not looking</option>
                    <option value="Available for consulting">Available for consulting</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === "skills" && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Skills & Expertise</h2>
              <p className="text-gray-600 mb-6">Add and manage your technical skills</p>
              
              {/* Add New Skill */}
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 mb-6">
                <h4 className="font-medium text-gray-800 mb-3">Add New Skill</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skill Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      placeholder="JavaScript"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                      value={newSkill.category}
                      onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    >
                      {skillCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proficiency Level: {newSkill.level}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={newSkill.level}
                      onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${newSkill.level}%, #e5e7eb ${newSkill.level}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      &nbsp;
                    </label>
                    <button onClick={addSkill} className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Skill
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Skills */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Current Skills</h4>
                {profileData.skills.map((skill, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Skill Name
                        </label>
                        <input 
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                          value={skill.name} 
                          onChange={(e) => updateSkill(index, "name", e.target.value)} 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                          value={skill.category}
                          onChange={(e) => updateSkill(index, "category", e.target.value)}
                        >
                          {skillCategories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Proficiency: {skill.level}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={skill.level}
                          onChange={(e) => updateSkill(index, "level", parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-2"
                          style={{
                            background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${skill.level}%, #e5e7eb ${skill.level}%, #e5e7eb 100%)`
                          }}
                        />
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-indigo-600 h-2 rounded-full" style={{width: `${skill.level}%`}}></div>
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={() => removeSkill(index)}
                          className="w-full border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === "experience" && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Work Experience</h2>
                  <p className="text-gray-600">Add your professional work experience</p>
                </div>
                <button onClick={addExperience} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </button>
              </div>
              
              <div className="space-y-6">
                {profileData.experience.map((exp) => (
                  <div key={exp.id} className="p-6 border border-gray-200 rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-800">Experience Entry</h4>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="border border-red-300 text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Title *
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                            value={exp.title}
                            onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                            placeholder="Senior Full-Stack Developer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company *
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                            placeholder="TechCorp Inc."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                          placeholder="San Francisco, CA"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date *
                          </label>
                          <input
                            type="month"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date
                          </label>
                          <input
                            type="month"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors disabled:bg-gray-100 disabled:text-gray-500"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                            disabled={exp.current}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            &nbsp;
                          </label>
                          <div className="flex items-center space-x-2 pt-2">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              checked={exp.current}
                              onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                            />
                            <span className="text-sm text-gray-700">Current position</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors h-20 resize-y"
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                          placeholder="Describe your role, responsibilities, and achievements..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Technologies Used
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {exp.technologies.map((tech, techIndex) => (
                            <div key={techIndex} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                              {tech}
                              <button
                                onClick={() => {
                                  const newTechs = exp.technologies.filter((_, i) => i !== techIndex)
                                  updateExperience(exp.id, "technologies", newTechs)
                                }}
                                className="text-indigo-600 hover:text-red-600 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                          placeholder="Add technology (press Enter)"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              const value = e.currentTarget.value.trim()
                              if (value && !exp.technologies.includes(value)) {
                                updateExperience(exp.id, "technologies", [...exp.technologies, value])
                                e.currentTarget.value = ""
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Social Links Tab */}
        {activeTab === "social" && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Social Links</h2>
              <p className="text-gray-600 mb-6">Connect your social media and professional profiles</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub Username
                  </label>
                  <div className="flex rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-colors">
                    <span className="bg-gray-50 border-r border-gray-300 flex items-center px-3 text-sm text-gray-500">
                      github.com/
                    </span>
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 outline-none"
                      value={profileData.socialLinks.github}
                      onChange={(e) => updateSocialLinks("github", e.target.value)}
                      placeholder="johndoe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn Username
                  </label>
                  <div className="flex rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-colors">
                    <span className="bg-gray-50 border-r border-gray-300 flex items-center px-3 text-sm text-gray-500">
                      linkedin.com/in/
                    </span>
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 outline-none"
                      value={profileData.socialLinks.linkedin}
                      onChange={(e) => updateSocialLinks("linkedin", e.target.value)}
                      placeholder="johndoe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter Username
                  </label>
                  <div className="flex rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-colors">
                    <span className="bg-gray-50 border-r border-gray-300 flex items-center px-3 text-sm text-gray-500">
                      twitter.com/
                    </span>
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 outline-none"
                      value={profileData.socialLinks.twitter}
                      onChange={(e) => updateSocialLinks("twitter", e.target.value)}
                      placeholder="johndoe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Portfolio Website
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                    value={profileData.socialLinks.portfolio}
                    onChange={(e) => updateSocialLinks("portfolio", e.target.value)}
                    placeholder="https://johndoe.dev"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Blog/Medium
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                    value={profileData.socialLinks.blog}
                    onChange={(e) => updateSocialLinks("blog", e.target.value)}
                    placeholder="https://blog.johndoe.dev"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
          <div className="flex items-center space-x-4">
            <Link to="/profile/johndoe" className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
            <button 
              onClick={handleSave} 
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed" 
              disabled={!hasUnsavedChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              {hasUnsavedChanges ? "Save Changes" : "All Changes Saved"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
