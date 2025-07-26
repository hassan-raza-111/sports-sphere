import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config.js';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    try {
      const newSocket = io(SOCKET_URL, {
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on('connect', () => {
        console.log('Connected to socket server');
        setIsConnected(true);
        setConnectionError(false);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from socket server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.log('Socket connection error:', error);
        setConnectionError(true);
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } catch (error) {
      console.log('Socket initialization error:', error);
      setConnectionError(true);
    }
  }, []);

  const joinRoom = (userId) => {
    if (socket && userId && isConnected) {
      socket.emit('join', userId);
    }
  };

  const sendMessage = (data) => {
    if (socket && isConnected) {
      socket.emit('send_message', data);
    } else {
      console.log(
        'Socket not connected, message will be sent via REST API only'
      );
    }
  };

  const sendTypingIndicator = (data) => {
    if (socket && isConnected) {
      socket.emit('typing', data);
    }
  };

  const value = {
    socket,
    isConnected,
    connectionError,
    joinRoom,
    sendMessage,
    sendTypingIndicator,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
