import {Router} from "express";

import { getAllUsers, createUser, createEmployee, getLeaveRequests, acceptLeaveRequest, rejectLeaveRequest } from "../controllers/adminControllers.js";

const router = Router();

router.get("/", getAllUsers);
router.post("/create-user", createUser);
router.post("/create-employee", createEmployee);
router.get("/leave-requests", getLeaveRequests);
router.put("/leave-requests/accept/:leaveId", acceptLeaveRequest);
router.put("/leave-requests/reject/:leaveId", rejectLeaveRequest);
export default router;