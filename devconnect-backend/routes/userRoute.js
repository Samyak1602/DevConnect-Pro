const express = require('express')
const router = express.Router();

const {
    getMe, 
    updateMe, 
    getUserByUsername, 
    getUserProjects, 
    getUserStats, 
    followUser, 
    unfollowUser
} = require('../controllers/userController');

const authMiddleware = require('../middlewares/authMiddleware');

// Protected routes (require authentication)
router.get('/me', authMiddleware(), getMe);
router.put('/me', authMiddleware(), updateMe);

// Profile routes (some require auth, some don't)
router.get('/:username', authMiddleware(false), getUserByUsername); // Optional auth
router.get('/:username/projects', authMiddleware(), getUserProjects); // Requires auth
router.get('/:username/stats', getUserStats); // Public
router.post('/:username/follow', authMiddleware(), followUser); // Requires auth
router.delete('/:username/follow', authMiddleware(), unfollowUser); // Requires auth

module.exports = router;