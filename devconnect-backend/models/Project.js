const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
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
    techStack: [{
        type: String,
        trim: true,
        required: [true, 'Please add at least one technology']
    }],
    githubUrl: {
        type: String,
        required: [true, 'Please add GitHub repository URL'],
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
    coverImage: {
        type: String,
        default: 'https://via.placeholder.com/400x300.png?text=Project+Image',
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // Fixed: was Schema.Types.ObjectId
        ref: 'User',
        required: [true, 'Project must belong to a user']
    },
    status: {
        type: String,
        enum: ['planning', 'in-progress', 'completed', 'on-hold'],
        default: 'in-progress'
    },
    isPublic: {
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