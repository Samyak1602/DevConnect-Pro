const express = require('express');
const router = express.Router();

// Import all controller methods
const {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
    getMyProjects,
    toggleLike,
    getProjectsByTech
} = require("../controllers/projectController");

const authMiddleware = require('../middlewares/authMiddleware');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
router.post('/', authMiddleware(), createProject);

// @desc    Get all projects (with filtering, search, pagination)
// @route   GET /api/projects
// @access  Public
router.get('/', getProjects);

// @desc    Get current user's projects
// @route   GET /api/projects/me
// @access  Private
router.get('/me', authMiddleware(), getMyProjects); // Fixed: should be GET, not POST

// @desc    Get projects by technology
// @route   GET /api/projects/tech/:tech
// @access  Public
router.get('/tech/:tech', getProjectsByTech);

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public (with optional auth for private projects)
router.get('/:id', authMiddleware(false), getProject);

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Owner only)
router.put('/:id', authMiddleware(), updateProject);

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Owner only)
router.delete('/:id', authMiddleware(), deleteProject);

// @desc    Like/Unlike a project
// @route   PUT /api/projects/:id/like
// @access  Private
router.put('/:id/like', authMiddleware(), toggleLike);

module.exports = router;