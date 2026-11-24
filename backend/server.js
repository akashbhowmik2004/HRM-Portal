import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";

import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import requireAuth from "./src/middlewares/authMiddleware.js";
import employeeRoutes from "./src/routes/employeeRoutes.js";
import attendanceRoutes from "./src/routes/attendanceRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import issueRoutes from "./src/routes/issueRoutes.js";
import Notification from "./src/models/Notification.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import documentRoutes from "./src/routes/documentRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/employee", requireAuth, employeeRoutes);
app.use("/api/admin", requireAuth, adminRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/documents", requireAuth, documentRoutes);

// Socket.io mapping
export const userSockets = new Map();

io.on("connection", (socket) => {
  const cookies = Object.fromEntries(
    (socket.handshake.headers.cookie || "")
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .filter(([name]) => name)
      .map(([name, value]) => [name, decodeURIComponent(value || "")]),
  );
  const token = cookies.jwt;

  let userId = null;
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
  console.log(`User ${userId} connected to Socket.IO`, socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

export const emitNotification = async (userId, title, message) => {
  try {
    const newNotification = await Notification.create({ userId, title, message });
    io.to(`user:${userId.toString()}`).emit("newNotification", newNotification);
    return newNotification;
  } catch (error) {
    console.error("Error emitting notification:", error);
  }
};

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
