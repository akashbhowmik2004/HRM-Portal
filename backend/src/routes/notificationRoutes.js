import express from "express";
import requireAuth from "../middlewares/authMiddleware.js";
import { getNotifications, dismissNotification, markAllAsRead } from "../controllers/notificationControllers.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getNotifications);
router.put("/:id/dismiss", dismissNotification);
router.put("/dismiss-all", markAllAsRead);

export default router;
