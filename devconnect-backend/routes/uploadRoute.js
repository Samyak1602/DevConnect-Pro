const express = require('express');
const router = express.Router();

// Import controllers and middleware
const { 
  uploadAvatar, 
  uploadProjectCover, 
  deleteImage 
} = require('../controllers/uploadController');

const authMiddleware = require('../middlewares/authMiddleware');
const { uploadAvatar: avatarUpload, uploadProjectImage } = require('../config/cloudinary');

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
  uploadProjectImage.single('coverImage'), 
  uploadProjectCover
);



module.exports = router;