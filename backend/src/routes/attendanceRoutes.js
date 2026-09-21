import express from "express";
import requireAuth from "../middlewares/authMiddleware.js";
import { getTodayAttendance, getMyAttendance, getAllAttendance, getTodayStatus, checkInWebcam } from "../controllers/attendanceControllers.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(requireAuth);

router.post("/checkin-webcam", checkInWebcam);
router.get("/today", getTodayAttendance);
router.get("/me", getMyAttendance);
router.get("/all", authorizeRoles("hr", "admin"), getAllAttendance);
router.get("/today-status", authorizeRoles("hr", "admin"), getTodayStatus);

export default router;
