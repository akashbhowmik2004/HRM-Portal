import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { auth } from '../apis/axios.js';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch user details to get ID
    const verifyUser = async () => {
      try {
        const res = await auth.get("/verify");
        if (res.data.success) {
          setUserId(res.data.user._id);
        }
      } catch (err) {
        console.error("Not authenticated");
      }
    };
    verifyUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:3000", {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      newSocket.emit("register", userId);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
