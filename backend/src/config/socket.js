import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Notification from "../models/Notification.js";

let io = null;

export const initSocket = (httpServer, allowedOrigins) => {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const cookies = Object.fromEntries(
      (socket.handshake.headers.cookie || "")
        .split(";")
        .map((cookie) => cookie.trim().split("="))
        .filter(([name]) => name)
        .map(([name, value]) => [name, decodeURIComponent(value || "")]),
    );

    let userId = null;
    try {
      if (cookies.jwt) {
        const decoded = jwt.verify(cookies.jwt, process.env.JWT_SECRET);
        userId = decoded.id;
      }
    } catch (error) {
      console.warn("Socket authentication failed:", error.message);
    }

    if (!userId) {
      socket.emit("unauthorized");
      socket.disconnect(true);
      return;
    }

    socket.data.userId = userId;
    socket.join(`user:${userId}`);
  });

  return io;
};

export const emitNotification = async (userId, title, message) => {
  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
    });

    if (io) {
      io.to(`user:${userId.toString()}`).emit("newNotification", notification);
    }

    return notification;
  } catch (error) {
    console.error("Error emitting notification:", error);
  }
};

export default io;
