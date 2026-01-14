import { io as socketIO } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

let socket = null;

export const initializeSocket = (token) => {
  // 1. CRITICAL GUARD: Don't connect if no token
  if (!token) {
    console.error('Socket initialization failed: No token provided.');
    return null;
  }

  if (socket?.connected) {
    return socket;
  }

  socket = socketIO(SOCKET_URL, {
    auth: {
      token: token,
    },
    transports: ['websocket', 'polling'],
  });

  // ... keep your event listeners ...
  
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  return socket;
};

export const joinOrderRoom = (orderId) => {
  if (socket && socket.connected) {
    socket.emit('join:order', orderId);
  }
};

export const leaveOrderRoom = (orderId) => {
  if (socket && socket.connected) {
    socket.emit('leave:order', orderId);
  }
};

