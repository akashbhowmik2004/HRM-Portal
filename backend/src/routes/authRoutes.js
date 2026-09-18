import { Router } from "express";
import { requestOTP, verifyOTP, logout, verifyUsers } from "../controllers/authControllers.js";
import { getAllAnnouncements } from "../controllers/adminControllers.js";
import requireAuth from "../middlewares/authMiddleware.js";
const router = Router();

router.get("/verify", requireAuth, verifyUsers);
router.get("/announcements", requireAuth, getAllAnnouncements);
router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTP);
router.post("/logout", logout);

export default router;
