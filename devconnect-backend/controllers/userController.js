const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse');


exports.getMe = async (req, res, next) => {
    try {
        // Use req.user.id from authMiddleware, not req.params.id
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

exports.updateMe = async (req, res, next) => {
    try {
        // Fields that are allowed to be updated (username is auto-generated and not updateable)
        const allowedFields = ['firstName', 'lastName', 'email', 'bio', 'avatar', 'skills', 'location', 'title', 'company', 'website', 'github', 'linkedin', 'twitter'];
        
        // Create an object with only allowed fields
        const updateData = {};
        Object.keys(req.body).forEach(key => {
            if (allowedFields.includes(key)) {
                updateData[key] = req.body[key];
            }
        });

        // Handle location field - convert string to object format if needed
        if (updateData.location && typeof updateData.location === 'string') {
            // If location is a string, convert it to the object format expected by the model
            const locationParts = updateData.location.split(',').map(part => part.trim());
            updateData.location = {
                city: locationParts[0] || '',
                state: locationParts[1] || '',
                country: locationParts[2] || locationParts[1] || '' // If only 2 parts, assume city, country
            };
        }

        // If no valid fields to update
        if (Object.keys(updateData).length === 0) {
            return next(new ErrorResponse('No valid fields provided for update', 400));
        }

        console.log('UpdateMe: Received data:', req.body);
        console.log('UpdateMe: Filtered data:', updateData);

        // Check if email is being updated and already exists
        if (updateData.email) {
            const emailExists = await User.findOne({ 
                email: updateData.email, 
                _id: { $ne: req.user.id } // Exclude current user
            });
            if (emailExists) {
                return next(new ErrorResponse('Email already in use', 400));
            }
        }

        console.log('UpdateMe: User ID from token:', req.user.id);
        console.log('UpdateMe: Received data:', req.body);
        console.log('UpdateMe: Filtered data:', updateData);

        // Update user
        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            {
                new: true, // Return updated document
                runValidators: true // Run schema validators
            }
        ).select('-password');

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        console.log('UpdateMe: Updated user:', user);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        // Handle mongoose validation errors
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message).join(', ');
            return next(new ErrorResponse(message, 400));
        }
        
        // Handle duplicate key errors
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
            return next(new ErrorResponse(message, 400));
        }
        
        next(err);
    }
};

// Get user profile by username
exports.getUserByUsername = async (req, res, next) => {
    try {
        const { username } = req.params;
        
        // Determine what fields to select based on whether this is the user's own profile
        let selectFields = '-password';
        if (!req.user || !req.user.id) {
            // If not authenticated, hide email
            selectFields = '-password -email';
        } else {
            // Check if this is the user's own profile
            const isOwnProfile = await User.findOne({ username, _id: req.user.id });
            if (!isOwnProfile) {
                // If viewing someone else's profile, hide email
                selectFields = '-password -email';
            }
        }
        
        const user = await User.findOne({ username }).select(selectFields);
        
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Check if current user is following this user (if authenticated)
        let isFollowedByCurrentUser = false;
        if (req.user && req.user.id) {
            const currentUser = await User.findById(req.user.id);
            isFollowedByCurrentUser = currentUser.following && currentUser.following.includes(user._id);
        }

        res.status(200).json({
            success: true,
            data: {
                ...user.toObject(),
                isFollowedByCurrentUser
            }
        });
    } catch (err) {
        next(err);
    }
};

// Get user projects by username  
exports.getUserProjects = async (req, res, next) => {
    try {
        const { username } = req.params;
        
        const user = await User.findOne({ username });
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Get public projects for this user, or all projects if viewing own profile
        const Project = require('../models/Project');
        let query = { user: user._id };
        
        // If not viewing own profile, only show public projects
        if (!req.user || req.user.id !== user._id.toString()) {
            query.isPublic = true;
            query.showInPortfolio = true;
        }

        const projects = await Project.find(query)
            .populate('user', 'username avatar')
            .sort({ featured: -1, createdAt: -1 }); // Featured projects first, then by creation date

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (err) {
        next(err);
    }
};

// Get user stats
exports.getUserStats = async (req, res, next) => {
    try {
        const { username } = req.params;
        
        const user = await User.findOne({ username });
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        const Project = require('../models/Project');
        const projectCount = await Project.countDocuments({ createdBy: user._id });

        const stats = {
            followers: user.followers ? user.followers.length : 0,
            following: user.following ? user.following.length : 0,
            projects: projectCount,
            contributions: 0, // This would need to be calculated based on actual data
            endorsements: 0, // This would need to be implemented
            profileViews: user.profileViews || 0
        };

        res.status(200).json({
            success: true,
            stats
        });
    } catch (err) {
        next(err);
    }
};

// Follow user
exports.followUser = async (req, res, next) => {
    try {
        const { username } = req.params;
        const currentUserId = req.user.id;
        
        // Find target user
        const targetUser = await User.findOne({ username });
        if (!targetUser) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Can't follow yourself
        if (targetUser._id.toString() === currentUserId) {
            return next(new ErrorResponse('Cannot follow yourself', 400));
        }

        // Get current user
        const currentUser = await User.findById(currentUserId);
        
        // Check if already following
        if (currentUser.following && currentUser.following.includes(targetUser._id)) {
            return next(new ErrorResponse('Already following this user', 400));
        }

        // Add to following list
        if (!currentUser.following) currentUser.following = [];
        currentUser.following.push(targetUser._id);
        await currentUser.save();

        // Add to followers list
        if (!targetUser.followers) targetUser.followers = [];
        targetUser.followers.push(currentUserId);
        await targetUser.save();

        res.status(200).json({
            success: true,
            message: 'User followed successfully'
        });
    } catch (err) {
        next(err);
    }
};

// Unfollow user
exports.unfollowUser = async (req, res, next) => {
    try {
        const { username } = req.params;
        const currentUserId = req.user.id;
        
        // Find target user
        const targetUser = await User.findOne({ username });
        if (!targetUser) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Get current user
        const currentUser = await User.findById(currentUserId);
        
        // Check if following
        if (!currentUser.following || !currentUser.following.includes(targetUser._id)) {
            return next(new ErrorResponse('Not following this user', 400));
        }

        // Remove from following list
        currentUser.following = currentUser.following.filter(id => id.toString() !== targetUser._id.toString());
        await currentUser.save();

        // Remove from followers list
        if (targetUser.followers) {
            targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);
            await targetUser.save();
        }

        res.status(200).json({
            success: true,
            message: 'User unfollowed successfully'
        });
    } catch (err) {
        next(err);
    }
};