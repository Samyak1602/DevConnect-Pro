const User = require('../models/User');
const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');
const { cloudinary } = require('../config/cloudinary');

// @desc    Upload avatar for current user
// @route   POST /api/uploads/avatar
// @access  Private
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse('Please upload an image file', 400));
    }

    // Update user's avatar URL in database
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.path },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatar: req.file.path,
        user: user
      }
    });
  } catch (err) {
    // If there's an error, delete the uploaded image from Cloudinary
    if (req.file && req.file.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    next(err);
  }
};

// @desc    Upload cover image for project
// @route   POST /api/uploads/project/:projectId
// @access  Private
exports.uploadProjectCover = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse('Please upload an image file', 400));
    }

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return next(new ErrorResponse('Project not found', 404));
    }

    // Make sure user is project owner
    if (project.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to update this project', 403));
    }

    // Delete old cover image from Cloudinary if it exists and is not the default
    if (project.coverImage && !project.coverImage.includes('placeholder')) {
      const publicId = project.coverImage.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`devconnect-pro/projects/${publicId}`);
    }

    // Update project's cover image URL in database
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      { coverImage: req.file.path },
      { new: true, runValidators: true }
    ).populate('user', 'username avatar');

    res.status(200).json({
      success: true,
      message: 'Project cover image uploaded successfully',
      data: {
        coverImage: req.file.path,
        project: updatedProject
      }
    });
  } catch (err) {
    // If there's an error, delete the uploaded image from Cloudinary
    if (req.file && req.file.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    next(err);
  }
};