import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";

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

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
  console.log("A user connected", socket.id);
  
  socket.on("register", (userId) => {
    userSockets.set(userId, socket.id);
    console.log("Registered user", userId, "with socket", socket.id);
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        break;
      }
    }
    console.log("User disconnected", socket.id);
  });
});

export const emitNotification = async (userId, title, message) => {
  try {
    const newNotification = await Notification.create({ userId, title, message });
    const socketId = userSockets.get(userId.toString());
    if (socketId) {
      io.to(socketId).emit("newNotification", newNotification);
    }
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
