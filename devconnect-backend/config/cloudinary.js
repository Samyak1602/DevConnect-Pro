const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuration function to be called after environment variables are loaded
function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Function to create avatar storage (called only when needed)
function createAvatarStorage() {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'devconnect-pro/avatars',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto' }
      ]
    },
  });
}

// Function to create project image storage (called only when needed)
function createProjectImageStorage() {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'devconnect-pro/projects',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [
        { width: 800, height: 600, crop: 'fill' },
        { quality: 'auto' }
      ]
    },
  });
}

// Function to create multer middleware for project images (called only when needed)
function createUploadProjectImage() {
  return multer({
    storage: createProjectImageStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
  });
}

// For avatar uploads - create with lazy storage
const uploadAvatar = multer({
  storage: createAvatarStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

module.exports = {
  cloudinary,
  uploadAvatar,
  createUploadProjectImage,
  configureCloudinary
};