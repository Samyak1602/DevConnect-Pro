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
        // Fields that are allowed to be updated
        const allowedFields = ['username', 'email', 'bio', 'avatar', 'skills', 'location'];
        
        // Create an object with only allowed fields
        const updateData = {};
        Object.keys(req.body).forEach(key => {
            if (allowedFields.includes(key)) {
                updateData[key] = req.body[key];
            }
        });

        // If no valid fields to update
        if (Object.keys(updateData).length === 0) {
            return next(new ErrorResponse('No valid fields provided for update', 400));
        }

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

        // Check if username is being updated and already exists
        if (updateData.username) {
            const usernameExists = await User.findOne({ 
                username: updateData.username, 
                _id: { $ne: req.user.id } // Exclude current user
            });
            if (usernameExists) {
                return next(new ErrorResponse('Username already in use', 400));
            }
        }

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