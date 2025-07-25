import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import socketService from '../services/socketService';

export const useSocket = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('token');
      
      if (token && !socketService.isConnected()) {
        // Connect to socket
        socketService.connect(token);

        // Listen for online users
        socketService.onOnlineUsers((users) => {
          setOnlineUsers(users);
        });
      }
    } else {
      // Disconnect socket if user is not authenticated
      socketService.disconnect();
      setOnlineUsers([]);
    }

    // Cleanup on unmount or when auth state changes
    return () => {
      if (!isAuthenticated) {
        socketService.disconnect();
      }
    };
  }, [isAuthenticated, user]);

  return {
    socket: socketService.getSocket(),
    onlineUsers,
    isConnected: socketService.isConnected()
  };
};
