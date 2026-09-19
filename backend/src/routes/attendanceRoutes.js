import express from "express";
import requireAuth from "../middlewares/authMiddleware.js";
import { checkIn, checkOut, getTodayAttendance } from "../controllers/attendanceControllers.js";

const router = express.Router();

router.use(requireAuth);

router.post("/checkin", checkIn);
router.post("/checkout", checkOut);
router.get("/today", getTodayAttendance);

export default router;
