const express = require('express');
const router = express.Router();

// Import controllers and middleware
const { 
  uploadAvatar, 
  uploadProjectCover, 
  deleteImage 
} = require('../controllers/uploadController');

const authMiddleware = require('../middlewares/authMiddleware');
const { uploadAvatar: avatarUpload, createUploadProjectImage, configureCloudinary } = require('../config/cloudinary');

// @desc    Upload avatar
// @route   POST /api/uploads/avatar
// @access  Private
router.post('/avatar', 
  authMiddleware(), 
  avatarUpload.single('avatar'), 
  uploadAvatar
);

// @desc    Upload project cover image
// @route   POST /api/uploads/project/:projectId
// @access  Private
router.post('/project/:projectId', 
  authMiddleware(), 
  (req, res, next) => {
    // Configure Cloudinary and create upload middleware
    configureCloudinary();
    const uploadProjectImage = createUploadProjectImage();
    uploadProjectImage.single('coverImage')(req, res, next);
  },
  uploadProjectCover
);



module.exports = router;