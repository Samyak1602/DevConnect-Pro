const express = require('express')
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const {
    getUsersForSidebar,
    getMessages,
    sendMessages
} = require("../controllers/messageController");

router.get("/users",authMiddleware(),getUsersForSidebar)
router.get("/:id",authMiddleware(),getMessages);

router.post("/send/:id",authMiddleware(),sendMessages);

module.exports = router;