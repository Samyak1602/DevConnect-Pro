const jwt = require('jsonwebtoken');

// Store online users with their socket IDs
const userSocketMap = new Map();

const initializeSocket = (io) => {
  // Socket authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.user = decoded;
      next();
    } catch (error) {
      console.log('Socket authentication error:', error.message);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    
    // Store user's socket connection
    userSocketMap.set(socket.userId, socket.id);
    
    // Emit updated online users list to all connected clients
    io.emit('getOnlineUsers', Array.from(userSocketMap.keys()));

    // Handle joining a conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${socket.userId} joined conversation: ${conversationId}`);
    });

    // Handle leaving a conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(conversationId);
      console.log(`User ${socket.userId} left conversation: ${conversationId}`);
    });

    // Handle user typing
    socket.on('typing', ({ receiverId, isTyping }) => {
      const receiverSocketId = userSocketMap.get(receiverId);
      if (receiverSocketId) {
        socket.to(receiverSocketId).emit('user_typing', {
          senderId: socket.userId,
          isTyping
        });
      }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      userSocketMap.delete(socket.userId);
      
      // Emit updated online users list to all connected clients
      io.emit('getOnlineUsers', Array.from(userSocketMap.keys()));
    });
  });
};

// Function to get socket ID for a specific user
const getSocketId = (userId) => {
  return userSocketMap.get(userId);
};

// Function to get all online users
const getOnlineUsers = () => {
  return Array.from(userSocketMap.keys());
};

module.exports = {
  initializeSocket,
  getSocketId,
  getOnlineUsers
};
