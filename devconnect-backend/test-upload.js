// Test the fixed upload system
require('dotenv').config();

console.log('Testing fixed upload system...');

try {
  const { cloudinary, configureCloudinary, createUploadProjectImage } = require('./config/cloudinary');
  
  // Configure Cloudinary
  configureCloudinary();
  
  // Create upload middleware
  const uploadMiddleware = createUploadProjectImage();
  
  console.log('✅ Success! Upload system working correctly');
  console.log('- Cloudinary configured:', !!cloudinary.config().cloud_name);
  console.log('- Upload middleware created:', typeof uploadMiddleware);
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
