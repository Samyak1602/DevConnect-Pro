const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    // Basic Information
    title: {
        type: String,
        required: [true, 'Please add a project title'],
        trim: true,
        maxLength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a project description'],
        trim: true,
        maxLength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
        type: String,
        trim: true,
        maxLength: [50, 'Category cannot exceed 50 characters']
    },
    tags: [{
        type: String,
        trim: true,
        maxLength: [30, 'Tag cannot exceed 30 characters']
    }],
    featured: {
        type: Boolean,
        default: false
    },
    
    // Detailed Information
    longDescription: {
        type: String,
        trim: true,
        maxLength: [5000, 'Long description cannot exceed 5000 characters']
    },
    features: [{
        type: String,
        trim: true,
        maxLength: [200, 'Feature description cannot exceed 200 characters']
    }],
    challenges: {
        type: String,
        trim: true,
        maxLength: [2000, 'Challenges description cannot exceed 2000 characters']
    },
    learnings: {
        type: String,
        trim: true,
        maxLength: [2000, 'Learnings description cannot exceed 2000 characters']
    },
    futureEnhancements: {
        type: String,
        trim: true,
        maxLength: [2000, 'Future enhancements description cannot exceed 2000 characters']
    },
    
    // Technical Information
    techStack: [{
        type: String,
        trim: true,
        required: [true, 'Please add at least one technology']
    }],
    architecture: {
        type: String,
        trim: true,
        maxLength: [2000, 'Architecture description cannot exceed 2000 characters']
    },
    deployment: {
        type: String,
        trim: true,
        maxLength: [200, 'Deployment information cannot exceed 200 characters']
    },
    database: {
        type: String,
        trim: true,
        maxLength: [200, 'Database information cannot exceed 200 characters']
    },
    apiDocumentation: {
        type: String,
        trim: true,
        match: [
            /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
            'Please enter a valid URL'
        ]
    },
    
    // Links
    githubUrl: {
        type: String,
        trim: true,
        match: [
            /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+$/,
            'Please enter a valid GitHub URL'
        ]
    },
    liveUrl: {
        type: String,
        trim: true,
        match: [
            /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
            'Please enter a valid URL'
        ]
    },
    documentationUrl: {
        type: String,
        trim: true,
        match: [
            /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
            'Please enter a valid URL'
        ]
    },
    additionalLinks: [{
        title: {
            type: String,
            trim: true,
            maxLength: [100, 'Link title cannot exceed 100 characters']
        },
        url: {
            type: String,
            trim: true,
            match: [
                /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
                'Please enter a valid URL'
            ]
        }
    }],
    
    // Media
    coverImage: {
        type: String,
        default: 'https://via.placeholder.com/400x300.png?text=Project+Image',
        trim: true
    },
    screenshots: [{
        type: String,
        trim: true
    }],
    videos: [{
        type: String,
        trim: true
    }],
    logo: {
        type: String,
        trim: true
    },
    
    // Collaboration
    isOpenSource: {
        type: Boolean,
        default: true
    },
    acceptingContributions: {
        type: Boolean,
        default: false
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    license: {
        type: String,
        enum: ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'Proprietary', 'Other'],
        default: 'MIT'
    },
    
    // System fields
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Project must belong to a user']
    },
    status: {
        type: String,
        enum: ['Planning', 'In Development', 'Completed', 'Maintenance', 'Archived'],
        default: 'In Development'
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    showInPortfolio: {
        type: Boolean,
        default: true
    },
    allowComments: {
        type: Boolean,
        default: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Index for better query performance
projectSchema.index({ user: 1, createdAt: -1 });
projectSchema.index({ techStack: 1 });
projectSchema.index({ title: 'text', description: 'text' });

// Virtual for like count
projectSchema.virtual('likeCount').get(function() {
    return this.likes.length;
});

// Ensure virtual fields are serialized
projectSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Project', projectSchema);