import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  // Initialize socket connection
  connect(token) {
    if (!token) {
      console.error('No token provided for socket connection');
      return;
    }

    this.socket = io('http://localhost:5000', {
      auth: {
        token: token
      },
      autoConnect: true
    });

    this.socket.on('connect', () => {
      console.log('Connected to server with socket ID:', this.socket.id);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
    });

    return this.socket;
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }

  // Check if socket is connected
  isConnected() {
    return this.socket && this.socket.connected;
  }

  // Listen for new messages
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('newMessage', callback);
    }
  }

  // Remove new message listener
  offNewMessage() {
    if (this.socket) {
      this.socket.off('newMessage');
    }
  }

  // Listen for online users
  onOnlineUsers(callback) {
    if (this.socket) {
      this.socket.on('getOnlineUsers', callback);
    }
  }

  // Remove online users listener
  offOnlineUsers() {
    if (this.socket) {
      this.socket.off('getOnlineUsers');
    }
  }

  // Listen for typing indicators
  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  // Remove typing listener
  offUserTyping() {
    if (this.socket) {
      this.socket.off('user_typing');
    }
  }

  // Emit typing status
  emitTyping(receiverId, isTyping) {
    if (this.socket) {
      this.socket.emit('typing', { receiverId, isTyping });
    }
  }

  // Join a conversation room
  joinConversation(conversationId) {
    if (this.socket) {
      this.socket.emit('join_conversation', conversationId);
    }
  }

  // Leave a conversation room
  leaveConversation(conversationId) {
    if (this.socket) {
      this.socket.emit('leave_conversation', conversationId);
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;
