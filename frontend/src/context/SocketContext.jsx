import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { auth } from '../apis/axios.js';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let newSocket = null;
    let cancelled = false;

    const verifyUser = async () => {
      try {
        const res = await auth.get("/verify");
        if (!cancelled && res.data.success) {
          const backendUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000")
            .replace(/\/api\/?$/, "");
          newSocket = io(
            backendUrl,
            {
              withCredentials: true,
              reconnection: true,
              reconnectionAttempts: Infinity,
              reconnectionDelay: 1000,
              reconnectionDelayMax: 5000,
            },
          );

          newSocket.on("connect_error", (error) => {
            console.error("Socket connection failed:", error.message);
          });

          setSocket(newSocket);
        }
      } catch (err) {
        console.error("Not authenticated");
      }
    };
    void verifyUser();

    return () => {
      cancelled = true;
      newSocket?.close();
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
