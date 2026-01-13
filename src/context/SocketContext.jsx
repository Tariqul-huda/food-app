import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { initializeSocket, disconnectSocket, getSocket } from '../socket/socketClient';

const SocketContext = createContext(undefined);

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const socket = initializeSocket(token);
        
        socket.on('connect', () => {
          setSocketConnected(true);
        });

        socket.on('disconnect', () => {
          setSocketConnected(false);
        });

        return () => {
          disconnectSocket();
          setSocketConnected(false);
        };
      }
    } else {
      disconnectSocket();
      setSocketConnected(false);
    }
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={{ socket: getSocket(), socketConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

