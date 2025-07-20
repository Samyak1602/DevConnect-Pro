const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoute = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const projectRoutes = require('./routes/projectRoute');
const uploadRoutes = require('./routes/uploadRoute');
const connectDB = require('./config/db');
const ErrorResponse = require('./utils/errorResponse');

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/uploads', uploadRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'DevConnect Pro Backend API',
    status: 'Server is running successfully!'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Multer error handling
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large';
    error = new ErrorResponse(message, 400);
  }

  if (err.message === 'Only image files are allowed!') {
    error = new ErrorResponse(err.message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
