const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        const project = await Project.create(req.body);

        // Populate user information
        await project.populate('user', 'username avatar');

        res.status(201).json({
            success: true,
            data: project
        });
    } catch (err) {
        // Handle validation errors
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message).join(', ');
            return next(new ErrorResponse(message, 400));
        }
        next(err);
    }
};

// @desc    Get all projects (with filtering and pagination)
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
    try {
        console.log('getProjects called with query:', req.query);
        console.log('User authenticated:', !!req.user);
        
        // First, let's check if there are any projects at all
        const totalProjects = await Project.countDocuments({});
        console.log('Total projects in database:', totalProjects);
        
        let query = {};

        // Filter by technology
        if (req.query.tech) {
            query.techStack = { $in: [req.query.tech] };
        }

        // Filter by user
        if (req.query.user) {
            query.user = req.query.user;
        }

        // Filter by status
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Show all projects for now (for debugging)
        // We'll add the privacy filter back once we confirm projects are being retrieved
        console.log('Skipping privacy filter for debugging...');

        console.log('Final query:', query);

        // Search functionality
        if (req.query.search) {
            query.$text = { $search: req.query.search };
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        console.log('Pagination - page:', page, 'limit:', limit, 'startIndex:', startIndex);

        // Execute query
        const projects = await Project.find(query)
            .populate('user', 'username avatar firstName lastName')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(startIndex);

        console.log('Found projects:', projects.length);
        console.log('Projects sample:', projects.slice(0, 2)); // Log first 2 projects

        // Get total count for pagination
        const total = await Project.countDocuments(query);

        console.log('Total count:', total);

        // Pagination result
        const pagination = {};
        if (startIndex + limit < total) {
            pagination.next = { page: page + 1, limit };
        }
        if (startIndex > 0) {
            pagination.prev = { page: page - 1, limit };
        }

        res.status(200).json({
            success: true,
            count: projects.length,
            total,
            pagination,
            data: projects
        });
    } catch (err) {
        console.error('Error in getProjects:', err);
        next(err);
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('user', 'username avatar bio location')
            .populate('likes', 'username avatar');

        if (!project) {
            return next(new ErrorResponse('Project not found', 404));
        }

        // Debug logging
        console.log('getProject Debug:', {
            projectId: req.params.id,
            projectUserId: project.user._id.toString(),
            currentUserId: req.user?.id,
            isPublic: project.isPublic,
            hasUser: !!req.user
        });

        // Check if project is private and user is not the owner
        if (!project.isPublic && (!req.user || req.user.id !== project.user._id.toString())) {
            return next(new ErrorResponse('Not authorized to view this project', 403));
        }

        // Increment view count (only if not the owner)
        if (!req.user || req.user.id !== project.user._id.toString()) {
            await Project.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        }

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return next(new ErrorResponse('Project not found', 404));
        }
        next(err);
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return next(new ErrorResponse('Project not found', 404));
        }

        // Make sure user is project owner
        if (project.user.toString() !== req.user.id) {
            return next(new ErrorResponse('Not authorized to update this project', 403));
        }

        // Fields that are allowed to be updated
        const allowedFields = [
            'title', 'description', 'category', 'tags', 'featured',
            'longDescription', 'features', 'challenges', 'learnings', 'futureEnhancements',
            'techStack', 'architecture', 'deployment', 'database', 'apiDocumentation',
            'githubUrl', 'liveUrl', 'documentationUrl', 'additionalLinks',
            'coverImage', 'screenshots', 'videos', 'logo',
            'isOpenSource', 'acceptingContributions', 'collaborators', 'license',
            'status', 'isPublic', 'showInPortfolio', 'allowComments'
        ];

        // Filter update data
        const updateData = {};
        Object.keys(req.body).forEach(key => {
            if (allowedFields.includes(key)) {
                updateData[key] = req.body[key];
            }
        });

        project = await Project.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate('user', 'username avatar');

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message).join(', ');
            return next(new ErrorResponse(message, 400));
        }
        if (err.kind === 'ObjectId') {
            return next(new ErrorResponse('Project not found', 404));
        }
        next(err);
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return next(new ErrorResponse('Project not found', 404));
        }

        // Make sure user is project owner
        if (project.user.toString() !== req.user.id) {
            return next(new ErrorResponse('Not authorized to delete this project', 403));
        }

        await Project.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return next(new ErrorResponse('Project not found', 404));
        }
        next(err);
    }
};

// @desc    Get current user's projects
// @route   GET /api/projects/me
// @access  Private
exports.getMyProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({ user: req.user.id })
            .populate('user', 'username avatar')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Like/Unlike a project
// @route   PUT /api/projects/:id/like
// @access  Private
exports.toggleLike = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return next(new ErrorResponse('Project not found', 404));
        }

        // Check if project is public or user is owner
        if (!project.isPublic && project.user.toString() !== req.user.id) {
            return next(new ErrorResponse('Not authorized to like this project', 403));
        }

        const likeIndex = project.likes.indexOf(req.user.id);

        if (likeIndex === -1) {
            // Add like
            project.likes.push(req.user.id);
        } else {
            // Remove like
            project.likes.splice(likeIndex, 1);
        }

        await project.save();

        res.status(200).json({
            success: true,
            data: {
                liked: likeIndex === -1,
                likeCount: project.likes.length
            }
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return next(new ErrorResponse('Project not found', 404));
        }
        next(err);
    }
};

// @desc    Get projects by technology
// @route   GET /api/projects/tech/:tech
// @access  Public
exports.getProjectsByTech = async (req, res, next) => {
    try {
        const projects = await Project.find({
            techStack: { $in: [req.params.tech] },
            isPublic: true
        })
            .populate('user', 'username avatar')
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (err) {
        next(err);
    }
};